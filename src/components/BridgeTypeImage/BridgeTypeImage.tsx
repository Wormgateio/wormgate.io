import React from 'react'
import { BridgeType } from '../../common/enums/BridgeType'
import Image from 'next/image'
import styles from "./BridgeTypeImage.module.scss";

interface BridgeTypeImageProps {
    bridgeType: BridgeType;
    className?: string
    imageClassName?: string
}

export default function BridgeTypeImage({ bridgeType, className, imageClassName }: BridgeTypeImageProps) {
    if (bridgeType === BridgeType.Hyperlane) {
        return (
            <div className={`${styles.wrapper}${` ${className}` || ''}`}>
                <Image className={imageClassName} src="/hyperlane.png" width={111} height={24} alt="Hyperlane" />
            </div>
        ) 
    }

    if (bridgeType === BridgeType.LayerZero) {
        return (
            <div className={`${styles.wrapper}${` ${className}` || ''}`}>
                <Image className={imageClassName} src="/svg/layer-zero.svg" width={111} height={24} alt="LayerZero" /> 
            </div>
        )
    }

    return null
}
