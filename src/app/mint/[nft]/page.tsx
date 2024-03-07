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
import { goldenAxeIpf } from "../../api/mint/ipfs";

interface NftPageProps {
    params: { nft: string };
}

function NftPage({ params }: NftPageProps) {
    const { fetchAccount, fetchGoldenAxeReward, goldenAxeReward } = AppStore;
    const router = useRouter();
    const [nft, setNft] = useState(NftStore.selectNftById(params.nft));

    const refetch = () => {
        NftStore.getNfts().then(() => setNft(NftStore.selectNftById(params.nft)));
        fetchAccount();
        fetchGoldenAxeReward()
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

    const isGoldenAxe = nft.pinataImageHash === goldenAxeIpf.hash

    return (
        <>
            <div className={cn.title}>
                {isGoldenAxe ? 
                    `YOU'VE GOT A GOLDEN AXE, AND SOON YOU'LL HAVE $${goldenAxeReward} IN YOUR ACCOUNT! CONGRATULATIONS!`
                    : 
                    "Congratulation! NFT is done. You get"
                }
                <Image src="/svg/coins/onemint.svg" alt={''} width={82} height={49} />
            </div>

            <div className={cn.back} onClick={goToBack}>
                <Image src="/svg/ui/back-arrow.svg" width={24} height={24} alt="" />
                <span>Back to Mint Page</span>
            </div>

            <div className={cn.nft}>
                <ListCard
                    className={cn.card}
                    tokenId={nft.tokenId}
                    image={<PinataImage hash={nft.pinataImageHash} fileName={nft.pinataFileName} name={nft.name} />}
                    onClick={() => handleCardClick(nft)}
                />
                <BridgeForm
                    disabeldSelect
                    chainIdToFirstBridge={nft.chainIdToFirstBridge}
                    nft={nft}
                    onAfterBridge={refetch}
                    simple
                />
            </div>
        </>
    );
}

export default observer(NftPage);