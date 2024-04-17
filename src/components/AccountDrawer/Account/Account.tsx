import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import clsx from 'clsx';
import { Flex, message, Spin } from 'antd';
import { observer } from 'mobx-react-lite';

import styles from './Account.module.scss';
import Button from '../../ui/Button/Button';
import FormControl from '../../ui/FormControl/FormControl';
import Input from '../../ui/Input/Input';
import AccountAddress from '../../AccountAddress/AccountAddress';
import AppStore from '../../../store/AppStore';
import { twitterApi } from '../../../utils/twitterApi';
import { convertAddress, fetchPrice, getReffererEarnedInNetwork } from '../../../core/contractController';
import ChainStore from '../../../store/ChainStore';
import ClaimsModal from '../ClaimsModal/ClaimsModal';
import { EarnedItem } from '../../../common/types';

interface RewardItemProps {
  name: string;
  amount?: string;
  count?: number;
  showAmount?: boolean;
  isTotal?: boolean;
}

function RewardItem({ name, amount = `0 XP`, count = 0, isTotal = false, showAmount = true }: RewardItemProps) {
  return (
    <Flex justify="space-between" align="center" className={clsx(isTotal && styles.rewardItemTotal)}>
      <div className={styles.rewardItemName}>{name}</div>
      <div className={styles.rewardItemCount}>
        {isTotal && <Image src="/svg/xp.svg" width={24} height={24} alt="XP" />}
        {showAmount ? (
          <>
            {count ? (
              <span>
                {count} ({amount})
              </span>
            ) : (
              <span>{amount}</span>
            )}
          </>
        ) : (
          <>{count || 0}</>
        )}
      </div>
    </Flex>
  );
}

