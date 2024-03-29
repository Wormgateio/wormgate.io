import React from 'react'
import { NetworkType } from '../../common/enums/NetworkType'
import Image from 'next/image'
import styles from "./NetworkTypeImage.module.scss";

interface NetworkTypeImageProps {
    networkType: NetworkType;
    className?: string
    imageClassName?: string
}

export default function NetworkTypeImage({ networkType, className, imageClassName }: NetworkTypeImageProps) {
    if (networkType === NetworkType.Hyperlane) {
        return (
            <div className={`${styles.wrapper}${` ${className}` || ''}`}>
                <Image className={imageClassName} src="/hyperlane.png" width={111} height={24} alt="Hyperlane" />
            </div>
        ) 
    }

    if (networkType === NetworkType.LayerZero) {
        return (
            <div className={`${styles.wrapper}${` ${className}` || ''}`}>
                <Image className={imageClassName} src="/svg/layer-zero.svg" width={111} height={24} alt="LayerZero" /> 
            </div>
        )
    }

    return null
}