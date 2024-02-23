'use client';

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import cn from './page.module.scss';

import NftStore from "../../../store/NftStore";
import ChainStore from "../../../store/ChainStore";
import AppStore from "../../../store/AppStore";
import ListCard from "../../../components/ListCard/ListCard";
import PinataImage from "../../../components/PinataImage";
import { NFTDto } from "../../../common/dto/NFTDto";
import BridgeForm from "./components/BridgeForm/BridgeForm";

interface NftPageProps {
    params: { nft: string };
}

function NftPage({ params }: NftPageProps) {
    const { fetchAccount } = AppStore;
    const router = useRouter();
    const [nft, setNft] = useState(NftStore.selectNftByHash(params.nft));

    const refetch = () => {
        NftStore.getNfts().then(() => setNft(NftStore.selectNftByHash(params.nft)));
        fetchAccount();
    }

    useEffect(() => {
        refetch();
        ChainStore.getChains();
    }, []);

    if (!nft) {
        return (
            <Flex align="center" justify="center">
                <Spin size={"large"} />
            </Flex>
        );
    }

    const goToBack = () => router.push('/');

    const handleCardClick = (nft: NFTDto) => router.push(`/nfts/${nft.id}`);

    return (
        <>
            <div className={cn.title}>
                Congratulation! NFT is done. You get
                <Image src="/svg/coins/onemint.svg" alt={''} width={82} height={49} />
            </div>

            <div className={cn.back} onClick={goToBack}>
                <Image src="/svg/ui/back-arrow.svg" width={24} height={24} alt="" />
                <span>Back to Mint Page</span>
            </div>

            <div className={cn.nft}>
                <ListCard
                    tokenId={nft.tokenId}
                    image={<PinataImage hash={nft.pinataImageHash} fileName={nft.pinataFileName} name={nft.name} />}
                    onClick={() => handleCardClick(nft)}
                />
                <BridgeForm chainIdToFirstBridge={nft.chainIdToFirstBridge} simple nft={nft} onAfterBridge={refetch} />
            </div>
        </>
    );
}

export default observer(NftPage);