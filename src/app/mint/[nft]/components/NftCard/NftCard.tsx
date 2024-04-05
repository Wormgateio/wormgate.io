import React from 'react'
import cn from './NftCard.module.scss';
import { NFTDto } from '../../../../../common/dto/NFTDto';
import ListCard from '../../../../../components/ListCard/ListCard';
import BridgeForm from '../BridgeForm/BridgeForm';
import PinataImage from '../../../../../components/PinataImage';

interface Props {
    nft: NFTDto,
    refetch(): void
    onCardClick(nft: NFTDto): void
}

export default function NftCard({ nft, refetch, onCardClick }: Props) {
  return (
    <div className={cn.nft}>
        <ListCard
            className={cn.card}
            tokenId={nft.tokenId}
            image={<PinataImage hash={nft.pinataImageHash} fileName={nft.pinataFileName} name={nft.name} />}
            onClick={() => onCardClick(nft)}
        />
        
        <BridgeForm
            disabeldSelect
            chainIdToFirstBridge={nft.chainIdToFirstBridge}
            nft={nft}
            onAfterBridge={refetch}
            simple
        />
    </div>
  )
}
