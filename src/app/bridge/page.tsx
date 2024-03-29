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
import { NetworkType } from "../../common/enums/NetworkType";

enum Tabs {
    All,
    Womex,
    Custom
}

function Page() {
    const { address, isConnected, isConnecting } = useAccount();
    const [activeTab, setActiveTab] = useState(Tabs.All);
    const [networkType, setNetworkType] = useState(NetworkType.LayerZero)

    useEffect(() => {
        NftStore.getNfts();
    }, [address]);

    const tabs = [
        {
            key: Tabs.All,
            label: 'All NFT'
        },
        {
            key: Tabs.Womex,
            label: 'Womex NFT'
        },
        {
            key: Tabs.Custom,
            label: 'Custom NFT'
        }
    ];

    const data = useMemo(() => {
        if (activeTab === Tabs.Womex) {
            return NftStore.nfts.filter(nft => !nft.isCustom);
        }

        if (activeTab === Tabs.Custom) {
            return NftStore.nfts.filter(nft => nft.isCustom);
        }

        return NftStore.nfts;
    }, [activeTab, NftStore.nfts]);

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
            <NftList data={data} setNetworkType={setNetworkType} networkType={networkType} />
        </Card>
    )
}

export default observer(Page);