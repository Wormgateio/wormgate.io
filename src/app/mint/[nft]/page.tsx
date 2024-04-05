'use client';

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import cn from './page.module.scss';

import NftStore from "../../../store/NftStore";
import AppStore from "../../../store/AppStore";
import { NFTDto } from "../../../common/dto/NFTDto";
import { goldenAxeIpf } from "../../api/mint/ipfs";
import NftCard from "./components/NftCard/NftCard";
import { NFT_IDS_DIVIDER } from "@utils/nftIdsDivider";

const getTitle = (isGoldenAxe: boolean, nftsCount: number, goldenAxeReward: number) => {
    if (isGoldenAxe) {
        return `YOU'VE GOT A GOLDEN AXE, AND SOON YOU'LL HAVE $${goldenAxeReward} IN YOUR ACCOUNT! CONGRATULATIONS!`
    }
    
    if (nftsCount === 1) {
        return (
            <>
                Congratulation! NFT is done. You get
                <span className={cn.nftsCount}>+1</span>
            </>
        )
    } else {
        return (
            <>
                Congratulation! NFT`s is done. You get
                <span className={cn.nftsCount}>+{nftsCount}</span>
            </>
        )
    }
}

interface NftPageProps {
    params: { nft: string };
}

function NftPage({ params }: NftPageProps) {
    const { fetchAccount, fetchGoldenAxeReward, goldenAxeReward } = AppStore;
    const router = useRouter();
    const [nfts, setNft] = useState(() => NftStore.selectNftsByIds(params.nft.split(NFT_IDS_DIVIDER)));

    const refetch = () => {
        NftStore.getNfts().then(() => setNft(NftStore.selectNftsByIds(params.nft.split(NFT_IDS_DIVIDER))));
        fetchAccount();
    }

    useEffect(() => {
        refetch();

        if (!goldenAxeReward) {
            fetchGoldenAxeReward()
        }
    }, []);

    if (!nfts.length) {
        return (
            <Flex align="center" justify="center">
                <Spin size={"large"} />
            </Flex>
        );
    }

    const goToBack = () => router.push('/');

    const handleCardClick = (nft: NFTDto) => router.push(`/nfts/${nft.id}`);

    // we don`t mint golden axe when we use multiple mint
    const isGoldenAxe = nfts.length === 1 ? nfts[0].pinataImageHash === goldenAxeIpf.hash : false

    return (
        <>
            <div className={cn.title}>
                {getTitle(isGoldenAxe, nfts.length, goldenAxeReward)}
                <Image src="/svg/crystals/2.svg" alt={''} width={35} height={41} />
            </div>

            <div className={cn.back} onClick={goToBack}>
                <Image src="/svg/ui/back-arrow.svg" width={24} height={24} alt="" />
                <span>Back to Mint Page</span>
            </div>

            <div className={cn.nfts}>
            { nfts.map((nft) => <NftCard key={nft.id} nft={nft} onCardClick={handleCardClick} refetch={refetch} />) }
            </div>
        </>
    );
}

export default observer(NftPage);