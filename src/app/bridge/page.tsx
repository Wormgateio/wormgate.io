"use client";

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useAccount } from "wagmi";
import { Spin } from "antd";

import Card from "../../components/ui/Card/Card";
import NftList from "./components/NftList/NftList";
import NftStore from "../../store/NftStore";

import styles from "./page.module.scss";
import Button from "../../components/ui/Button/Button";
import AppStore from "../../store/AppStore";
import { getFilteredNfts } from "./helpers/get-filtered-nfts";
import { BridgeType } from "../../common/enums/BridgeType";

export enum BridgePageTab {
    All,
    Womex,
    Custom
}

function Page() {
    const { address, isConnected, isConnecting } = useAccount();
    const [activeTab, setActiveTab] = useState(BridgePageTab.All);
    const [bridgeType, setBridgeType] = useState(BridgeType.LayerZero)

    useEffect(() => {
        NftStore.getNfts();
    }, [address]);

    const tabs = [
        {
            key: BridgePageTab.All,
            label: 'All NFT'
        },
        {
            key: BridgePageTab.Womex,
            label: 'Womex NFT'
        },
        {
            key: BridgePageTab.Custom,
            label: 'Custom NFT'
        }
    ];

    const data = useMemo(() => getFilteredNfts(NftStore.nfts, activeTab, bridgeType), [activeTab, NftStore.nfts, bridgeType]);

    if (NftStore.loading || isConnecting) {
        return <Card title="All NFT"><Spin size="large" /></Card>
    }

    if (!isConnected) {
        return <Card title="All NFT">
            <Button onClick={AppStore.openAccountDrawer}>Connect wallet to get your collection</Button>
        </Card>
    }

    return (
        <Card title={(
            <div className={styles.title}>
                All NFT
                {/*{tabs.map(tab => (
                    <button key={tab.key} className={clsx(styles.tab, {
                        [styles.tabActive]: activeTab === tab.key
                    })} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
                ))}*/}
            </div>
        )}>
            <NftList data={data} setBridgeType={setBridgeType} bridgeType={bridgeType} />
        </Card>
    )
}

export default observer(Page);