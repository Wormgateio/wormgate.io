'use client';

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { message, Space, Tabs } from 'antd';
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";

import styles from './page.module.scss';
import Card from "../../components/ui/Card/Card";
import SoonLabel from "../../components/SoonLabel/SoonLabel";
import MultipleMintForm, { MultipleMintFormData } from "./components/MultipleMintForm/MultipleMintForm";
import SingleMintForm, { SingleMintFormData } from "./components/SingleMintForm/SingleMintForm";
import AppStore from "../../store/AppStore";
import { mintNFT } from "../../core/contractController";
import { getContractAddress } from "../../common/constants";
import { NetworkName } from "../../common/enums/NetworkName";
import ApiService from "../../services/ApiService";
import ChainStore from "../../store/ChainStore";
import GoldenAxeBlock from "./components/GoldenAxeBlock/GoldenAxeBlock";
import { useGetChains } from "../../hooks/use-get-chains";
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName";
import { BridgeType } from "../../common/enums/BridgeType";
import BridgeTypeSelect from "../../components/BridgeTypeSelect/BridgeTypeSelect";

function Page() {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { account, walletConnected, openAccountDrawer, fetchAccount } = AppStore;
    const getChains = useGetChains()

    const { switchNetworkAsync } = useSwitchNetwork();
    const { chain } = useNetwork();
    const { address } = useAccount();

    const mintSingle = async (formData: SingleMintFormData) => {
        if (!walletConnected) {
            openAccountDrawer();
            messageApi.info('Connect a wallet before Mint!');
            return;
        }

        if (!ChainStore.chains.length) {
            await getChains()
        }

        const chainFrom = ChainStore.getChainById(formData.from);
        if (chain?.network !== chainFrom?.network) {
            await switchNetworkAsync?.(chainFrom?.chainId);
        }

        if (chain) {
            setIsLoading(true);

            try {
                const bridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME) ? BridgeType.Hyperlane : BridgeType.LayerZero

                const result = await mintNFT({
                    contractAddress: getContractAddress(bridgeType, chain.network as NetworkName),
                    bridgeType,
                    chainToSend: {
                        id: chain.id,
                        name: chain.name,
                        network: chain.network,
                        hyperlaneChain: null,
                        lzChain: null,
                        token: 'ETH',
                        
                    },
                    account,
                    accountAddress: address!
                });

                if (result.result) {
                    const chainFrom = ChainStore.getChainById(formData.from);
                    const chainTo = ChainStore.getChainById(formData.to);

                    const nft = await ApiService.createMint({
                        metamaskWalletAddress: address as string,
                        tokenId: result.blockId!,
                        chainFromNetwork: chainFrom?.network!,
                        chainToNetwork: chainTo?.network!,
                        transactionHash: result?.transactionHash!,
                        bridgeType
                    });

                    router.push(`/mint/${nft.id}?successful=true`);

                    await fetchAccount();
                } else {
                    messageApi.warning(result.message);
                }
            } catch (e) {
                console.error(e);
                setIsLoading(false);

                if (e instanceof AxiosError) {
                    await messageApi.error(e?.response?.data?.message);
                    return;
                }

                await messageApi.error('Oops, Something went wrong :(\nPlease reload this page and try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const mintMultiple = async (formData: MultipleMintFormData) => {
        console.log(formData, 'formData');
    }

    const tabs = [
        {
            key: 'single',
            label: 'Single',
            children: <SingleMintForm onSubmit={mintSingle} />
        },
        {
            key: 'multiple',
            label: 'Multiple',
            // label: <Space size={8}>Multiple <SoonLabel /></Space>,
            children: <MultipleMintForm onSubmit={mintMultiple} />,
            // disabled: true
        }
    ];

    const changeBridgeType = (bridgeType: string) => {
        if (bridgeType === BridgeType.LayerZero) {
            router.replace(pathname);
        } else {
            router.push(`?${HYPERLANE_QUERY_PARAM_NAME}=true`);
        }

        ChainStore.getChains(bridgeType as BridgeType)
    };

    const isHyperlaneBridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

    return (
        <>
            {contextHolder}

            <Card isLoading={isLoading} className={styles.page} title="Mint and Bridge NFT" afterCard={<GoldenAxeBlock />} >
                <BridgeTypeSelect onChange={changeBridgeType} value={isHyperlaneBridgeType ? BridgeType.Hyperlane : BridgeType.LayerZero} />
                <Tabs className={styles.tabs} defaultActiveKey="single" items={tabs} type="card" />
            </Card>
        </>
    )
}

export default observer(Page);