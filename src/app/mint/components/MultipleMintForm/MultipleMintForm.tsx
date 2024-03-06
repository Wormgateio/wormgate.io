'use client';

import { Flex, Form } from 'antd';
import { observer } from 'mobx-react-lite';
import ChainStore from '../../../../store/ChainStore';
import MultipleMintFormChain from './MultipleMintFormChain';
import { useNetwork } from 'wagmi';
import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ChainDto } from '../../../../common/dto/ChainDto';

import cn from './MultipleMintForm.module.scss';
import ChainSelect from '../../../../components/ChainSelect/ChainSelect';

interface MultipleMintFormProps {
    onSubmit: (formData: MultipleMintFormData) => void;
}

export interface MultipleMintFormData {
    from: string;
    to: string[];
}

function MultipleMintForm({ onSubmit }: MultipleMintFormProps) {
    const [form] = Form.useForm();
    const watchedFormData = Form.useWatch([], form);

    const { chains } = ChainStore;
    const { chain } = useNetwork();

    const { sourceChain, otherChains } = useMemo(() => {
        if (!watchedFormData?.from) {
            return { sourceChain: null, otherChains: [] }
        }
        
        let sourceChain = null as ChainDto | null;
        const otherChains: ChainDto[] = []

        chains.forEach((c) => {
            if (chain && c.id === watchedFormData.from) {
                sourceChain = c
            } else {
                otherChains.push(c)
            }
        })

        return { sourceChain, otherChains }
    }, [chains, watchedFormData?.from, watchedFormData?.from]);

    useEffect(() => {
        if (chain) {
            form.setFieldsValue({ from: chain.id });
        }
    }, [chain]);
    
    return (
        <Form size="large" layout="vertical" form={form} onFinish={onSubmit}>
            <Flex className={cn.wrapper}>
                <Flex className={cn.sourceChainWrapper}>
                    <Form.Item className={cn.formField} name="from">
                        <ChainSelect chains={chains} value={watchedFormData?.from} />
                    </Form.Item>
                </Flex>

                <div>
                    <Image src='/svg/multipleMint.svg' width={23} height={23} alt='>' />
                </div>

                <div className={cn.chains}>
                    <button className={cn.clearButton}>Clear All</button>

                    {otherChains.map((chain) => <MultipleMintFormChain value={chain.id} network={chain?.network} label={chain?.name} />)}
                </div>
            </Flex>

            <Flex align="center" gap={12}>
                {/* {networkFromIsDifferent ? (
                  <Button type="button" block onClick={switchNetwork}>
                    Switch network to {fromChain?.name}
                  </Button>
                ) : (
                  <Button block type="submit">
                    Mint
                  </Button>
                )} */}

                <Image className={cn.mintBonusImage} src="/svg/coins/our-mint.svg" alt="+1" width={56} height={50} />
            </Flex>
        </Form>
    )
}


export default observer(MultipleMintForm);