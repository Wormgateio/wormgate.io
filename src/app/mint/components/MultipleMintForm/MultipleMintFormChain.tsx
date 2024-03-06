import React, { useMemo } from 'react'
import { Checkbox, Form } from 'antd'
import cn from './MultipleMintForm.module.scss'
import { getChainLogo } from '@utils/getChainLogo';
import Image from 'next/image';

interface MultipleMintFormChainProps {
  label: string,
  network: string | undefined;
  checked: boolean
  idx: number
  onChange(idx: number, value: boolean): void
}

export default function MultipleMintFormChain({ label, network, checked, idx, onChange }: MultipleMintFormChainProps) {
  const chainLogo = useMemo(() => getChainLogo(network || ''), [network]);

  return (
    <Checkbox className={cn.formChain} checked={checked} onChange={(e) => onChange(idx, e.target.checked)}>
      <div className={cn.chainLabelWrapper}>
        {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}
        <h4 className={cn.chainLabel}>{label}</h4>
      </div>
    </Checkbox>
  )
}
