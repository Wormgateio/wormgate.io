import React, { useMemo } from 'react'
import { Checkbox, Form, Image } from 'antd'
import cn from './MultipleMintForm.module.scss'
import { getChainLogo } from '@utils/getChainLogo';

interface MultipleMintFormChainProps {
  label: string,
  value: string,
  network: string | undefined;
}

export default function MultipleMintFormChain({ label, value, network }: MultipleMintFormChainProps) {
  const chainLogo = useMemo(() => getChainLogo(network || ''), [network]);

  return (
    <Form.Item className={cn.formField} name={value} valuePropName="to">
      <Checkbox className={cn.formChain}>
        <div className={cn.chainLabelWrapper}>
          {chainLogo && <Image src={chainLogo} width={24} height={24} alt="" />}

          <h4 className={cn.chainLabel}>{label}</h4>
        </div>
      </Checkbox>
   </Form.Item>
  )
}
