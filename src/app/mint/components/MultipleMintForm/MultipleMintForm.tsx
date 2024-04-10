'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Flex, Form, Skeleton } from 'antd';
import { observer } from 'mobx-react-lite';
import ChainStore from '../../../../store/ChainStore';
import MultipleMintFormChain from './MultipleMintFormChain';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import Image from 'next/image';

import cn from './MultipleMintForm.module.scss';
import ChainSelect from '../../../../components/ChainSelect/ChainSelect';
import Button from '../../../../components/ui/Button/Button';
import { toDictionary } from '@utils/toDictionary';
import { EstimationBridgeType } from '../../../../core/contractController';

interface MultipleMintFormProps {
    bridgePriceList: EstimationBridgeType;
    updateBridgePrice: (chainFromId: number | undefined) => void;
    onSubmit: (formData: MultipleMintFormData) => void;
}

export interface MultipleMintFormData {
    from: string;
    to: {
        id: string
        name: string
        network: string,
        checked: boolean, 
    }[];
}

const skeletonChains = new Array(10).fill(0).map((_, i) => i)

function MultipleMintForm({ bridgePriceList, updateBridgePrice, onSubmit }: MultipleMintFormProps) {
    const [form] = Form.useForm();
    const watchedFormData = Form.useWatch<MultipleMintFormData>([], form);

    const { switchNetworkAsync } = useSwitchNetwork();
    const { chains, getAvailableChainsForBridge } = ChainStore;
    const { chain } = useNetwork();
    const bridgePriceByNetwork = useMemo(() => toDictionary(bridgePriceList, (p) => p?.network!), [bridgePriceList]);

    useEffect(() => {
        if (watchedFormData?.from) {
          const chainId = chains.find((chain) => chain.id === watchedFormData.from)?.chainId;
          
          updateBridgePrice(chainId)

            form.setFieldsValue({
                from: watchedFormData.from,
                to: getAvailableChainsForBridge(watchedFormData.from).map((c) => ({
                    checked: true, 
                    network: c.network,
                    name: c.name,
                    id: c.id
                }))
            })
        }
      }, [watchedFormData?.from])

    useEffect(() => {
        const formData: MultipleMintFormData = {
            from: '',
            to: [],
        }

        const activeChain = chains.find((c) =>  c.network === chain?.network);

        if (!activeChain) {
            formData.from = chains[0].id
        } else {
            formData.from = activeChain.id
        }

        formData.to = getAvailableChainsForBridge(formData.from).map((c) => ({
            checked: true, 
            network: c.network,
            name: c.name,
            id: c.id
        }))

        form.setFieldsValue(formData)
    }, [chains, chain]);

    const switchNetwork = async () => {
        const chainFrom = ChainStore.getChainById(watchedFormData?.from);
        if (chainFrom && switchNetworkAsync) {
          await switchNetworkAsync(chainFrom.chainId);
          form.setFieldsValue({ amount: undefined });
        }
    };

    const changeSourceChain = (key: string) => {
        const formValues: MultipleMintFormData= form.getFieldsValue();
        const formData: MultipleMintFormData = {
            from: '',
            to: [],
        }

        const targetChainsById = toDictionary(formValues.to, c => c.id);

        chains.forEach((c) => {
            if (c.id === key) {
                formData.from = c.id
            } else {
                formData.to.push({
                    checked: targetChainsById[c.id] ? targetChainsById[c.id].checked : true, 
                    network: c.network,
                    name: c.name,
                    id: c.id
                })
            }
        })

        form.setFieldsValue(formData)
    }

    const onToggleChain = useCallback((idx: number, newValue: boolean) => {
        const fields: MultipleMintFormData['to'] = form.getFieldValue('to')

        form.setFieldValue('to', [
            ...fields.slice(0, idx),
            {
                ...fields[idx],
                checked: newValue
            },
            ...fields.slice(idx + 1),
        ])
    }, [])

    const clearAllChains = () => {
        form.setFieldValue('to', watchedFormData.to.map((c) => ({...c, checked: false})))
    }

    const fromChain = ChainStore.getChainById(watchedFormData?.from);
    const networkFromIsDifferent = fromChain?.chainId !== chain?.id;

    const showLoader = !chains.length || !watchedFormData?.to?.length
    
    return (
        <Form size="large" layout="vertical" form={form} onFinish={onSubmit}>
            <Flex className={cn.wrapper}>
                <Flex className={cn.sourceChainWrapper}>
                    <Form.Item className={cn.formField} name="from">
                        <ChainSelect chains={chains} value={watchedFormData?.from} onChange={changeSourceChain}/>
                    </Form.Item>
                </Flex>

                <div>
                    <Image className={cn.multipleMintImage} src='/svg/multipleMint.svg' width={23} height={31} alt='>' />
                </div>

                <div className={cn.chainsWrapper}>
                    <button className={cn.clearButton} onClick={clearAllChains} type='button'>Clear All</button>

                    <div className={cn.chains}>
                        <Form.List name="to">
                            {() => (
                                showLoader ? 
                                    skeletonChains.map((idx) => <Skeleton.Button key={idx} className={cn.chainSkeleton} />)
                                : 
                                    watchedFormData.to.map((chain, idx) => (
                                        <MultipleMintFormChain 
                                            key={chain.id} 
                                            idx={idx} 
                                            onChange={onToggleChain} 
                                            network={chain?.network} 
                                            label={chain?.name} 
                                            checked={chain.checked} 
                                            bridgePrice={bridgePriceByNetwork[chain?.network]?.price}
                                        />
                                    ))
                            )}
                        </Form.List> 
                    </div>
                </div>
            </Flex>

            <Flex className={cn.footer} align="center" gap={12}>
                {networkFromIsDifferent ? (
                  <Button type="button" block onClick={switchNetwork}>
                    Switch network to {fromChain?.name}
                  </Button>
                ) : (
                  <Button block type="submit">
                    Mint
                  </Button>
                )}

                <Image className={cn.mintBonusImage} src="/svg/coins/our-mint.svg" alt="+1" width={56} height={50} />
            </Flex>
        </Form>
    )
}


export default observer(MultipleMintForm);