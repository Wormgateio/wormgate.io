import { Interface, InterfaceAbi, ethers } from "ethers";
import { hexToNumber } from "web3-utils";
import axios, { AxiosResponse } from "axios";

import lzAbi from "./abi.json";
import hyperlineAbi from "./hyperlane-abi.json";
import ABI_RELAYER from './abi-relayer.json';
import ABI_REFUEL from './abi-refuel.json';
import { NetworkName } from "../common/enums/NetworkName";
import { LZ_CONTRACT_ADDRESS, CONTRACT_REFUEL_ADDRESS, DEFAULT_REFUEL_COST_USD, LZ_RELAYER } from "../common/constants";
import { AccountDto } from "../common/dto/AccountDto";
import { wait } from "../utils/wait";
import { ChainDto } from "../common/dto/ChainDto";
import { BridgeType } from "../common/enums/BridgeType";
import { getBlockIds } from "./helpers/getBlockIds";
import { LZ_VERSION } from "./constants";
import { estimateFeeForBridge } from "./helpers";

interface ChainToSend {
    id: number;
    name: string;
    network: string;
    lzChain: number | null;
    hyperlaneChain: number | null;
    token: string;
}

interface ControllerFunctionProps {
    account: AccountDto | null;
    accountAddress: string;
    contractAddress: string;
    chainToSend: ChainToSend;
    bridgeType: BridgeType,
    nftsCount?: number
}

interface ControllerFunctionResult {
    result: boolean;
    message: string;
    receipt?: any;
    transactionHash: string;
    blockIds?: number[];
}

const TRANSACTION_WAIT: number = 60000;

const getAbi = (type: BridgeType): InterfaceAbi => {
    if (type === BridgeType.LayerZero) {
        return lzAbi;
    }

    if (type === BridgeType.Hyperlane) {
        return hyperlineAbi;
    }

    return lzAbi;
}


/**
 * Mint NFT Functionality
 * @param contractAddress Contract address for selected chain
 * @param chainToSend Current chain to send NFT
 * @param account User account
 */
export const mintNFT = async ({ contractAddress, bridgeType, chainToSend, account, nftsCount = 1 }: ControllerFunctionProps): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const abi = getAbi(bridgeType);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const mintFee = await contract.mintFee();

    const userBalance = await provider.getBalance(sender);

    if (userBalance < mintFee) {
        return {
            result: false,
            message: 'Not enough funds to mint',
            transactionHash: ''
        };
    }

    let options: any = { value: BigInt(mintFee) * BigInt(nftsCount) };

    let gasLimit, txResponse;

    if (account?.refferer) {
        const args = [nftsCount, account.refferer]

        if (bridgeType === BridgeType.LayerZero) {
            gasLimit = await contract.batchMint.estimateGas(...args, options);
            options.gasLimit = gasLimit;
            txResponse = await contract.batchMint(...args, options);
        } else {
            gasLimit = await contract.batchMintWithReferrer.estimateGas(...args, options);
            options.gasLimit = gasLimit;
            txResponse = await contract.batchMintWithReferrer(...args, options);
        }
    } else {
        const args: (string | number)[] = [nftsCount]

        if (bridgeType === BridgeType.LayerZero) {
            args.push(contractAddress)
        }

        gasLimit = await contract.batchMint.estimateGas(...args, options)
        options.gasLimit = gasLimit;

        txResponse = await contract.batchMint(...args, options);
    }

    await wait();

    // Magic for working functionality. Don't remove
    console.log("Minting..", { id: chainToSend.id, network: chainToSend.network, hash: txResponse?.hash });

    const receipt = await txResponse.wait(null, TRANSACTION_WAIT);

    const iface = new Interface(abi);
    const blockIds = getBlockIds(receipt.logs, iface)

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        transactionHash: txResponse?.hash,
        receipt,
        blockIds
    }
}

export interface EstimationBridge {
    network: NetworkName;
    price: string;
}

