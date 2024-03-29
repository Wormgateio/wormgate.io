import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import PinataImage from "../../../../components/PinataImage";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";
import { NFTDto } from "../../../../common/dto/NFTDto";
import ListCard from "../../../../components/ListCard/ListCard";

import styles from "./NftList.module.scss";
import BridgeTypeSelect from "../../../../components/BridgeTypeSelect/BridgeTypeSelect";
import { BridgeType } from "../../../../common/enums/BridgeType";

interface NftListProps {
    data: NFTDto[];
    setBridgeType(value: BridgeType): void
    bridgeType: string
}

function NftList({ data, bridgeType, setBridgeType }: NftListProps) {
    const router = useRouter();
    const nfts = [...data].sort((a, b) => a.chainName.localeCompare(b.chainName));

    const handleCardClick = (nft: NFTDto) => {
        router.push(`/nfts/${nft.id}`);
    };

    return (
        <div>
            <div className={styles.bridgeTypeSelect}>
                <BridgeTypeSelect value={bridgeType} onChange={setBridgeType}/>
            </div>
            
            <Flex gap={24} wrap="wrap" className={styles.list}>
                {nfts.length === 0 && "NFT's list is empty"}
        
                {nfts.map((nft) => (
                    <ListCard
                        key={nft.id}
                        label={
                            <ChainLabel
                                network={nft.chainNetwork}
                                label={nft.chainName}
                                className={styles.chain}
                                iconClassName={styles.chainIcon}
                                labelClassName={styles.chainLabel}
                            />
                        }
                        image={<PinataImage hash={nft.pinataImageHash} fileName={nft.pinataFileName} name={nft.name} />}
                        title={nft.name}
                        onClick={() => handleCardClick(nft)}
                        className={styles.listItem}
                        tokenId={nft.tokenId}
                    />
                ))}
            </Flex>
        </div>
    )
}

export default observer(NftList);