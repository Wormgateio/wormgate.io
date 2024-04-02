import { enableStaticRendering } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { ChainDto } from "../common/dto/ChainDto";
import ApiService from "../services/ApiService";
import { BridgeType } from "../common/enums/BridgeType";

enableStaticRendering(typeof window === 'undefined');

class ChainStore {
    loading = false;
    chains: ChainDto[] = [];

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    async getChains(bridgeType: BridgeType) {
        this.loading = true;

        try {
            const chains = await ApiService.getChains(bridgeType);
            this.chains = chains.sort((a, b) => a.name.localeCompare(b.name));
        } finally {
            this.loading = false;
        }
    }

    getChainById(id: string) {
        return this.chains.find((chain) => chain.id === id);
    }

    getChainByNetwork(network: string) {
        return this.chains.find((chain) => chain.network === network);
    }
}

export default new ChainStore();