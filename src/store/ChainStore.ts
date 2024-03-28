import { enableStaticRendering } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { ChainDto } from "../common/dto/ChainDto";
import ApiService from "../services/ApiService";
import { Bridge } from "../common/enums/Bridge";

enableStaticRendering(typeof window === 'undefined');

class ChainStore {
    loading = false;
    chains: ChainDto[] = [];

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    async getChains(bridge: Bridge) {
        this.loading = true;

        try {
            const chains = await ApiService.getChains(bridge);
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