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
import MultipleMintForm from "./components/MultipleMintForm/MultipleMintForm";
import SingleMintForm, { SingleMintFormData } from "./components/SingleMintForm/SingleMintForm";
import AppStore from "../../store/AppStore";
import { mintNFT } from "../../core/contractController";
import { CONTRACT_ADDRESS } from "../../common/constants";
import { NetworkName } from "../../common/enums/NetworkName";
import ApiService from "../../services/ApiService";
import ChainStore from "../../store/ChainStore";
import GoldenAxeBlock from "./components/GoldenAxeBlock/GoldenAxeBlock";
import { useGetChains } from "../../hooks/use-get-chains";
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName";
import { NetworkType } from "../../common/enums/NetworkType";
import NetworkTypeSelect from "../../components/NetworkTypeSelect/NetworkTypeSelect";

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
                const result = await mintNFT({
                    contractAddress: CONTRACT_ADDRESS[chain.network as NetworkName],
                    chainToSend: {
                        id: chain.id,
                        name: chain.name,
                        network: chain.network,
                        lzChain: null,
                        token: 'ETH'
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
                        transactionHash: result?.transactionHash!
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

    const tabs = [
        {
            key: 'single',
            label: 'Single',
            children: <SingleMintForm onSubmit={mintSingle} />
        },
        {
            key: 'multiple',
            label: <Space size={8}>Multiple <SoonLabel /></Space>,
            children: <MultipleMintForm />,
            disabled: true
        }
    ];

    const changeNetworkType = (networkType: string) => {
        if (networkType === NetworkType.LayerZero) {
            router.replace(pathname);
        } else {
            router.push(`?${HYPERLANE_QUERY_PARAM_NAME}=true`);
        }

        ChainStore.getChains(networkType as NetworkType)
    };

    const isHyperlaneNetworkType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

    return (
        <>
            {contextHolder}

            <Card isLoading={isLoading} className={styles.page} title="Mint and Bridge NFT" afterCard={<GoldenAxeBlock />} >
                <NetworkTypeSelect onChange={changeNetworkType} value={isHyperlaneNetworkType ? NetworkType.Hyperlane : NetworkType.LayerZero} />
                <Tabs className={styles.tabs} defaultActiveKey="single" items={tabs} type="card" />
            </Card>
        </>
    )
}

export default observer(Page);