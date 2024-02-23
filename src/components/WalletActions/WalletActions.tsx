'use client'

import { Flex, Space } from "antd";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { observer } from "mobx-react-lite";
import styles from './WalletActions.module.scss';

import Button from "../ui/Button/Button";
import AccountAddress from "../AccountAddress/AccountAddress";
import AppStore from "../../store/AppStore";
import NetworkChainSelect from "../NetworkChainSelect/NetworkChainSelect";
import { Crystal } from "./Crystal/Crystal";
function WalletActions() {
    const { account, openAccountDrawer, setWalletConnected, setWalletAddress } = AppStore;

    const { address, isConnected, isConnecting } = useAccount();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setWalletConnected(isConnected);
    }, [isConnected, setWalletConnected]);

    useEffect(() => {
        setWalletAddress(address as string);
    }, [address, setWalletAddress]);

    if (!isClient) {
        return <Button className={styles.btn}>Connect a Wallet</Button>;
    }

    const crystals = [
        {
            number: 2,
            value: account?.balance.mintsCount || 0,
            color: '#4EFFFF',
            tooltip: 'Mint'
        },
        /*{
            number: 4,
            value: account?.balance.mintsCustomCount || 0,
            color: '#00D670',
            tooltip: 'Custom Mint'
        },*/
        {
            number: 1,
            value: account?.balance.bridgesCount || 0,
            color: '#DB4BFF',
            tooltip: 'Bridge'
        },
        {
            number: 3,
            value: account?.balance.refuelCount || 0,
            color: '#FFC328',
            tooltip: 'Refuel'
        }
    ];

    return (
        <div>
            {!isConnected ? (
                <Button onClick={openAccountDrawer}>
                    {isConnecting ? 'Connecting...' : 'Connect Metamask'}
                </Button>
            ) : (
                <Flex gap={19}>
                    <div className={styles.account}>
                        <NetworkChainSelect />

                        {address && (
                            <button className={styles.btn} onClick={openAccountDrawer}>
                                {account?.twitter.user?.username ? account.twitter.user.username : (
                                    <AccountAddress address={address} />
                                )}
                            </button>
                        )}
                    </div>

                    <Space size={12}>
                        {crystals.map(item => (
                            <Space key={item.number} size={4}>
                                <Crystal number={item.number} />
                                <div className={styles.counterWrap} style={{ color: item.color }}>
                                    <div className={styles.counter}>{item.value}</div>
                                </div>
                            </Space>
                        ))}
                    </Space>
                </Flex>
            )}
        </div>
    )
}

export default observer(WalletActions);