import React, { useState } from 'react'
import Image from "next/image";
import { Modal, Tooltip } from 'antd';
import cn from './GoldenAxeBlock.module.scss';

export default function GoldenAxeBlock() {
    const [showModal, setShowModal] = useState(false);

    const modalTitle = (
        <div className={cn.modalTitle}>
            <h3>Preview</h3> 
            <button onClick={() => setShowModal(false)} className={cn.modalClose}>Close</button>
        </div>
    )

  return (
    <>
        <div className={cn.wrapper}>
            <h3 className={cn.title}>Strike Gold with Every Mint!</h3>
            <p className={cn.text}>
              Discover the <span className={cn.yellowText}>Golden Axe</span> in your daily mint for 
              a chance to win <span className={cn.blueText}>$100!</span> Multiple axes and winners every day.
              Is fortune on your side today? <span className={cn.preview} onClick={() => setShowModal(true)}>Preview</span>
            </p>

            <Tooltip rootClassName={cn.tooltip} title={(
                <p className={cn.tooltipText}>
                    Every day, several Golden Axes are randomly awarded to users at various times. 
                    If you're one of the lucky recipients of a Golden Axe, you'll receive $100 in USDT, 
                    deposited directly into your BEP-20 network wallet within 3 days, subject to verification. 
                    Keep minting for your chance to strike gold!
                </p>
            )}>
                <Image className={cn.questionMark} src='/question-mark.png' width={20} height={20} alt='?' />
            </Tooltip>
        </div>

        <Modal 
            open={showModal}
            onCancel={() => setShowModal(false)} 
            title={modalTitle} 
            centered 
            footer={<></>} 
            closeIcon={false} 
            className={cn.modal}
            classNames={{
                content: cn.modalContent,
                header: cn.modalHeader,
                mask: cn.modalMask,
                body: cn.modalBody
            }}
        >
            <Image className={cn.modalImage} src='/bg/big-golden-axe.jpg' width={360} height={360} alt='golden axe' />
        </Modal>
    </>
  )
}
