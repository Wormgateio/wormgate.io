import React from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { useMedia } from "use-media";
import { Spin } from "antd";
import Image from "next/image";

import { NFTDto } from "../../../../../common/dto/NFTDto";
import ChainSelect from "../../../../../components/ChainSelect/ChainSelect";
import RefuelSwitch from "../../../../../components/RefuelSwitch/RefuelSwitch";
import Button from "../../../../../components/ui/Button/Button";
import { useBridge } from "../../../../../common/useBridge";
import CostLabel from "../../../../../components/CostLabel/CostLabel";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";

import styles from "./BridgeForm.module.css";

interface Props {
    nft: NFTDto;
    className?: string;
    onAfterBridge?(): void;
}

function BridgeForm({ nft, className, onAfterBridge }: Props) {
    const {
        bridgePriceList,
        chains,
        submittedData,
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
    const isMobile = useMedia({ maxWidth: 768 });

    if (isPending) {
        return (
            <div className={clsx(styles.container, className)}>
                <div className={styles.spinner}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (submittedData) {
        return (
            <div className={clsx(styles.container, className)}>
                <div className={styles.successful}>
                    <Image src="/svg/ui/successful.svg" width={24} height={24} alt="" />
                    <span>Successful bridge</span>
                    <CostLabel cost={10} success />
                </div>

                <div className={styles.scheme}>
                    <ChainLabel network={submittedData.previousChain.network} label={submittedData.previousChain.name} justify="center" className={styles.label} />
                    <Image src="/svg/scheme-arrow.svg" width={24} height={24} alt="" />
                    <ChainLabel network={submittedData.nextChain.network} label={submittedData.nextChain.name} justify="center" className={styles.label} />
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

                <div>
                    {isNeedChangeChain
                        ? <Button block className={styles.sendBtn} onClick={switchNetwork}>Switch network</Button>
                        : <Button block className={styles.sendBtn} onClick={onBridge}>Bridge</Button>
                    }
                </div>
            </div>
        </div>
    );
}

export default observer(BridgeForm);