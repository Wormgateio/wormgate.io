'use client';

import React, { useEffect, useMemo } from 'react';
import { Flex, Form } from 'antd';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import cn from './SingleMintForm.module.scss';

import ChainStore from '../../../../store/ChainStore';
import ChainSelect from '../../../../components/ChainSelect/ChainSelect';
import Button from '../../../../components/ui/Button/Button';
import { EstimationBridgeType } from '../../../../core/contractController';
import LzSvg from '../../../../components/BridgeTypeSelect/LzSvg';
import HyperlaneSvg from '../../../../components/BridgeTypeSelect/HyperlaneSvg';
import { BridgeType } from '../../../../common/enums/BridgeType';

interface SingleMintFormProps {
  bridgePriceList: EstimationBridgeType;
  bridgeType: BridgeType;
  updateBridgePrice: (chainFromId: number | undefined) => void;
  onSubmit: (formData: SingleMintFormData) => void;
}

export interface SingleMintFormData {
  from: string;
  to: string;
}

function SingleMintForm({ bridgePriceList, bridgeType, updateBridgePrice, onSubmit }: SingleMintFormProps) {
  const [form] = Form.useForm();
  const watchedFormData = Form.useWatch([], form);

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chains, getAvailableChainsForBridge } = ChainStore;

  useEffect(() => {
    if (watchedFormData?.from) {
      const chainId = chains.find((chain) => chain.id === watchedFormData.from)?.chainId;
      updateBridgePrice(chainId);
    }
  }, [watchedFormData?.from]);

  const selectedChain = useMemo(() => {
    if (chain && chains.length) {
      return chains.find((c) => c.network === chain.network);
    }

    return null;
  }, [chains, chain]);

  const chainsTo = useMemo(() => getAvailableChainsForBridge(watchedFormData?.from), [chains, watchedFormData?.from]);

  useEffect(() => {
    if (chains.length && chainsTo.length) {
      form.setFieldsValue({
        from: selectedChain?.id || chains[0]?.id,
        to: chains?.[0]?.id,
      });
    }
  }, [chains, selectedChain]);

  useEffect(() => {
    if (watchedFormData?.from === watchedFormData?.to) {
      form.setFieldsValue({
        to: chainsTo?.[0]?.id,
      });
    }
  }, [watchedFormData]);

  const switchNetwork = async () => {
    const chainFrom = ChainStore.getChainById(watchedFormData?.from);
    if (chainFrom && switchNetworkAsync) {
      await switchNetworkAsync(chainFrom.chainId);
      form.setFieldsValue({ amount: undefined });
    }
  };

  const fromChain = ChainStore.getChainById(watchedFormData?.from);
  const networkFromIsDifferent = fromChain?.chainId !== chain?.id;

  return (
    <Form size="large" layout="vertical" form={form} onFinish={onSubmit}>
      <Flex className={cn.formInputs} align="center">
        <Form.Item className={cn.input} style={{ flex: 1 }} name="from" label="From">
          <ChainSelect chains={chains} />
        </Form.Item>
        <Image className={cn.arrowsImage} src="/svg/arrows-left-right.svg" alt="" width={20} height={20} />
        <Form.Item className={cn.input} style={{ flex: 1 }} name="to" label="To">
          <ChainSelect chains={chainsTo} priceList={bridgePriceList} />
        </Form.Item>
      </Flex>

      <Flex align="center" gap={12}>
        {networkFromIsDifferent ? (
          <Button type="button" block onClick={switchNetwork}>
            Switch network to {fromChain?.name}
          </Button>
        ) : (
          <Button className={cn.submitButton} block type="submit">
            Mint
            <span className={cn.bridgeType}>
              {bridgeType === BridgeType.LayerZero ? (
                <LzSvg className={cn.LzSvg} />
              ) : (
                <HyperlaneSvg rootClassName={cn.Hyperlane} withoutOpacity />
              )}
            </span>
          </Button>
        )}

        <Image className={cn.mintBonusImage} src="/svg/coins/our-mint.svg" alt="+1" width={56} height={50} />
      </Flex>

      <div className={cn.mintCost}>
        <span className={cn.mintCostLabel}>Mint Cost</span>
        <span className={cn.mintCostCost}>0.00005 ETH</span>
        <span className={cn.mintCostExtra}>0.5$</span>
      </div>
    </Form>
  );
}

export default observer(SingleMintForm);
