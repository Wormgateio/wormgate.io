import { Dropdown, Flex, message } from 'antd';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi';
import { getChainLogo } from '../../utils/getChainLogo';

import styles from './NetworkChainSelect.module.css';
import ChainStore from '../../store/ChainStore';
import { observer } from 'mobx-react-lite';
import { toDictionary } from '../../utils/toDictionary';
import { useMedia } from 'use-media';
import { MediaBreakpoint } from '@utils/mediaBreakpoints';

const WRONG_NETWORK = 'Wrong Network'

interface NetworkChainSelectProps {
  className?: string;
}

function NetworkChainSelect({ className }: NetworkChainSelectProps) {
  const isMobile = useMedia({ maxWidth: MediaBreakpoint.Mobile });
  const [messageApi, contextHolder] = message.useMessage();
  const { chain, chains: allChains } = useNetwork();
  const { chains: availableChains } = ChainStore;
  const { reset, switchNetwork, error } = useSwitchNetwork({
    onSettled: () => {
      reset();
    },
  });

  const { chainName, chainsMenu } = useMemo(() => {
    const chainsById = toDictionary(allChains, x => x.id);

    const chains = [...availableChains].reduce((chains: Chain[], { chainId }) => {
      const chain = chainsById[chainId]

      if (chain) {
        chains.push(chain)
      }

      return chains;
    }, [])

    const chainName = chain && chains.some(({ network }) => network === chain.network) ? chain.name : WRONG_NETWORK

    return {
      chainName,
      chainsMenu: [...chains]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({
        key: c.id,
        label: c.name,
        icon: <Image width={24} height={24} src={getChainLogo(c.network)} alt="" />,
      }))
    }
  }, [allChains, availableChains, chain])

  const chainLogo = useMemo(() => chainName === WRONG_NETWORK ? '' : getChainLogo(chain?.network!), [chain, chainName]);

  const handleSwitchNetwork = (chainId: number) => {
    if (switchNetwork) {
      switchNetwork(chainId);
    }
  };

  useEffect(() => {
    if (error) {
      void messageApi.warning('User rejected the request');
    }
  }, [error, messageApi]);

  if (!chain || !switchNetwork) {
    return null;
  }

  const isKnownChain = chainName !== WRONG_NETWORK

  return (
    <>
      {contextHolder}

      <Dropdown
        trigger={['click']}
        menu={{
          items: chainsMenu,
          selectable: true,
          defaultSelectedKeys: [String(chain.id)],
          onClick: ({ key }) => handleSwitchNetwork(parseInt(key)),
        }}
        rootClassName={styles.dropdown}
      >
        <Flex
          align="center"
          gap={8}
          className={clsx('network-chain-select', styles.dropdownBtn, !isKnownChain && styles.wrong, className)}
        >
          {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}

          {isMobile && !isKnownChain ? 
            <Image src="/svg/ui/error-circle.svg" width={24} height={24} alt="" />
            : 
            <div className={clsx(styles.value, 'network-chain-select__name')}>{chainName}</div>          
          }

          <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="" />
        </Flex>
      </Dropdown>
    </>
  );
}

export default observer(NetworkChainSelect)