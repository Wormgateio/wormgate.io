import React from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { Flex, Spin } from "antd";
import Image from "next/image";

import { NFTDto } from "../../../../../common/dto/NFTDto";
import ChainSelect from "../../../../../components/ChainSelect/ChainSelect";
import RefuelSwitch from "../../../../../components/RefuelSwitch/RefuelSwitch";
import Button from "../../../../../components/ui/Button/Button";
import { useBridge } from "../../../../../common/useBridge";

import styles from "./BridgeForm.module.css";
import { ChainDto } from "../../../../../common/dto/ChainDto";

interface Props {
    nft: NFTDto;
    className?: string;
    onAfterBridge?(previousChain?: ChainDto, nextChain?: ChainDto): void;
}

function BridgeForm({ nft, className, onAfterBridge }: Props) {
    const {
        bridgePriceList,
        chains,
        selectedChain,
        refuelCost,
        refuelEnabled,
        isPending,
        isNeedChangeChain,
        switchNetwork,
        onChangeChain,
        onChangeRefuelEnabled,
        onChangeRefuelGas,
        onBridge
    } = useBridge(nft, onAfterBridge);

    if (isPending) {
        return (
            <div className={clsx(styles.container, className)}>
                <div className={styles.spinner}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.container, className)}>
           <div className={styles.refuel}>
               <RefuelSwitch
                   refuel={refuelCost}
                   onChangeRefuelGas={onChangeRefuelGas}
                   checked={refuelEnabled}
                   onChange={onChangeRefuelEnabled}
               />
           </div>

            <div className={styles.actions}>
                <ChainSelect chains={chains} value={selectedChain} onChange={onChangeChain} priceList={bridgePriceList} />

                <Flex align="center" gap={12}>
                    {isNeedChangeChain
                        ? <Button block className={styles.sendBtn} onClick={switchNetwork}>Switch network</Button>
                        : <Button block className={styles.sendBtn} onClick={onBridge}>Bridge</Button>
                    }
                    <Image src="/svg/coins/bridge.svg" alt="+1" width={56} height={50} />
                </Flex>
            </div>
        </div>
    );
}

export default observer(BridgeForm);