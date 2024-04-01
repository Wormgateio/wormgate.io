'use client'

import { observer } from "mobx-react-lite";

import AppStore  from "../../store/AppStore";
import dynamic from 'next/dynamic';
import { Flex, Modal, Skeleton, Spin } from 'antd';

const DynamicAccount = dynamic(() => import('./Account/Account'), {
  loading: () => (
    <Flex vertical align="center" justify="center" gap={12}>
      <Spin size="large" />
      <span>Loading account...</span>
    </Flex>
  ),
});

const DynamicConnectWallet = dynamic(() => import('./ConnectWallet/ConnectWallet'), {
  loading: () => (
    <Skeleton.Button
      active
      shape="round"
      size="large"
      block
      style={{ background: 'linear-gradient(90deg, rgb(255 255 255 / 6%) 25%, rgb(255 255 255 / 15%) 37%, rgb(255 255 255 / 6%) 63%)' }}
    />
  ),
});

function AccountDrawer() {
    const { accountDrawerOpened, closeAccountDrawer, walletConnected } = AppStore;

    return (
        <>
            <Modal footer={false} title={walletConnected ? 'Profile' : 'Connect a Wallet'} open={accountDrawerOpened} onCancel={closeAccountDrawer}>
                {walletConnected ? <DynamicAccount /> : <DynamicConnectWallet />}
            </Modal>
        </>
    );
}

export default observer(AccountDrawer);