export type EstimationBridgeType = (EstimationBridge | null)[]

export const estimateBridge = async (
    chains: ChainDto[],
    token: string,
    { contractAddress, bridgeType }: Pick<ControllerFunctionProps, 'contractAddress' | 'bridgeType'>,
    tokenId: number,
    refuel: boolean = false,
    refuelCost: number = DEFAULT_REFUEL_COST_USD
): Promise<EstimationBridgeType> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const price = await fetchPrice(token);

    const abi = getAbi(bridgeType);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const list = await Promise.allSettled(chains.map(chain => {
        return estimateFeeForBridge(
            contract, 
            sender, 
            bridgeType, 
            refuel,
            refuelCost,
            price, 
            tokenId,
            {
                id: chain.chainId,
                name: chain.name,
                network: chain.network,
                lzChain: chain.lzChain,
                hyperlaneChain: chain.hyperlaneChain,
                token: chain.token
            }
        )
    }));

    return list.filter(x => x.status === 'fulfilled').map((x: any) => x.value);
};


const lzBridge = async (
    { contractAddress, chainToSend, bridgeType }: ControllerFunctionProps,
    tokenId: number,
    refuel: boolean = false,
    refuelCost: number = DEFAULT_REFUEL_COST_USD
): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const _toAddress = ethers.solidityPacked(
        ["address"], [sender]
    );

    const abi = getAbi(bridgeType);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const _dstChainId = chainToSend?.lzChain;

    const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, LZ_VERSION);

    let adapterParams;
    if (refuel) {
        const price = await fetchPrice(chainToSend?.token);

        if (!price) {
            return {
                result: false,
                message: 'Something went wrong :(',
                transactionHash: ''
            }
        }

        const REFUEL_AMOUNT = (refuelCost / price).toFixed(8);

        const refuelAmountEth = ethers.parseUnits(
            REFUEL_AMOUNT,
            18
        );

        adapterParams = ethers.solidityPacked(
            ["uint16", "uint256", "uint256", "address"],
            [2, MIN_DST_GAS, refuelAmountEth, sender]
        );
    } else {
        adapterParams = ethers.solidityPacked(
            ["uint16", "uint256"],
            [LZ_VERSION, MIN_DST_GAS]
        );
    }

    const { nativeFee } = await contract.estimateSendFee(
        _dstChainId,
        _toAddress,
        tokenId,
        false,
        adapterParams
    );

    const userBalance = await provider.getBalance(sender);

    if (userBalance < nativeFee) {
        return {
            result: false,
            message: 'Not enough funds to send',
            transactionHash: ''
        }
    }

    const bridgeOptions = {
        value: nativeFee,
        gasLimit: BigInt(0)
    }

    bridgeOptions.gasLimit = await contract.sendFrom.estimateGas(
        sender,
        _dstChainId,
        _toAddress,
        tokenId,
        sender,
        ethers.ZeroAddress,
        adapterParams,
        bridgeOptions
    );

    const transaction = await contract.sendFrom(
        sender,
        _dstChainId,
        _toAddress,
        tokenId,
        sender,
        ethers.ZeroAddress,
        adapterParams,
        bridgeOptions
    );

    await wait();

    // Magic for working functionality. Don't remove
    console.log("Bridging..", { id: chainToSend?.id, name: chainToSend?.name, hash: transaction?.hash });

    const receipt = await transaction.wait(null, TRANSACTION_WAIT)

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        receipt,
        transactionHash: transaction?.hash
    };
};

