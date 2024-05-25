import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { Modal, Tooltip } from 'antd';
import cn from './GoldenAxeBlock.module.scss';
import AppStore from '../../../../store/AppStore';
import { observer } from 'mobx-react-lite';

function GoldenAxeBlock() {
    const { fetchGoldenAxeReward, goldenAxeReward } = AppStore;
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!goldenAxeReward) {
            fetchGoldenAxeReward()
        }
    }, [])

//    if (!goldenAxeReward) {
//        return null
//    }

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
              a chance to win <span className={cn.blueText}>$50!</span> Multiple axes and winners every day.
              Is fortune on your side today? <span className={cn.preview} onClick={() => setShowModal(true)}>Preview</span>
            </p>

            <Tooltip rootClassName={cn.tooltip} title={(
                <p className={cn.tooltipText}>
                    Every day, several Golden Axes are randomly awarded to users at various times. 
                    If you&lsquo;re one of the lucky recipients of a Golden Axe, you&lsquo;ll receive $50 in USDT, 
                    deposited directly into your OPTIMISM network wallet within 10 days, subject to verification. 
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

export default observer(GoldenAxeBlock);