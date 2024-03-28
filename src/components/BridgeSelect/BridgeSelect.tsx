import React from 'react'
import { Tabs } from 'antd';
import { Bridge } from '../../common/enums/Bridge';
import styles from "./BridgeSelect.module.scss";
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams,  } from 'next/navigation'
import { HYPERLANE_QUERY_PARAM_NAME } from '@utils/hyperlaneQueryParamName';

export default function BridgeSelect() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const changeBridge = (bridge: string) => {
        if (bridge === Bridge.LayerZero) {
            router.replace(pathname);
        } else {
            router.push(`?${HYPERLANE_QUERY_PARAM_NAME}=true`);
        }
    };

    const tabs = [
        {
            key: Bridge.LayerZero,
            label: <Image className={styles.image} src="/svg/layer-zero.svg" width={111} height={24} alt="LayerZero" />,
        },
        {
            key: Bridge.Hyperlane,
            label: <Image className={styles.image} src="/hyperlane.png" width={111} height={24} alt="Hyperlane" />,
        },
    ]

    const isHyperlaneBridge = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

    return (
        <Tabs 
            rootClassName={styles.tabs} 
            activeKey={isHyperlaneBridge ? Bridge.Hyperlane : Bridge.LayerZero} 
            onChange={changeBridge} 
            items={tabs} 
            type="card" 
        /> 
    )
}