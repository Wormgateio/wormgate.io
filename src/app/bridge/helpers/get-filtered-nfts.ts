import { NFTDto } from "../../../common/dto/NFTDto";
import { BridgeType } from "../../../common/enums/BridgeType";
import { BridgePageTab } from "../page";

export function getFilteredNfts(nfts: NFTDto[], activeTab: BridgePageTab, bridgeType: BridgeType) {
    return nfts.filter((nft) => {
        if (nft.isCustom && activeTab === BridgePageTab.Womex) {
            return false
        }

        if (!nft.isCustom && activeTab === BridgePageTab.Custom) {
            return false
        }

        if (nft.bridgeType !== bridgeType) {
            return false
        }

        return true
    })
}
