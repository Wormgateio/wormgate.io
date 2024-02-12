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

            <footer className={styles.footer}>
                {label && (<div className={styles.label}>{label}</div>)}
                {tokenId && (<div>#{tokenId}</div>)}
            </footer>
        </Flex>
    )
}