const hyperlaneBridge = async (
    { contractAddress, chainToSend, bridgeType }: ControllerFunctionProps,
    tokenId: number,
): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const abi = getAbi(bridgeType);

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const _dstChainId = chainToSend?.hyperlaneChain;
    const _receiver = sender.replace('0x', '0x000000000000000000000000');

    const nativeFee = await contract.getHyperlaneMessageFee(_dstChainId);

    const userBalance = await provider.getBalance(sender);

    if (userBalance < nativeFee) {
        return {
            result: false,
            message: 'Not enough funds to send',
            transactionHash: ''
        }
    }

    const transaction = await contract.transferRemote(
        _dstChainId,
        _receiver,
        tokenId,
        {
            value: nativeFee + await contract.bridgeFee(),
        }
    );

    await wait();

    // Magic for working functionality. Don't remove
    console.log("Bridging..", { id: chainToSend?.id, name: chainToSend?.name, hash: transaction?.hash });

    const receipt = await transaction.wait(null, TRANSACTION_WAIT)

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        receipt,
        transactionHash: transaction?.hash
    };
}

/**
 * Bridge NFT Functionality
 * @param contractAddress Contract address for selected chain
 * @param chainToSend Current chain to send NFT
 * @param account User account
 * @param tokenId NFT token id for sending to another chain
 * @param refuel Refuel enabled
 * @param refuelCost Refuel cost in dollars
 *
 */
export const bridgeNFT = async (
    { contractAddress, chainToSend, bridgeType }: ControllerFunctionProps,
    tokenId: number,
    refuel: boolean = false,
    refuelCost: number = DEFAULT_REFUEL_COST_USD
): Promise<ControllerFunctionResult> => {
    if (bridgeType === BridgeType.LayerZero) {
        return lzBridge(
            {contractAddress, chainToSend, bridgeType, account: null, accountAddress: ''},
            tokenId,
            refuel,
            refuelCost
        );
    }

    if (bridgeType === BridgeType.Hyperlane) {
        return hyperlaneBridge(
            {contractAddress, chainToSend, bridgeType, account: null, accountAddress: ''},
            tokenId,
        );
    }

    return {
        result: false,
        message: 'Something went wrong :(',
        transactionHash: ''
    };
};

export async function refuel(fromChain: ChainDto, toChain: ChainDto, amount: string): Promise<any> {
    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        const signer = await provider.getSigner()
        const sender = await signer.getAddress()

        const contract = new ethers.Contract(CONTRACT_REFUEL_ADDRESS[fromChain.network as NetworkName], ABI_REFUEL, signer)

        const _dstChainId = toChain.lzChain;

        const _toAddress = ethers.solidityPacked(
            ["address"],
            [CONTRACT_REFUEL_ADDRESS[toChain.network as NetworkName]]
        )

        const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, 0)

        const _adapterParams = ethers.solidityPacked(
            ["uint16", "uint256", "uint256", "address"],
            [2, MIN_DST_GAS, ethers.parseUnits(amount, 'ether'), sender]
        )

        const feeEstimate = await contract.estimateSendFee(_dstChainId, _toAddress, _adapterParams)
        const nativeFee = BigInt(feeEstimate.nativeFee)

        const tx = await contract.refuel(_dstChainId, _toAddress, _adapterParams, { value: nativeFee })

        const receipt = await tx.wait()

        return {
            result: receipt.status === 1,
            msg: receipt.status === 1 ? 'Refuel successful' : 'Refuel failed',
            receipt,
            hash: tx?.hash
        }
    } catch (error) {
        return {
            result: false,
            msg: 'Refuel failed',
            hash: null
        };
    }
}

export async function claimReferralFee(chain: ChainDto) {
    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);

        const signer = await provider.getSigner();

        const contract = new ethers.Contract(LZ_CONTRACT_ADDRESS[chain.network as NetworkName], lzAbi, signer);

        const txResponse = await contract.claimReferrerEarnings();
        const receipt = await txResponse.wait(null, 60000);

        return {
            result: receipt.status === 1,
            message: receipt.status === 1
                ? 'Successful Claim'
                : (receipt.status == null ? 'Claim not confirmed' : 'Claim Failed'),
            receipt
        };
    } catch (e) {
        console.error(e);

        return {
            result: false,
            message: 'Something went wrong :(',
        }
    }
}

