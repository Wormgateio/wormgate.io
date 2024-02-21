'use client';

import { useEffect, useMemo } from "react";
import { Flex, Form } from "antd";
import { useNetwork } from "wagmi";
import Image from "next/image";

import styles from "../../page.module.scss";
import ChainStore from "../../../../store/ChainStore";
import ChainSelect from "../../../../components/ChainSelect/ChainSelect";
import Button from "../../../../components/ui/Button/Button";
import { observer } from "mobx-react-lite";

function SingleMintForm() {
    const [form] = Form.useForm();

    const { chain } = useNetwork();
    const { chains } = ChainStore;

    const selectedChain = useMemo(() => {
        if (chain && chains.length) {
            return chains.find(c => c.network === chain.network)
        }

        return null;
    }, [chains, chain]);

    useEffect(() => {
        if (selectedChain && chains.length) {
            form.setFieldsValue({
                from: selectedChain?.id,
                to: chains[0]?.id
            });
        }
    }, [chains, selectedChain]);

    const onSubmit = () => {

    };

    return (
        <Form size="large" layout="vertical" form={form} onFinish={onSubmit}>
            <Flex align="center" gap={12}>
                <Form.Item style={{ flex: 1 }} name="from" label="From">
                    <ChainSelect
                        chains={chains}
                        className={styles.dropdown}
                    />
                </Form.Item>
                <Image src="/svg/arrows-left-right.svg" alt="" width={20} height={20} />
                <Form.Item style={{ flex: 1 }} name="to" label="To">
                    <ChainSelect
                        chains={chains}
                        className={styles.dropdown}
                    />
                </Form.Item>
            </Flex>

            <Flex align="center" gap={12}>
                <Button block>Mint</Button>
                <Image src="/svg/coins/our-mint.svg" alt="+1" width={56} height={50} />
            </Flex>
        </Form>
    )
}

export default observer(SingleMintForm);