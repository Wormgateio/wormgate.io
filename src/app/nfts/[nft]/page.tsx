"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex, Spin, notification, Space } from "antd";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import Card from "../../../components/ui/Card/Card";
import AppStore from "../../../store/AppStore";
import ApiService from "../../../services/ApiService";
import { NFTDto } from "../../../common/dto/NFTDto";
import PinataImage from "../../../components/PinataImage";
import ChainLabel from "../../../components/ChainLabel/ChainLabel";
import History from "./components/History/History";
import BridgeForm from "./components/BridgeForm/BridgeForm";
import { OperationHistoryDto } from "../../../common/dto/OperationHistoryDto";

import styles from "./page.module.scss";
import MiniCard from "../../../components/ui/MiniCard/MiniCard";
import ChainStore from "../../../store/ChainStore";

interface Props {
    params: { nft: string },
}

function Page({ params }: Props) {
    const router = useRouter();
    const [nft, setNft] = useState<NFTDto>();
    const [history, setHistory] = useState<OperationHistoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const { account } = AppStore;

    const refetch = async () => {
        if (params.nft) {
            const nft = await ApiService.getNft(params.nft);
            if (nft) {
                setNft(nft);
                setIsLoadingHistory(true);
                const history = await ApiService.getNftHistory(nft.id, nft.chainNetwork);
                setHistory(history);
                setIsLoadingHistory(false);
            } else {
                notification.error({ message: 'NFT is not found' });
            }
        }
    };

    const loadPage = async () => {
        setIsLoading(true);
        await refetch();
        setIsLoading(false);
    };

    const goToBack = () => {
        router.back();
    };

    useEffect(() => {
        AppStore.fetchAccount();
        ChainStore.getChains();
    }, []);

    useEffect(() => {
        loadPage();
    }, [params]);

    if (isLoading) {
        return (
            <Flex align="center" justify="center">
                <Spin size="large" />
            </Flex>
        );
    }

    if (!nft) {
        return notFound();
    }

    return (
        <Card title="NFT Info" className={styles.page}>
            <div className={styles.back} onClick={goToBack}>
                <Image src="/svg/ui/back-arrow.svg" width={24} height={24} alt="" />
                <span>Back to Your NFT`s</span>
            </div>

            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.image}>
                        <PinataImage hash={nft.pinataImageHash} name={nft.name} />
                    </div>

                    <div className={styles.info}>
                        <div className={styles.main}>
                            <div className={styles.nftName}>{nft.name}</div>

                            <Space className={styles.description} style={{ width: '100%' }} direction="vertical" size={[0, 8]}>
                                <div className={styles.descrItem}>
                                    <div>ID</div>
                                    <div>{nft.tokenId}</div>
                                </div>
                                <div className={styles.descrItem}>
                                    <div>Network</div>
                                        <div className={styles.chain}>
                                            <ChainLabel network={nft.chainNetwork} label={nft.chainName} />
                                        </div>
                                </div>
                            </Space>
                        </div>

                        {account?.id === nft.userId && (
                            <MiniCard title="Bridge">
                                <BridgeForm
                                    nft={nft}
                                    className={styles.form}
                                    onAfterBridge={(previousChain, nextChain) => {
                                        router.push(`/bridge/${nft.id}?from=${previousChain?.network}&to=${nextChain?.network}`);
                                    }}
                                />
                            </MiniCard>
                        )}
                    </div>
                </div>
            </div>

            <MiniCard title="History">
                <History history={history} loading={isLoadingHistory} className={styles.history} />
            </MiniCard>
        </Card>
    );
}

export default observer(Page);