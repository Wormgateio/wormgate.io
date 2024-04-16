import React from 'react'
import { Tabs } from 'antd';
import { BridgeType } from '../../common/enums/BridgeType';
import styles from "./BridgeTypeSelect.module.scss";
import LzSvg from './LzSvg';
import HyperlaneSvg from './HyperlaneSvg';

interface BridgeTypeSelectProps {
    value: string
    svgClassName?: string
    onChange(value: string): void;
}

export default function BridgeTypeSelect({ value, svgClassName, onChange }: BridgeTypeSelectProps) {
    const tabs = [
        {
            key: BridgeType.LayerZero,
            label: <LzSvg className={svgClassName} />
        },
        {
            key: BridgeType.Hyperlane,
            label: <HyperlaneSvg className={svgClassName}/>
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