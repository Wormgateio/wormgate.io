'use client';

import { useEffect, useMemo, useState } from "react";
import { Flex, Form } from "antd";
import { useAccount, useNetwork } from "wagmi";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import cn from './SingleMintForm.module.scss';

import ChainStore from "../../../../store/ChainStore";
import ChainSelect from "../../../../components/ChainSelect/ChainSelect";
import Button from "../../../../components/ui/Button/Button";
import { estimateBridge, EstimationBridgeType } from "../../../../core/contractController";
import { BRIDGE_ESTIMATION_TOKENS, CONTRACT_ADDRESS, UnailableNetworks } from "../../../../common/constants";
import { NetworkName } from "../../../../common/enums/NetworkName";
import AppStore from "../../../../store/AppStore";
import { ChainDto } from "../../../../common/dto/ChainDto";

interface SingleMintFormProps {
    onSubmit: (formData: SingleMintFormData) => void;
}

export interface SingleMintFormData {
    from: string;
    to: string;
}

function SingleMintForm({ onSubmit }: SingleMintFormProps) {
    const [form] = Form.useForm();
    const watchedFormData = Form.useWatch([], form);

    const { account } = AppStore;
    const { chain } = useNetwork();
    const { chains } = ChainStore;
    const { address } = useAccount();

    const [_chains, setChains] = useState<ChainDto[]>([]);
    const [bridgePriceList, setBridgePriceList] = useState<EstimationBridgeType>([]);

    const chainFrom = ChainStore.getChainById(watchedFormData?.from);

    const estimateBridgeFee = async () => {
        const nftChain = ChainStore.chains.find(c => c.chainId === chainFrom?.chainId);
        const chain = ChainStore.chains.find(c => c.id === watchedFormData?.to);

        if (chain) {
            let _currentNetwork: string = chainFrom?.network!;

            const priceList = await estimateBridge(_chains, nftChain?.token!, {
                contractAddress: CONTRACT_ADDRESS[_currentNetwork as NetworkName],
                chainToSend: {
                    id: chain.chainId,
                    name: chain.name,
                    network: chain.network,
                    lzChain: chain.lzChain,
                    token: chain.token
                },
                account,
                accountAddress: address!
            }, BRIDGE_ESTIMATION_TOKENS[chainFrom?.network as NetworkName], false, 0);

            setBridgePriceList(priceList);
        }
    };

    const selectedChain = useMemo(() => {
        if (chain && chains.length) {
            return chains.find(c => c.network === chain.network)
        }

        return null;
    }, [chains, chain]);

    useEffect(() => {
        if (chains.length && watchedFormData?.from && chainFrom) {
            const _chains = chains
                .filter(x => x.id !== chainFrom.id)
                .filter(x => !UnailableNetworks[x.network as NetworkName]?.includes(chainFrom.network as NetworkName));

            setChains(_chains);
        } else {
            setChains(chains);
        }
    }, [chains, watchedFormData, chainFrom]);

    useEffect(() => {
        if (chainFrom) {
            estimateBridgeFee();
        }
    }, [watchedFormData, chain]);

    const chainsTo = useMemo(() => {
        return _chains.filter(c => c.id !== watchedFormData?.from);
    }, [_chains, watchedFormData?.from])

    useEffect(() => {
        if (chains.length) {
            form.setFieldsValue({
                from: selectedChain?.id || chains[0]?.id,
                to: chainsTo?.[0]?.id
            });
        }
    }, [chains, selectedChain]);

    useEffect(() => {
        if (watchedFormData?.from === watchedFormData?.to) {
            form.setFieldsValue({
                to: chainsTo?.[0]?.id
            });
        }
    }, [watchedFormData]);

    console.log({
        chainsTo,
        _chains,
        watchedFormData
    })

    return (
        <Form size="large" layout="vertical" form={form} onFinish={onSubmit}>
            <Flex align="center" gap={12}>
                <Form.Item style={{ flex: 1 }} name="from" label="From">
                    <ChainSelect chains={chains} />
                </Form.Item>
                <Image src="/svg/arrows-left-right.svg" alt="" width={20} height={20} />
                <Form.Item style={{ flex: 1 }} name="to" label="To">
                    <ChainSelect chains={chainsTo} priceList={bridgePriceList} />
                </Form.Item>
            </Flex>

            <Flex align="center" gap={12}>
                <Button block type="submit">Mint</Button>
                <Image src="/svg/coins/our-mint.svg" alt="+1" width={56} height={50} />
            </Flex>

            <div className={cn.mintCost}>
                <span className={cn.mintCostLabel}>Mint Cost</span>
                <span className={cn.mintCostCost}>0.25$</span>
                <span className={cn.mintCostExtra}>0.5$</span>
            </div>
        </Form>
    )
}

export default observer(SingleMintForm);