'use client';

import { useMedia } from 'use-media';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import WalletActions from '../../WalletActions/WalletActions';
import MobileMenu from '../../MobileMenu/MobileMenu';
import AppStore from '../../../store/AppStore';

import styles from './Header.module.scss';
import { MediaBreakpoint } from '@utils/mediaBreakpoints/mediaBreakpoint';
import { useGetChains } from '../../../hooks/use-get-chains';
import { useSearchParams } from 'next/navigation';
import { HYPERLANE_QUERY_PARAM_NAME } from '@utils/hyperlaneQueryParamName';
import { useNetwork } from 'wagmi';
import ChainStore from '../../../store/ChainStore';
import { BridgeType } from '../../../common/enums/BridgeType';

function Header() {
  const searchParams = useSearchParams()
  const { fetchAccount } = AppStore;
  const { setActiveChain, setBridgeType } = ChainStore;
  const { chain } = useNetwork();
  const isDesktop = useMedia({ maxWidth: MediaBreakpoint.Tablet });
  const getChains = useGetChains()

  const bridgeType = searchParams.get(HYPERLANE_QUERY_PARAM_NAME) ? BridgeType.Hyperlane : BridgeType.LayerZero

  useEffect(() => {
    getChains()
    setBridgeType(bridgeType)
  }, [bridgeType])

  useEffect(() => {
    setActiveChain(chain?.id)
  }, [chain?.id])

  useEffect(() => {
    fetchAccount();
  }, []);

  return <div className={styles.header}>{isDesktop ? <MobileMenu /> : <WalletActions />}</div>;
}

export default observer(Header);
