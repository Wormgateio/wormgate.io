import React from 'react'
import { Tabs } from 'antd';
import { BridgeType } from '../../common/enums/BridgeType';
import styles from "./BridgeTypeSelect.module.scss";
import LzSvg from './LzSvg';
import HyperlaneSvg from './HyperlaneSvg';

interface BridgeTypeSelectProps {
    onChange(value: string): void;
    value: string
}

export default function BridgeTypeSelect({ onChange, value }: BridgeTypeSelectProps) {
    const tabs = [
        {
            key: BridgeType.LayerZero,
            label: <LzSvg />
        },
        {
            key: BridgeType.Hyperlane,
            label: <HyperlaneSvg />
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