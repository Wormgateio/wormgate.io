import React from 'react'
import { Tabs } from 'antd';
import { NetworkType } from '../../common/enums/NetworkType';
import styles from "./NetworkTypeSelect.module.scss";
import Image from 'next/image';

interface NetworkTypeSelectProps {
    onChange(value: string): void;
    value: string
}

export default function NetworkTypeSelect({ onChange, value }: NetworkTypeSelectProps) {
    const tabs = [
        {
            key: NetworkType.LayerZero,
            label: <Image className={styles.image} src="/svg/layer-zero.svg" width={111} height={24} alt="LayerZero" />,
        },
        {
            key: NetworkType.Hyperlane,
            label: <Image className={styles.image} src="/hyperlane.png" width={111} height={24} alt="Hyperlane" />,
        },
    ]

    return (
        <Tabs 
            rootClassName={styles.tabs} 
            activeKey={value} 
            onChange={onChange} 
            items={tabs} 
            type="card" 
        /> 
    )
}