import { Flex } from "antd";
import { MouseEvent, ReactNode } from "react";
import clsx from "clsx";

import styles from "./ListCard.module.css";

interface Props {
    image?: ReactNode;
    label?: ReactNode;
    title?: ReactNode;
    tokenId?: number;
    xp?: number;
    className?: string;
    onClick?(event?: MouseEvent): void;
}

export default function ListCard({ image, label, className, tokenId, onClick }: Props) {
    return (
        <Flex gap={12} vertical className={clsx(styles.card, className)} onClick={onClick}>
            {image && (
                <Flex vertical align="center" justify="center" className={styles.image}>
                    {image}
                </Flex>
            )}

            <Flex className={styles.footer} justify={label ? 'justify-content' : 'center'}>
                {label && (<div><div className={styles.label}>{label}</div></div>)}
                {tokenId && (<div><div>#{tokenId}</div></div>)}
            </Flex>
        </Flex>
    )
}