'use client';

import React from 'react';
import styles from './MobileMenuRightSide.module.scss';
import Image from 'next/image';
import { Flex } from 'antd';
import { Crystal } from '../../../WalletActions/Crystal/Crystal';
import { observer } from 'mobx-react-lite';
import AppStore from '../../../../store/AppStore';
import { useAccount } from 'wagmi';
import Button from '../../../ui/Button/Button';

function MobileMenuRightSide() {
  const { account, openAccountDrawer } = AppStore;
  const { isConnected, isConnecting } = useAccount();

  return (
    <Flex align="center">
      <Crystal number={2} />
      <div className={styles.counterWrap} style={{ color: '#4EFFFF' }}>
        <div className={styles.counter}>{account?.balance.mintsCount || 0}</div>
      </div>

      {isConnected ? (
        <button className={styles.profileButton} onClick={openAccountDrawer}>
          <Image src="/svg/ui/person.svg" width={24} height={24} alt="person" />
          <Image src="/svg/ui/dropdown-arrow.svg" width={24} height={24} alt="˅" />
        </button>
      ) : (
        <button className={styles.walletButton} onClick={openAccountDrawer}>
          <Image src="/svg/metamask.svg" width={24} height={24} alt="wallet" />
        </button>
      )}
    </Flex>
  );
}

export default observer(MobileMenuRightSide);
