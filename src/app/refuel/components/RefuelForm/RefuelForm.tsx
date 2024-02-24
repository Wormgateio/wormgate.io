'use client';

import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {  Divider, Flex, Form, Input, message, Tooltip } from "antd";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import Image from "next/image";
import cn from './RefuelForm.module.scss';

import Button from "../../../../components/ui/Button/Button";
import styles from "../../../bridge/components/NftModal/NftModal.module.css";
import ChainSelect from "../../../../components/ChainSelect/ChainSelect";
import ChainStore from "../../../../store/ChainStore";
import {
    estimateRefuelFee,
    fetchPrice,
    getBalance,
    getMaxTokenValueInDst,
    refuel
} from "../../../../core/contractController";
import ApiService from "../../../../services/ApiService";
import AppStore from "../../../../store/AppStore";
import Card from "../../../../components/ui/Card/Card";

function RefuelForm() {
    const [messageApi, contextHolder] = message.useMessage();
    const { fetchAccount } = AppStore;
    const [form] = Form.useForm();
    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { isConnected, address } = useAccount();
    const { chains } = ChainStore;
    const watchedFormData = Form.useWatch([], form);

    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [fromPrice, setFromPrice] = useState<number | null>(0);
    const [toPrice, setToPrice] = useState<number | null>(0);
    const [maxAmount, setMaxAmount] = useState<number | null>(0);
    const [feeNativeCost, setFeeNativeCost] = useState<number | null>(null);
    const [feeLzCost, setFeeLzCost] = useState<number | null>(null);
    const [refueling, setRefueling] = useState<boolean>(false);

    const selectedChain = useMemo(() => {
        if (chain && chains.length) {
            return chains.find(c => c.network === chain.network)
        }

        return null;
    }, [chains, chain]);

    const chainsTo = useMemo(() => {
        return chains.filter(c => c.id !== watchedFormData?.from);
    }, [chains, watchedFormData?.from]);

    const setMax = () => {
        form.setFieldsValue({ amount:  balance > (maxAmount || 0) ? maxAmount : balance})
    }

    useEffect(() => {
        if (chains.length) {
            form.setFieldsValue({
                from: selectedChain?.id || chains[0]?.id,
                to: chainsTo[0]?.id
            });
        }
    }, [chains, selectedChain]);

    const switchNetwork = async () => {
        const chainFrom = ChainStore.getChainById(watchedFormData?.from);
        if (chainFrom && switchNetworkAsync) {
            await switchNetworkAsync(chainFrom.chainId);
            form.setFieldsValue({ amount: undefined });
        }
    }

    const normalizeValue = (value: number, unit = 5) => {
        return value !== null ? parseFloat(value.toFixed(unit)) : 0
    }

    const isSameToken = useMemo(() => {
        const chainFrom = ChainStore.getChainById(watchedFormData?.from);
        const chainTo = ChainStore.getChainById(watchedFormData?.to);
        return chainFrom?.token === chainTo?.token;
    }, [watchedFormData]);

    const updateBalance = async () => {
        if (isConnected) {
            setBalance(normalizeValue(Number(await getBalance(true))));
        }
    };

    /**
     * Done
     */
    const updatePrices = async () => {
        setLoading(true);

        const fromPrice = await fetchPrice(ChainStore.getChainById(watchedFormData?.from)?.token!);
        const toPrice = await fetchPrice(ChainStore.getChainById(watchedFormData?.to)?.token!);

        setFromPrice(fromPrice);
        setToPrice(toPrice);

        setLoading(false);
    };

    const updateMaxAmount = async () => {
        setMaxAmount(Number(await getMaxTokenValueInDst(
            ChainStore.getChainById(watchedFormData?.from)!,
            ChainStore.getChainById(watchedFormData?.to)!,
            true
        )));
    };

    const updateFeeAmount = async () => {
        const amount = normalizeValue(
            isSameToken ?
                parseFloat(watchedFormData?.amount) || 0 :
                ((parseFloat(watchedFormData?.amount) || 0) * fromPrice!) / toPrice!,
            5
        )

        const from = ChainStore.getChainById(watchedFormData?.from!)!;
        const to = ChainStore.getChainById(watchedFormData?.to!)!;
        const fee = await estimateRefuelFee(from, to, amount.toString())

        setFeeNativeCost(fee.nativeFee);
        setFeeLzCost(Math.abs((parseFloat(watchedFormData?.amount) || 0) - fee.nativeFee!));
    }

    const updateInfo = async () => {
        setLoading(true);

        if ((parseFloat(watchedFormData?.amount) || 0) > 0) {
            if ((parseFloat(watchedFormData?.amount) || 0) <= balance && (parseFloat(watchedFormData?.amount) || 0) <= maxAmount!) {
                await updateFeeAmount()
            }
        } else {
            setFeeLzCost(null);
        }

        setLoading(false);
    };

    const updateData = async () => {
        setLoading(true);

        await updatePrices();
        await updateMaxAmount();
        await updateInfo();

        setLoading(false);
    }

    useEffect(() => {
        ChainStore.getChains();
    }, []);

    useEffect(() => {
        if (chains.length && watchedFormData?.from && watchedFormData?.to) {
            updateBalance();
            updateData();
        }
    }, [address, chain, chains, watchedFormData, maxAmount]);

    useEffect(() => {
        if (selectedChain && chains.length) {
            form.setFieldsValue({
                from: selectedChain?.id,
                to: chains[0]?.id
            });
        }
    }, [chains, selectedChain]);

    const onSubmit = async (formData: {
        from: string;
        to: string;
        amount: number;
    }) => {
        try {
            const { from, to, amount } = formData;

            setRefueling(true);

            const fromChain = ChainStore.getChainById(from)!;
            const toChain = ChainStore.getChainById(to)!;

            const amountToSend = normalizeValue(
                (amount * fromPrice!) / toPrice!,
                5
            ).toString();

            const { hash } = await refuel(
                fromChain,
                toChain,
                amountToSend
            );

            await ApiService.createRefuel({
                metamaskWalletAddress: address as string,
                chainFromNetwork: fromChain.network,
                chainToNetwork: toChain.network,
                transactionHash: hash
            });

            setRefueling(false);
            await fetchAccount();

            messageApi.success({
                content: 'Refuel Successful',
            });

            await updateBalance();
        } catch (e) {
            console.error(e);
            setRefueling(false);
            await messageApi.error('Oops, Something went wrong :(');
        }
    };

    const outputRaw = useMemo(() => {
        let output = 0

        if (
            (parseFloat(watchedFormData?.amount) || 0) &&
            isConnected &&
            !loading &&
            feeNativeCost !== null
        ) {
            output = isSameToken ?
                (parseFloat(watchedFormData?.amount) || 0) :
                ((parseFloat(watchedFormData?.amount) || 0) * fromPrice!) / toPrice!;

            output = normalizeValue(output, output > 1 ? 4 : 5);

            return output;
        }

        return output;
    }, [watchedFormData, isConnected, isSameToken, loading, feeNativeCost, fromPrice, toPrice]);

    const outputRawFormatted = useMemo(() => {
        const chainTo = ChainStore.getChainById(watchedFormData?.to);
        return `${outputRaw ? outputRaw : '--'} ${chainTo?.token}`
    }, [outputRaw, watchedFormData]);

    const outputUSD = useMemo(() => {
        if (loading) return null;

        const USD = normalizeValue(outputRaw *
            toPrice!,
            2);

        return USD !== 0 ? `$(${USD})` : null
    }, [loading, fromPrice, toPrice]);

    const amountMaxOutput = useMemo(() => {
        let output = 0;

        const chainFrom = ChainStore.getChainById(watchedFormData?.from);

        if (isConnected &&
            maxAmount &&
            chainFrom?.network === chain?.network
        ) {
            output = normalizeValue(
                isSameToken ?
                    maxAmount :
                    (maxAmount * toPrice!) / fromPrice!,
                5
            )

            output = normalizeValue(output, output > 1 ? 0 : 5)
        }


        return output && output !== Infinity ? `${output} ${chainFrom?.token}` : null;
    }, [isConnected, maxAmount, fromPrice, toPrice]);

    const estimatedTransferTime = useMemo(() => {
        if (!maxAmount) return '--'

        const transferTimeMap: Record<number, string> = {
            137: '~5min',
            1101: '~3min'
        };

        const chainFrom = ChainStore.getChainById(watchedFormData?.from)!;
        const chainTo = ChainStore.getChainById(watchedFormData?.to)!;

        if (transferTimeMap[chainFrom?.chainId]) {
            return transferTimeMap[chainFrom?.chainId];
        }

        if (transferTimeMap[chainTo?.chainId]) {
            return transferTimeMap[chainTo?.chainId];
        }

        return '~1min'
    }, [maxAmount]);

    const refuelFeeOutput = useMemo(() => {
        const chainFrom = ChainStore.getChainById(watchedFormData?.from)!;
        return `${feeLzCost ? '0' : '--'} ${chainFrom?.token}`;
    }, [feeLzCost, watchedFormData]);

    const feeLzOutput = useMemo(() => {
        let output = 0;

        if (feeLzCost &&
            !loading &&
            feeNativeCost !== null
        ) {
            output = normalizeValue(feeLzCost, feeLzCost > 1 ? 4 : 5);
        }

        const chainFrom = ChainStore.getChainById(watchedFormData?.from)!;
        return `${output !== 0 ? output : '--'} ${chainFrom?.token}`

    }, [feeLzCost, loading, feeNativeCost, watchedFormData]);

    const feeLzOutputUSD = useMemo(() => {
        if (loading) return null

        const USD = normalizeValue(feeLzCost! * fromPrice!, 2)
        return USD !== 0 ? `$(${USD})` : null
    }, [feeLzCost, loading]);

    const fromChain = ChainStore.getChainById(watchedFormData?.from);
    const networkFromIsDifferent = fromChain?.chainId !== chain?.id;

    const disabledSubmit = !watchedFormData?.amount!;

    return (
        <>
            <Card title="Refuel" isLoading={refueling} className={cn.card}>
                <Form form={form} size="large" layout="vertical" onFinishFailed={e => console.error(e)} onFinish={onSubmit}>
                    <Flex align="center" justify="center" gap={8} className={cn.refuelCostBanner}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M7 4.375C5.56104 4.375 4.375 5.56104 4.375 7V23.625H16.625V17.5H18.375V21C18.375 22.439 19.561 23.625 21 23.625C22.439 23.625 23.625 22.439 23.625 21V12.0859C23.625 11.3887 23.3516 10.7461 22.8594 10.2539L18.7305 6.125L17.5 7.35547L19.9883 9.84375C19.0483 10.2437 18.375 11.1699 18.375 12.25C18.375 13.689 19.561 14.875 21 14.875C21.3076 14.875 21.5981 14.8101 21.875 14.7109V21C21.875 21.4956 21.4956 21.875 21 21.875C20.5044 21.875 20.125 21.4956 20.125 21V17.5C20.125 16.543 19.332 15.75 18.375 15.75H16.625V7C16.625 5.56104 15.439 4.375 14 4.375H7ZM7 6.125H14C14.4956 6.125 14.875 6.50439 14.875 7V10.5H6.125V7C6.125 6.50439 6.50439 6.125 7 6.125ZM21 11.375C21.4922 11.375 21.875 11.7578 21.875 12.25C21.875 12.7422 21.4922 13.125 21 13.125C20.5078 13.125 20.125 12.7422 20.125 12.25C20.125 11.7578 20.5078 11.375 21 11.375ZM6.125 12.25H14.875V21.875H6.125V12.25Z" fill="url(#paint0_linear_602_6931)" fillOpacity="0.78"/>
                            <defs>
                                <linearGradient id="paint0_linear_602_6931" x1="14" y1="4.375" x2="14" y2="23.625" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#B087F3"/>
                                    <stop offset="1" stopColor="#9757FF"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <Flex align="center" gap={4}>
                            <div className={cn.refuelCostBannerLabel}>Free</div>
                            <Tooltip title={(
                                <div style={{ maxWidth: 360, padding: '0 4px' }}>
                                    The womex.io protocol does not deduct a fee for Refuel. <br/>
                                    The transaction value consists of the LayerZero fee and the current gwei value on the network.
                                </div>
                            )}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <g opacity="0.48">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6024 18.3332 10C18.3332 5.39763 14.6022 1.66667 9.99984 1.66667C5.39746 1.66667 1.6665 5.39763 1.6665 10C1.6665 14.6024 5.39746 18.3333 9.99984 18.3333ZM8.99745 11.9018V12.0257H10.5044V11.9018C10.5074 11.565 10.5452 11.2822 10.6176 11.0534C10.693 10.8214 10.8076 10.6196 10.9615 10.4481C11.1184 10.2765 11.319 10.1112 11.5634 9.95234C11.841 9.77757 12.0808 9.57897 12.2829 9.35654C12.4851 9.1341 12.6405 8.87989 12.7491 8.5939C12.8607 8.30792 12.9165 7.9838 12.9165 7.62155C12.9165 7.08453 12.7928 6.6206 12.5454 6.22975C12.301 5.83572 11.9586 5.53226 11.5181 5.31936C11.0807 5.10646 10.5738 5.00001 9.99757 5.00001C9.4696 5.00001 8.98689 5.10169 8.54942 5.30506C8.11498 5.50843 7.76501 5.81348 7.49951 6.22022C7.23704 6.62695 7.09826 7.13219 7.08317 7.73594H8.69424C8.70932 7.43725 8.77871 7.19098 8.90241 6.99715C9.02912 6.80013 9.18752 6.65396 9.37759 6.55863C9.57067 6.46013 9.77432 6.41087 9.98852 6.41087C10.2208 6.41087 10.4305 6.46171 10.6176 6.5634C10.8076 6.66508 10.9585 6.80808 11.0701 6.99238C11.1817 7.17668 11.2376 7.39435 11.2376 7.64538C11.2376 7.86782 11.1953 8.0696 11.1108 8.25072C11.0264 8.42867 10.9102 8.59073 10.7624 8.7369C10.6176 8.87989 10.4531 9.01176 10.2691 9.13251C10.0006 9.30728 9.77281 9.49953 9.58576 9.70925C9.3987 9.9158 9.25389 10.1891 9.15131 10.5291C9.05175 10.8691 9.00046 11.3267 8.99745 11.9018ZM9.08343 14.695C9.27953 14.8983 9.51335 15 9.78488 15C9.9659 15 10.1303 14.9539 10.2782 14.8618C10.429 14.7664 10.5497 14.6393 10.6402 14.4805C10.7337 14.3216 10.7805 14.1452 10.7805 13.9514C10.7805 13.6654 10.6809 13.4207 10.4818 13.2174C10.2857 13.014 10.0534 12.9123 9.78488 12.9123C9.51335 12.9123 9.27953 13.014 9.08343 13.2174C8.88733 13.4207 8.78927 13.6654 8.78927 13.9514C8.78927 14.2437 8.88733 14.4916 9.08343 14.695Z" fill="white"/>
                                    </g>
                                </svg>
                            </Tooltip>
                        </Flex>
                    </Flex>

                    <Flex align="center" gap={12}>
                        <Form.Item style={{ flex: 1 }} name="from" label="From">
                            <ChainSelect
                                chains={chains}
                                className={styles.dropdown}
                            />
                        </Form.Item>
                        <Image src="/svg/arrows-left-right.svg" alt="" width={20} height={20} />
                        <Form.Item style={{ flex: 1 }} name="to" label="To">
                            <ChainSelect
                                chains={chainsTo}
                                className={styles.dropdown}
                            />
                        </Form.Item>
                    </Flex>

                    <Form.Item name="amount" className={cn.amount} label={
                        <Flex align="center" justify="space-between">
                            <div>Refuel Amount</div>
                            <div>Balance: {balance} <button onClick={setMax} className={cn.maxButton} type="button">Max</button></div>
                        </Flex>
                    }>
                        <Input type="number" rootClassName={cn.input} placeholder={`0 ${fromChain?.token || 'ETH'}`} />
                    </Form.Item>
                    {!networkFromIsDifferent && <div className={cn.maxRefuel}>Max Refuel: {amountMaxOutput || '--'}</div>}

                    <Divider />

                    <div className={cn.refuelInfo}>
                        <Flex className={cn.refuelInfoItem} justify="space-between" align="center" wrap="wrap">
                            <div className={cn.refuelInfoName}>Estimated Transfer Time</div>
                            <div className={cn.refuelInfoPrice}>
                                {estimatedTransferTime}
                            </div>
                        </Flex>
                        <Flex className={cn.refuelInfoItem} justify="space-between" align="center" wrap="wrap">
                            <div className={cn.refuelInfoName}>Refuel Fee</div>
                            <div className={cn.refuelInfoPrice}>
                                {refuelFeeOutput}
                            </div>
                        </Flex>
                        <Flex className={cn.refuelInfoItem} justify="space-between" align="center" wrap="wrap">
                            <div className={cn.refuelInfoName}>LayerZero Fee</div>
                            <div className={cn.refuelInfoPrice}>
                                {feeLzOutput} <span>{feeLzOutputUSD}</span>
                            </div>
                        </Flex>
                        <Flex className={cn.refuelInfoItem} justify="space-between" align="center" wrap="wrap">
                            <div className={cn.refuelInfoName}>Expected Output</div>
                            <div className={cn.refuelInfoPrice}>
                                {outputRawFormatted} <span>{outputUSD}</span>
                            </div>
                        </Flex>
                    </div>

                    <Flex align="center" gap={12}>
                        {networkFromIsDifferent
                            ? <Button type="button" block onClick={switchNetwork}>Switch network to {fromChain?.name}</Button>
                            : <Button type="submit" block disabled={disabledSubmit}>
                                {watchedFormData?.amount ? 'Refuel' : 'Enter amount'}
                            </Button>
                        }
                        <Image src="/svg/coins/refuel.svg" alt="+1" width={56} height={50} />
                    </Flex>
                </Form>
            </Card>

            {contextHolder}
        </>
    )
}

export default observer(RefuelForm);