function Account() {
  const [messageApi, contextHolder] = message.useMessage();
  const { closeAccountDrawer, account, fetchAccount, disconnectTwitter, loading, clearAccount, setWalletConnected } = AppStore;

  const [earnedClaims, setEarnedClaims] = useState<string>('0');
  const [earnedItems, setEarnedItems] = useState<EarnedItem[]>([]);
  const [showClaimsModal, setShowClaimsModal] = useState<boolean>(false);

  const { chain, chains } = useNetwork();
  const { address } = useAccount();
  const { disconnect } = useDisconnect({
    onSuccess: closeAccountDrawer,
  });

  const refferalLink = useMemo(() => {
    if (address) {
      return `${document.location.origin}/?ref=${convertAddress(address)}`;
    }

    return '';
  }, [address]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refferalLink);
    await messageApi.info('Your refferal link has copied!');
  };

  const startTwitterAuth = () => {
    if (account) {
      const authUrl = twitterApi.getAuthUrl(account.id);
      window.location.assign(authUrl);
    }
  };

  const disconnectHandler = () => {
    void disconnectTwitter();
  };

  useEffect(() => {
    void fetchAccount();
  }, [fetchAccount, address]);

  const calculateEarnedClaims = async () => {
    if (chain && chains?.length && ChainStore.chains?.length && address) {
      const actualChains = ChainStore.chains.filter((c) => chains.find((x) => x.id === c.chainId));

      const earnedList = (await Promise.allSettled(
        actualChains.map(async (actualChain) => {
          const earned = await getReffererEarnedInNetwork(actualChain, address!);
          const price = await fetchPrice(actualChain.token);

          return {
            chainName: actualChain.name,
            chainNetwork: actualChain.network,
            earned,
            price,
            calculatedPrice: parseFloat(earned) * price!,
            formattedPrice: (parseFloat(earned) * price!).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 2,
            }),
          } as EarnedItem;
        })
      )) as unknown as { status: string; value: EarnedItem }[];

      const filtered = earnedList.filter((x) => x.status === 'fulfilled');
      setEarnedItems(filtered.map((x) => x?.value!));

      const sum = filtered.reduce((sum, item) => {
        return sum + item.value.calculatedPrice;
      }, 0);

      const earnedInDollars = sum.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      });

      setEarnedClaims(earnedInDollars === '0.00' ? '0' : earnedInDollars);
    }
  };

  useEffect(() => {
    calculateEarnedClaims();
  }, [chain, chains, ChainStore.chains, address]);

  const logout = () => {
    disconnect();
    clearAccount();
    setWalletConnected(false);
  };

  if (!account) {
    return (
      <div className={styles.accountLoading}>
        <Flex vertical align="center" justify="center" gap={12}>
          <Spin size="large" />
          <span>Loading account...</span>
        </Flex>
      </div>
    );
  }

  return (
    <>
      <div className={styles.account}>
        {contextHolder}

        <main className={styles.accountMain}>
          <div className={styles.card}>
            <Flex align="center" justify="space-between" className={styles.cardTitle}>
              Twitter
              {account.twitter.user && (
                <button className={styles.disconnectButton} onClick={disconnectHandler}>
                  Remove
                </button>
              )}
            </Flex>

            <Flex justify="space-between" align="center" gap={12}>
              {account.twitter.user ? (
                <Flex gap={8} align="center" className={styles.twitterAccount}>
                  <Image src="/svg/socials/twitter.svg" width={28} height={26} alt="Add Twitters" />
                  <strong className={styles.twitterUsername}>@{account.twitter.user.username}</strong>
                  {loading && <Spin />}
                </Flex>
              ) : (
                <button className={styles.connectButton} onClick={startTwitterAuth}>
                  <Image src="/svg/socials/twitter.svg" width={28} height={26} alt="Add Twitters" />
                  <strong>Connect Twitter Account</strong>
                </button>
              )}
            </Flex>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>Refferal (only for LayerZero mint)</div>
            <div>
              <FormControl title="" className={styles.refferalLinkControl}>
                <Input value={refferalLink} onClick={handleCopy} onChange={() => {}} readOnly />
              </FormControl>
            </div>
            <div className={styles.divider}></div>
            {account ? (
              <>
                <div className={styles.rewardsList}>
                  <RewardItem name="Refferals" count={account.refferals.count} showAmount={false} />

                  <RewardItem name="Referral mints" count={account.refferals.mintsCount} showAmount={false} />

                  <RewardItem name="Claimable amount" amount={`${earnedClaims}`} />
                </div>
              </>
            ) : (
              <Spin />
            )}
            <div style={{ marginTop: 12 }}>
              <Button block disabled={earnedClaims === '$0.00'} onClick={() => setShowClaimsModal(true)}>
                Claim {earnedClaims}
              </Button>
            </div>
          </div>
        </main>

        <footer>
          <Flex justify="space-between" gap={8} align="center" className={styles.walletConnector}>
            <AccountAddress className={styles.connectorAddress} address={address} />
            <button className={styles.disconnectAccountButton} onClick={logout}>
              Disconnect
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 6C5.78639 7.02477 4.91697 8.39771 4.50943 9.93294C4.10189 11.4682 4.17592 13.0915 4.7215 14.5833C5.26708 16.0751 6.25786 17.3632 7.55971 18.2732C8.86156 19.1833 10.4116 19.6714 12 19.6714C13.5884 19.6714 15.1384 19.1833 16.4403 18.2732C17.7421 17.3632 18.7329 16.0751 19.2785 14.5833C19.8241 13.0915 19.8981 11.4682 19.4906 9.93294C19.083 8.39771 18.2136 7.02477 17 6M12 4V12"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Flex>
        </footer>
      </div>

      {showClaimsModal && (
        <ClaimsModal
          open={showClaimsModal}
          onClose={() => setShowClaimsModal(false)}
          onClaimed={() => {
            setShowClaimsModal(false);
            void fetchAccount();
            void calculateEarnedClaims();
          }}
          earnedItems={earnedItems}
        />
      )}
    </>
  );
}

export default observer(Account);
