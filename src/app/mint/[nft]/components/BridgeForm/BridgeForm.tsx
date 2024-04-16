"use client";

import React from "react";
import { Flex, Spin } from "antd";
import clsx from "clsx";
import styles from "./BridgeForm.module.css";

import Button from "../../../../../components/ui/Button/Button";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";
import ChainSelect from "../../../../../components/ChainSelect/ChainSelect";
import { NFTDto } from "../../../../../common/dto/NFTDto";
import RefuelSwitch from "../../../../../components/RefuelSwitch/RefuelSwitch";
import { useBridge } from "../../../../../common/useBridge";
import { BridgeType } from "../../../../../common/enums/BridgeType";
import { LinkSvg } from "../../../../../components/LinkSvg/LinkSvg";

interface Props {
    nft: NFTDto;
    onAfterBridge: () => void;
    className?: string;
    simple?: boolean;
    chainIdToFirstBridge?: string;
    disabeldSelect?: boolean;
}

export default function BridgeForm(props: Props) {
    const { className, nft, onAfterBridge, simple, chainIdToFirstBridge, disabeldSelect } = props;

    const {
        bridgePriceList,
        chains,
        refuelCost,
        refuelEnabled,
        selectedChain,
        submittedData,
        isPending,
        isNeedChangeChain,
        switchNetwork,
        onChangeChain,
        onChangeRefuelEnabled,
        onChangeRefuelGas,
        onBridge
    } = useBridge(nft, onAfterBridge, true);

    if (submittedData) {
        const isHyperlaneBridgeType = nft.bridgeType === BridgeType.Hyperlane;

        return (
            <div className={styles.bridgeSuccessfulWrapper}>
                <div className={styles.bridgeSuccessful}>
                    <Flex vertical gap={8} className={className}>
                        <Flex gap={4} align="center" justify="center" className={clsx(styles.bridgeTitle, styles.successful)}>
                            <span>Bridge Confirmed</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                <path d="M11.8333 2.22664C12.8388 2.80721 13.6752 3.64032 14.2598 4.6435C14.8444 5.64669 15.1568 6.78515 15.1662 7.9462C15.1756 9.10724 14.8816 10.2506 14.3133 11.2631C13.745 12.2756 12.9221 13.1221 11.9261 13.7188C10.9301 14.3156 9.7955 14.6419 8.63465 14.6653C7.47381 14.6888 6.32695 14.4087 5.30762 13.8528C4.28829 13.2968 3.43183 12.4843 2.82303 11.4956C2.21423 10.507 1.87419 9.37644 1.83659 8.21597L1.83325 7.99997L1.83659 7.78397C1.87392 6.63263 2.20895 5.51061 2.80901 4.5273C3.40907 3.54399 4.25369 2.73294 5.26051 2.17322C6.26734 1.61351 7.40202 1.32423 8.55392 1.33359C9.70583 1.34295 10.8357 1.65063 11.8333 2.22664ZM10.9713 6.1953C10.8565 6.08052 10.7037 6.01156 10.5417 6.00138C10.3797 5.99119 10.2195 6.04047 10.0913 6.13997L10.0286 6.1953L7.83325 8.38997L6.97125 7.52864L6.90859 7.4733C6.78031 7.37387 6.62017 7.32465 6.45819 7.33487C6.29621 7.34509 6.14352 7.41405 6.02876 7.52881C5.914 7.64357 5.84504 7.79626 5.83482 7.95824C5.8246 8.12022 5.87382 8.28036 5.97325 8.40864L6.02859 8.4713L7.36192 9.80464L7.42459 9.85997C7.5415 9.95068 7.68527 9.99991 7.83325 9.99991C7.98123 9.99991 8.125 9.95068 8.24192 9.85997L8.30459 9.80464L10.9713 7.13797L11.0266 7.0753C11.1261 6.94703 11.1754 6.78687 11.1652 6.62485C11.155 6.46283 11.086 6.3101 10.9713 6.1953Z" fill="#2DAD70"/>
                            </svg>
                        </Flex>

                        <Flex align="center" className={styles.bridgeScheme}>
                            <ChainLabel vertical network={submittedData.previousChain.network} label={submittedData.previousChain.name} justify="center" className={styles.label} />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2.66675 8H13.3334M13.3334 8L9.33341 4M13.3334 8L9.33341 12" stroke="#2DAD70" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <ChainLabel vertical network={submittedData.nextChain.network} label={submittedData.nextChain.name} justify="center" className={styles.label} />
                        </Flex>
                    </Flex>
                </div>

                {submittedData.transactionLink && (
                    <a className={styles.transactionLink} href={submittedData.transactionLink} target="_blank">
                        {isHyperlaneBridgeType ? (
                                <>
                                    Hyperlane.xyz
                                    <LinkSvg />
                                </>
                            ) : (
                                <>
                                    LayerZero.xyz
                                    <LinkSvg />
                                </>
                            )                                
                        }
                    </a>
                )}
            </div>
        )
    }

    return (
        <Flex vertical gap={12} className={className}>
            {!simple && nft.bridgeType !== BridgeType.Hyperlane && (
                <RefuelSwitch
                    refuel={refuelCost}
                    onChangeRefuelGas={onChangeRefuelGas}
                    checked={refuelEnabled}
                    onChange={onChangeRefuelEnabled}
                    className={styles.switch}
                />
            )}

            <div className={clsx(styles.footer)}>
                <Flex gap={8} vertical={simple} className={styles.formActions}>
                    <ChainSelect
                        chains={chains}
                        disabled={disabeldSelect}
                        value={chainIdToFirstBridge || selectedChain}
                        className={styles.dropdown}
                        onChange={onChangeChain}
                        priceList={bridgePriceList}
                    />
                    {isNeedChangeChain
                        ? <Button block={simple} className={styles.sendBtn} onClick={switchNetwork}>Switch network</Button>
                        : <Button block={simple} className={styles.sendBtn} onClick={onBridge}>Bridge</Button>
                    }
                </Flex>

                {isPending && <Spin className={styles.pending} />}
            </div>
        </Flex>
    )
}