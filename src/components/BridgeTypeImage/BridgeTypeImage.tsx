import React from 'react'
import { BridgeType } from '../../common/enums/BridgeType'
import styles from "./BridgeTypeImage.module.scss";
import HyperlaneSvg from '../BridgeTypeSelect/HyperlaneSvg';
import LzSvg from '../BridgeTypeSelect/LzSvg';

interface BridgeTypeImageProps {
    bridgeType: BridgeType;
    className?: string
    imageClassName?: string
}

export default function BridgeTypeImage({ bridgeType, className, imageClassName }: BridgeTypeImageProps) {
    if (bridgeType === BridgeType.Hyperlane) {
        return (
            <div className={`${styles.wrapper}${` ${className}` || ''}`}>
                <HyperlaneSvg className={imageClassName} />
            </div>
        ) 
    }

    if (bridgeType === BridgeType.LayerZero) {
        return (
            <div className={`${styles.wrapper}${` ${className}` || ''}`}>
                <LzSvg className={imageClassName} />
            </div>
        )
    }

    return null
}
