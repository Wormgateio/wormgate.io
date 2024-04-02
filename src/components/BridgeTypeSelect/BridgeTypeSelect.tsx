import React from 'react'
import { Tabs } from 'antd';
import { BridgeType } from '../../common/enums/BridgeType';
import styles from "./BridgeTypeSelect.module.scss";
import Image from 'next/image';

interface BridgeTypeSelectProps {
    onChange(value: string): void;
    value: string
}

export default function BridgeTypeSelect({ onChange, value }: BridgeTypeSelectProps) {
    const tabs = [
        {
            key: BridgeType.LayerZero,
            label: <Image className={styles.image} src="/svg/layer-zero.svg" width={111} height={24} alt="LayerZero" />,
        },
        {
            key: BridgeType.Hyperlane,
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