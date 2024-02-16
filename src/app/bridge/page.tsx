"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useAccount } from "wagmi";

import Card from "../../components/ui/Card/Card";
import NftList from "./components/NftList/NftList";
import NftStore from "../../store/NftStore";
import ChainStore from "../../store/ChainStore";

import styles from "./page.module.css";

function Page() {
    const { address } = useAccount();

    useEffect(() => {
        ChainStore.getChains();
    }, []);

    useEffect(() => {
        NftStore.getNfts();
    }, [address]);

    return (
        <Card title={(
            <div className={styles.title}>
                <span>Bridge NFT</span>
            </div>
        )}>
            <NftList />
        </Card>
    )
}

export default observer(Page);