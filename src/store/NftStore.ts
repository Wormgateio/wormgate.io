import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import ApiService from "../services/ApiService";
import { NFTDto } from "../common/dto/NFTDto";
import { toDictionary } from "@utils/toDictionary";

enableStaticRendering(typeof window === 'undefined');

class NftStore {
    loading: boolean = false;
    nfts: NFTDto[] = [];
    selectedNftId: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async getNfts() {
        this.loading = true;

        try {
            this.nfts = await ApiService.getCollection();
        } finally {
            this.loading = false;
        }
    }

    setNft(id: string | null) {
        this.selectedNftId = id;
    }

    selectedNft() {
        return this.nfts.find((nft) => nft.id === this.selectedNftId);
    }

    selectNftById(id: string) {
        return this.nfts.find((nft) => nft.id === id);
    }

    selectNftsByIds(ids: string[]) {
        const nftById = toDictionary(this.nfts, (n) => n.id);

        return ids.reduce((res: NFTDto[], id) => {
            if (nftById[id]) {
                res.push(nftById[id])
            }

            return res
        }, [])
    }
    
    selectNftByHash(hash: string) {
        return this.nfts.find((nft) => nft.pinataImageHash === hash);
    }
}

export default new NftStore();