export async function getReffererEarnedInNetwork(chain: ChainDto, accountAddress: string) {
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const contract = new ethers.Contract(LZ_CONTRACT_ADDRESS[chain.network as NetworkName], lzAbi, provider);
    const earned = await contract.referrersEarnedAmount(accountAddress);
    return ethers.formatEther(earned);
}

export async function fetchPrice(symbol: string): Promise<number | null> {
    if (symbol) {
        let fetchSymbol = ""
        if (symbol == "MNT") {
            fetchSymbol = "MANTLE"
        } else {
            fetchSymbol = symbol
        }

        const url: string = `https://min-api.cryptocompare.com/data/price?fsym=${fetchSymbol.toUpperCase()}&tsyms=USDT`

        try {
            const response: AxiosResponse = await axios.get(url, { timeout: 10000 })

            if (response.status === 200 && response.data) {
                return parseFloat(response.data.USDT) || 0
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000))
                return fetchPrice(symbol)
            }
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return fetchPrice(symbol)
        }
    }

    return 0;
}

export async function getBalance(normalize = false) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner()
    const sender = await signer.getAddress()
    const balance = await provider.getBalance(sender)

    return (normalize ? ethers.formatEther(balance) : balance) || 0;
}

export async function getMaxTokenValueInDst(chainFrom: ChainDto, toChain: ChainDto, normalize = false) {
    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const relayer = LZ_RELAYER[chainFrom.network as NetworkName];

        if (!relayer) {
            return null;
        }

        const contract = new ethers.Contract(relayer, ABI_RELAYER, provider);
        const dstConfig = await contract.dstConfigLookup(toChain.lzChain.toString(), "2");

        return (normalize ? ethers.formatEther(dstConfig.dstNativeAmtCap) : dstConfig.dstNativeAmtCap) || null
    } catch (error) {
        return null;
    }
}

export async function estimateRefuelFee(fromChain: ChainDto, toChain: ChainDto, amount: string)
    : Promise<{ nativeFee: number | null, zroFee: number | null }> {
    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        const signer = await provider.getSigner()
        const sender = await signer.getAddress()

        const contract = new ethers.Contract(CONTRACT_REFUEL_ADDRESS[fromChain.network as NetworkName], ABI_REFUEL, signer)

        const MIN_DST_GAS = await contract.minDstGasLookup(toChain.lzChain, 0);

        const payload = ethers.solidityPacked(
            ["address"],
            [CONTRACT_REFUEL_ADDRESS[toChain.network as NetworkName]]
        )

        const adapterParams = ethers.solidityPacked(
            ["uint16", "uint256", "uint256", "address"],
            [2, MIN_DST_GAS, ethers.parseUnits(amount.toString(), 18), sender]
        )

        const { nativeFee, zroFee } = await contract.estimateSendFee(toChain.lzChain, payload, adapterParams);

        return {
            nativeFee: Number(ethers.formatUnits(nativeFee, 'ether')),
            zroFee: Number(ethers.formatUnits(zroFee, 'ether'))
        }
    } catch (error) {
        console.log(error);
        return { nativeFee: null, zroFee: null }
    }
}

export const convertAddress = (hexString: string): string => {
    try {
        if (hexString.startsWith('0x')) hexString = hexString.substring(2)

        const byteArray = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

        let binaryString = ''
        byteArray.forEach(byte => binaryString += String.fromCharCode(byte))

        binaryString = btoa(binaryString)
        return binaryString.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    } catch (error) {
        return ''
    }
}

export const decodeAddress = (encodedString: string): string => {
    try {
        encodedString = encodedString.replace(/-/g, '+').replace(/_/g, '/')

        const binaryString = atob(encodedString)

        let hexString = ''
        for (let i = 0; i < binaryString.length; i++) {
            let hex = binaryString.charCodeAt(i).toString(16)
            hexString += (hex.length === 2 ? hex : '0' + hex)
        }

        hexString = '0x' + hexString

        return hexString
    } catch (error) {
        return ''
    }
}