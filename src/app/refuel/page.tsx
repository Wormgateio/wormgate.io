'use client';

import { observer } from "mobx-react-lite";
import { useAccount, useConnect } from "wagmi";
import cn from './page.module.scss';

import Card from "../../components/ui/Card/Card";
import RefuelForm from "./components/RefuelForm/RefuelForm";
import Button from "../../components/ui/Button/Button";
import AppStore from "../../store/AppStore";
import { useState } from "react";

function RefuelPage() {
    const { isConnected } = useAccount();
    const { closeAccountDrawer, setWalletAddress, setWalletConnected } = AppStore;

    const { connect, connectors } =
        useConnect({
            onSuccess: (data) => {
                setWalletAddress(data.account);
                setWalletConnected(true);
                closeAccountDrawer();
            }
        });

    if (!isConnected) {
        return (
            <div style={{ maxWidth: 480, margin: 'auto' }}>
                {connectors.map((connector) => (
                    <Button
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        block
                    >
                        Connect wallet to use Refuel
                    </Button>
                ))}
            </div>
        );
    }

    return (
        <Card title="Refuel" className={cn.card}>
            <RefuelForm />
        </Card>
    )
}

export default observer(RefuelPage);