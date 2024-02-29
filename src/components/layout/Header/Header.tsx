'use client';

import { useMedia } from 'use-media';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import WalletActions from '../../WalletActions/WalletActions';
import MobileMenu from '../../MobileMenu/MobileMenu';
import AppStore from '../../../store/AppStore';

import styles from './Header.module.scss';
import { MediaBreakpoint } from '@utils/mediaBreakpoints/mediaBreakpoint';

function Header() {
  const { fetchAccount } = AppStore;
  const isDesktop = useMedia({ maxWidth: MediaBreakpoint.Tablet });

  useEffect(() => {
    fetchAccount();
  }, []);

  return <div className={styles.header}>{isDesktop ? <MobileMenu /> : <WalletActions />}</div>;
}

export default observer(Header);
