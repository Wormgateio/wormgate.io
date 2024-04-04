'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Form } from 'antd';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import cn from './SingleMintForm.module.scss';

import ChainStore from '../../../../store/ChainStore';
import ChainSelect from '../../../../components/ChainSelect/ChainSelect';
import Button from '../../../../components/ui/Button/Button';
import { estimateBridge, EstimationBridgeType } from '../../../../core/contractController';
import { BRIDGE_ESTIMATION_TOKENS, getContractAddress } from '../../../../common/constants';
import { NetworkName } from '../../../../common/enums/NetworkName';
import AppStore from '../../../../store/AppStore';
import { HYPERLANE_QUERY_PARAM_NAME } from '@utils/hyperlaneQueryParamName';
import { BridgeType } from '../../../../common/enums/BridgeType';
import { useSearchParams } from 'next/navigation';

interface SingleMintFormProps {
  onSubmit: (formData: SingleMintFormData) => void;
}

export interface SingleMintFormData {
  from: string;
  to: string;
}

function SingleMintForm({ onSubmit }: SingleMintFormProps) {
  const searchParams = useSearchParams()
  const [form] = Form.useForm();
  const watchedFormData = Form.useWatch([], form);

  const { account } = AppStore;
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chains } = ChainStore;
  const { address } = useAccount();

  const [bridgePriceList, setBridgePriceList] = useState<EstimationBridgeType>([]);

  const estimateBridgeFee = async () => {
    const chainFrom = ChainStore.getChainById(watchedFormData?.from);
    const nftChain = ChainStore.chains.find((c) => c.chainId === chainFrom?.chainId);
    const chain = ChainStore.chains.find((c) => c.id === watchedFormData?.to);

    if (chain) {
      let _currentNetwork: string = chainFrom?.network!;
      const bridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME) ? BridgeType.Hyperlane : BridgeType.LayerZero

      const priceList = await estimateBridge(
        chains,
        nftChain?.token!,
        {
          contractAddress: getContractAddress(bridgeType, _currentNetwork as NetworkName),
          bridgeType,
          chainToSend: {
            id: chain.chainId,
            name: chain.name,
            network: chain.network,
            lzChain: chain.lzChain,
            hyperlaneChain: chain.hyperlaneChain,
            token: chain.token,
          },
          account,
          accountAddress: address!,
        },
        BRIDGE_ESTIMATION_TOKENS[chainFrom?.network as NetworkName],
        false,
        0
      );

      setBridgePriceList(priceList);
    }
  };

  const selectedChain = useMemo(() => {
    if (chain && chains.length) {
      return chains.find((c) => c.network === chain.network);
    }

    return null;
  }, [chains, chain]);

  useEffect(() => {
    estimateBridgeFee();
  }, [watchedFormData, chain]);

  const chainsTo = useMemo(() => {
    return chains.filter((c) => c.id !== watchedFormData?.from);
  }, [chains, watchedFormData?.from]);

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
          <Button block type="submit">
            Mint
          </Button>
        )}

        <Image className={cn.mintBonusImage} src="/svg/coins/our-mint.svg" alt="+1" width={56} height={50} />
      </Flex>

      <div className={cn.mintCost}>
        <span className={cn.mintCostLabel}>Mint Cost</span>
        <span className={cn.mintCostCost}>0.29$</span>
        <span className={cn.mintCostExtra}>0.5$</span>
      </div>
    </Form>
  );
}

export default observer(SingleMintForm);
