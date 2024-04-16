import { useMedia } from "use-media";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { Spin } from "antd";
import Image from "next/image";
import { intlFormatDistance } from "date-fns";

import { BalanceLogType } from "../../../../../common/enums/BalanceLogType";
import { OperationHistoryDto } from "../../../../../common/dto/OperationHistoryDto";
import ChainLabel from "../../../../../components/ChainLabel/ChainLabel";
import ChainStore from "../../../../../store/ChainStore";

import styles from "./History.module.scss";
import { BridgeType } from "../../../../../common/enums/BridgeType";
import { getBridgeBlockExplorer } from "@utils/getBridgeBlockExplorer";
import { LinkSvg } from "../../../../../components/LinkSvg/LinkSvg";
import { MediaBreakpoint } from "@utils/mediaBreakpoints";

const OPERATION_ICONS = {
    [BalanceLogType.Mint]: '/svg/mint-operation.svg',
    [BalanceLogType.MintCustom]: '/svg/mint-operation.svg',
    [BalanceLogType.Bridge]: '/svg/bridge-operation.svg',
};

const OPERATION_NAME = {
    [BalanceLogType.Mint]: 'Mint',
    [BalanceLogType.MintCustom]: 'Mint',
    [BalanceLogType.Bridge]: 'Bridge',
};

const getTransactionLink = (showLinkColumn: boolean, hash: string | undefined, bridgeType: BridgeType) => {
    if (!showLinkColumn || !hash) {
        return null;
    }

    const isHyperlaneBridgeType = bridgeType === BridgeType.Hyperlane;

    return (
        <div className={styles.infoRightSide}>
            <a className={styles.transactionLink} href={getBridgeBlockExplorer(bridgeType, hash)!} target="_blank">
                {isHyperlaneBridgeType ? (
                        <>
                            Hyperlane.xyz
                            <LinkSvg />
                        </>
                    ) : 
                        <>
                            LayerZero.xyz
                            <LinkSvg />
                        </>
                }
            </a>
        </div>
    )
}

interface Props {
    history: OperationHistoryDto[];
    bridgeType: BridgeType,
    loading?: boolean;
    className?: string;
}

function History({ history, bridgeType, loading, className }: Props) {
    const isLaptop = useMedia({ maxWidth: MediaBreakpoint.Laptop });
    const showLinkColumn = history.some((h) => h.transactionHash);

    if (isLaptop) {
        return (
            <div className={clsx(styles.container, className)}>
                {loading && <Spin size="large" />}
                {!loading && !history.length && <strong>Operation history is empty</strong>}
                {history.map((item, index) => {
                    const chain = ChainStore.getChainByNetwork(item.chainNetwork);
                    const targetChain = item.targetChainNetwork ? ChainStore.getChainByNetwork(item.targetChainNetwork) : undefined;

                    if (!chain) {
                        return null;
                    }

                    return (
                        <div key={index} className={styles.card}>
                            <div className={styles.info}>
                                <div>
                                    <div className={styles.operation}>
                                        <Image src={OPERATION_ICONS[item.type]} width={20} height={20} alt="" />
                                        <span>{OPERATION_NAME[item.type]}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.value}>{intlFormatDistance(new Date(item.date), new Date(), { locale: 'en-US' })}</div>
                                </div>
                            </div>
                            <div className={styles.chains}>
                                <div className={styles.scheme}>
                                    <ChainLabel network={chain.network} label={chain.name} justify="center" iconClassName={styles.icon} labelClassName={styles.chainLabel} />
                                    {targetChain && (
                                        <>
                                            <Image src="/svg/scheme-arrow.svg" width={16} height={16} alt="" className={styles.arrow} />
                                            <ChainLabel network={targetChain.network} label={targetChain.name} justify="center" iconClassName={styles.icon} labelClassName={styles.chainLabel} />
                                        </>
                                    )}
                                </div>
                                {getTransactionLink(showLinkColumn, item.transactionHash, bridgeType)}
                            </div>
                            
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.body}>
                {loading && <Spin size="large" />}
                {!loading && !history.length && <strong>Operation history is empty</strong>}
                {history.map((item, index) => {
                    const chain = ChainStore.getChainByNetwork(item.chainNetwork);
                    const targetChain = item.targetChainNetwork ? ChainStore.getChainByNetwork(item.targetChainNetwork) : undefined;

                    if (!chain) {
                        return null;
                    }

                    return (
                        <div key={index} className={styles.row}>
                            <div>
                                <div className={styles.operation}>
                                    <Image src={OPERATION_ICONS[item.type]} width={24} height={24} alt="" />
                                    <span>{OPERATION_NAME[item.type]}</span>
                                </div>
                            </div>
                            <div>
                                <div className={styles.scheme}>
                                    <ChainLabel network={chain.network} label={chain.name} />
                                    {targetChain && (
                                        <>
                                            <Image src="/svg/scheme-arrow.svg" width={16} height={16} alt="" />
                                            <ChainLabel network={targetChain.network} label={targetChain.name} />
                                        </>
                                    )}
                                </div>
                            </div>
                            {showLinkColumn && !item.transactionHash && <div className={styles.transactionLinkWrapper} />}
                            {getTransactionLink(showLinkColumn, item.transactionHash, bridgeType)}
                            <div>{intlFormatDistance(new Date(item.date), new Date(), { locale: 'en-US' })}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default observer(History);