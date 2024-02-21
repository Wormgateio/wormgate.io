'use client';

import { observer } from "mobx-react-lite";
import { message, Space, Tabs } from 'antd';

import styles from './page.module.scss';
import Card from "../../components/ui/Card/Card";
import SoonLabel from "../../components/SoonLabel/SoonLabel";
import MultipleMintForm from "./components/MultipleMintForm/MultipleMintForm";
import SingleMintForm from "./components/SingleMintForm/SingleMintForm";

function Page() {
    const [messageApi, contextHolder] = message.useMessage();

    const tabs = [
        {
            key: 'single',
            label: 'Single',
            children: <SingleMintForm />
        },
        {
            key: 'multiple',
            label: <Space size={8}>Multiple <SoonLabel /></Space>,
            children: <MultipleMintForm />,
            disabled: true
        }
    ]

    return (
        <>
            {contextHolder}

            <Card className={styles.page} title="Mint and Bridge NFT">
                <Tabs className={styles.tabs} defaultActiveKey="single" items={tabs} type="card" />
            </Card>
        </>
    )
}

export default observer(Page);