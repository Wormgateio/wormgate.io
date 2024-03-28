import { Flex } from "antd";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";

import PinataImage from "../../../../components/PinataImage";
import ChainLabel from "../../../../components/ChainLabel/ChainLabel";
import { NFTDto } from "../../../../common/dto/NFTDto";
import ListCard from "../../../../components/ListCard/ListCard";

import styles from "./NftList.module.scss";
import BridgeSelect from "../../../../components/BridgeSelect/BridgeSelect";
import { HYPERLANE_QUERY_PARAM_NAME } from "@utils/hyperlaneQueryParamName";

function NftList({ data }: { data: NFTDto[] }) {
    const router = useRouter();
    const searchParams = useSearchParams()
    const nfts = [...data].sort((a, b) => a.chainName.localeCompare(b.chainName));

    const handleCardClick = (nft: NFTDto) => {
        const isHyperlaneBridge = searchParams.get(HYPERLANE_QUERY_PARAM_NAME)

        router.push(`/nfts/${nft.id}${isHyperlaneBridge ? `?${HYPERLANE_QUERY_PARAM_NAME}=true` : ''}`);
    };

    return (
        <div>
            {!!nfts.length && (
                <div className={styles.bridgeSelect}>
                    <BridgeSelect />
                </div>
            )}
            
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