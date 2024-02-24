'use client'

import { observer } from "mobx-react-lite";

import ConnectWallet from "./ConnectWallet/ConnectWallet";
import Account from "./Account/Account";
import AppStore  from "../../store/AppStore";
import { Modal } from "antd";

function AccountDrawer() {
    const { accountDrawerOpened, closeAccountDrawer, walletConnected } = AppStore;

    return (
        <>
            <Modal footer={false} title={walletConnected ? 'Profile' : 'Connect a Wallet'} open={accountDrawerOpened} onCancel={closeAccountDrawer}>
                {walletConnected ? <Account /> : <ConnectWallet />}
            </Modal>
        </>
    );
}

export default observer(AccountDrawer);