'use client';

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { message, Tabs } from 'antd';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';

import styles from './page.module.scss';
import Card from '../../components/ui/Card/Card';
import MultipleMintForm, { MultipleMintFormData } from './components/MultipleMintForm/MultipleMintForm';
import SingleMintForm, { SingleMintFormData } from './components/SingleMintForm/SingleMintForm';
import AppStore from '../../store/AppStore';
import { EstimationBridgeType, estimateBridge, mintNFT } from '../../core/contractController';
import { BRIDGE_ESTIMATION_TOKENS, getContractAddress } from '../../common/constants';
import { NetworkName } from '../../common/enums/NetworkName';
import ApiService from '../../services/ApiService';
import ChainStore from '../../store/ChainStore';
import GoldenAxeBlock from './components/GoldenAxeBlock/GoldenAxeBlock';
import { useGetChains } from '../../hooks/use-get-chains';
import { HYPERLANE_QUERY_PARAM_NAME } from '@utils/hyperlaneQueryParamName';
import { BridgeType } from '../../common/enums/BridgeType';
import BridgeTypeSelect from '../../components/BridgeTypeSelect/BridgeTypeSelect';
import { NFT_IDS_DIVIDER } from '@utils/nftIdsDivider';

function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bridgePriceList, setBridgePriceList] = useState<EstimationBridgeType>([]);
  const { account, walletConnected, openAccountDrawer, fetchAccount } = AppStore;
  const { chains } = ChainStore;
  const getChains = useGetChains();

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const bridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME) ? BridgeType.Hyperlane : BridgeType.LayerZero;

  const estimateBridgeFee = async (chainFromId: number | undefined) => {
    const chainFrom = ChainStore.chains.find((c) => c.chainId === chainFromId);
    let _currentNetwork: string = chainFrom?.network!;

    if (chain?.network !== chainFrom?.network) {
      setBridgePriceList([]);
      return;
    }

    const priceList = await estimateBridge(
      chains,
      chainFrom?.token!,
      {
        contractAddress: getContractAddress(bridgeType, _currentNetwork as NetworkName),
        bridgeType,
      },
      BRIDGE_ESTIMATION_TOKENS[chainFrom?.network as NetworkName],
      false,
      0
    );

    setBridgePriceList(priceList);
  };

  useEffect(() => {
    if (account?.id) {
      estimateBridgeFee(chain?.id);
    } else {
      setBridgePriceList([]);
    }
  }, [chain, chains.length, bridgeType, account?.id]);

  const mint = async (from: string, mintAction: () => Promise<any>) => {
    if (!walletConnected) {
      openAccountDrawer();
      messageApi.info('Connect a wallet before Mint!');
      return;
    }

    if (!ChainStore.chains.length) {
      await getChains();
    }

    const chainFrom = ChainStore.getChainById(from);
    if (chain?.network !== chainFrom?.network) {
      await switchNetworkAsync?.(chainFrom?.chainId);
    }

    if (chain) {
      setIsLoading(true);

      try {
        await mintAction();
      } catch (e) {
        console.error(e);
        setIsLoading(false);

        if (e instanceof AxiosError) {
          await messageApi.error(e?.response?.data?.message);
          return;
        }

        await messageApi.error('Oops, Something went wrong :(\nPlease reload this page and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const mintSingle = async (formData: SingleMintFormData) => {
    const mintSingleNft = async () => {
      if (!chain) {
        return;
      }

      const bridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME) ? BridgeType.Hyperlane : BridgeType.LayerZero;

      const result = await mintNFT({
        contractAddress: getContractAddress(bridgeType, chain.network as NetworkName),
        bridgeType,
        chainToSend: {
          id: chain.id,
          name: chain.name,
          network: chain.network,
          hyperlaneChain: null,
          lzChain: null,
          token: 'ETH',
        },
        account,
        accountAddress: address!,
      });

      if (result.result) {
        const chainFrom = ChainStore.getChainById(formData.from);
        const chainTo = ChainStore.getChainById(formData.to);
        const nft = await ApiService.createMint({
          metamaskWalletAddress: address as string,
          tokenIds: result.blockIds!,
          chainFromNetwork: chainFrom?.network!,
          chainToNetworks: [chainTo?.network!],
          transactionHash: result?.transactionHash!,
          bridgeType,
        });
        router.push(`/mint/${nft[0].id}?successful=true`);
        await fetchAccount();
      } else {
        messageApi.warning(result.message);
      }
    };

    mint(formData.from, mintSingleNft);
  };

  const mintMultiple = async (formData: MultipleMintFormData) => {
    const mintMultipleNft = async () => {
      if (!chain) {
        return;
      }
      const bridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME) ? BridgeType.Hyperlane : BridgeType.LayerZero;
      const chainsTo = formData.to.filter(({ checked }) => checked);

      const result = await mintNFT({
        contractAddress: getContractAddress(bridgeType, chain.network as NetworkName),
        bridgeType,
        chainToSend: {
          id: chain.id,
          name: chain.name,
          network: chain.network,
          hyperlaneChain: null,
          lzChain: null,
          token: 'ETH',
        },
        account,
        accountAddress: address!,
        nftsCount: chainsTo.length,
      });

      if (result.result) {
        const chainFrom = ChainStore.getChainById(formData.from);

        const nft = await ApiService.createMint({
          metamaskWalletAddress: address as string,
          tokenIds: result.blockIds!,
          chainFromNetwork: chainFrom?.network!,
          chainToNetworks: chainsTo.map(({ network }) => network),
          transactionHash: result?.transactionHash!,
          bridgeType,
        });

        const ntfIds = nft.map(({ id }) => id);
        router.push(`/mint/${ntfIds.join(NFT_IDS_DIVIDER)}?successful=true`);
        await fetchAccount();
      } else {
        messageApi.warning(result.message);
      }
    };

    mint(formData.from, mintMultipleNft);
  };

  const tabs = [
    {
      key: 'single',
      label: 'Single',
      children: (
        <SingleMintForm
          onSubmit={mintSingle}
          bridgePriceList={bridgePriceList}
          updateBridgePrice={estimateBridgeFee}
          bridgeType={bridgeType}
        />
      ),
    },
    {
      key: 'multiple',
      label: 'Multiple',
      children: (
        <MultipleMintForm
          onSubmit={mintMultiple}
          bridgePriceList={bridgePriceList}
          updateBridgePrice={estimateBridgeFee}
          bridgeType={bridgeType}
        />
      ),
    },
  ];

  const changeBridgeType = (bridgeType: string) => {
    if (bridgeType === BridgeType.LayerZero) {
      router.replace(pathname);
    } else {
      router.push(`?${HYPERLANE_QUERY_PARAM_NAME}=true`);
    }
  };

  return (
    <>
      {contextHolder}

      <Card isLoading={isLoading} className={styles.page} title="Mint and Bridge NFT" afterCard={<GoldenAxeBlock />}>
        <BridgeTypeSelect onChange={changeBridgeType} value={bridgeType} />
        <Tabs className={styles.tabs} defaultActiveKey="single" items={tabs} type="card" />
      </Card>
    </>
  );
}

export default observer(Page);
