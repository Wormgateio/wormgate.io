import React, { useMemo } from 'react'
import { Checkbox, Flex, Form } from 'antd'
import cn from './MultipleMintForm.module.scss'
import { getChainLogo } from '@utils/getChainLogo';
import Image from 'next/image';

interface MultipleMintFormChainProps {
  label: string,
  network: string | undefined;
  checked: boolean
  bridgePrice: string | undefined;
  idx: number
  onChange(idx: number, value: boolean): void
}

export default function MultipleMintFormChain({ label, network, checked, bridgePrice, idx, onChange }: MultipleMintFormChainProps) {
  const chainLogo = useMemo(() => getChainLogo(network || ''), [network]);

  return (
    <Checkbox className={cn.formChain} checked={checked} onChange={(e) => onChange(idx, e.target.checked)}>
      <div className={cn.chainLabelWrapper}>
        <div className={cn.chainLabel}>
          {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}
          <h4 className={cn.chainName}>{label}</h4>
        </div>
        {bridgePrice && bridgePrice !== '0.00' && (
          <Flex align="center" gap={4} className={cn.price}>
            <Image src="/svg/ui/fuel.svg" width={16} height={16} alt="" />
            <span>${bridgePrice}</span>
          </Flex>
        )}
      </div>
    </Checkbox>
  )
}
