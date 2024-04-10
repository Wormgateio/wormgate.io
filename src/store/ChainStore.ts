import { enableStaticRendering } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { ChainDto } from "../common/dto/ChainDto";
import ApiService from "../services/ApiService";
import { BridgeType } from "../common/enums/BridgeType";
import { getUnavailableNetworks } from "../common/constants";
import { NetworkName } from "../common/enums/NetworkName";

enableStaticRendering(typeof window === 'undefined');

class ChainStore {
    loading = false;
    chains: ChainDto[] = [];
    activeChain: ChainDto | null = null
    bridgeType: BridgeType = BridgeType.LayerZero

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    async getChains(bridgeType: BridgeType, activeChainId: number | undefined) {
        this.loading = true;

        try {
            const chains = await ApiService.getChains(bridgeType);
            this.chains = chains.sort((a, b) => a.name.localeCompare(b.name));

            this.setActiveChain(activeChainId)
        } finally {
            this.loading = false;
        }
    }

    setActiveChain(chainId: number | undefined){
        if (!chainId) {
            this.activeChain = null;
        }

        const chain = this.chains.find((chain) => chain.chainId === chainId);

        this.activeChain = chain || null;
    }

    setBridgeType(bridgeType: BridgeType) {
        this.bridgeType = bridgeType
    }

    get availableChainsForBridge(): ChainDto[] {
        if (this.activeChain) {
            const unailableNetworks = getUnavailableNetworks(this.bridgeType)
            return this.chains.filter((chain) => chain.chainId !== this.activeChain?.chainId && !unailableNetworks[this.activeChain?.network as NetworkName]?.includes(chain.network as NetworkName))
        }

        return this.chains;
    }

    getAvailableChainsForBridge(activeChainId: string | undefined, bridgeType: BridgeType = this.bridgeType): ChainDto[] {
        if (activeChainId) {
            const activeChain = this.chains.find((chain) => chain.id === activeChainId);

            if (activeChain) {
                const unailableNetworks = getUnavailableNetworks(bridgeType)
                
                return this.chains.filter((chain) => {
                    const isCorrectBridgeType = chain.availableBridgeTypes.includes(bridgeType);
                    const isAvailableNetwork = !unailableNetworks[activeChain.network as NetworkName]?.includes(chain.network as NetworkName)
                    const isNotActiveChain = chain.chainId !== activeChain.chainId
                    
                    return isCorrectBridgeType && isAvailableNetwork && isNotActiveChain
                })
            }
        }

        return this.chains;
    }

    getChainById(id: string) {
        return this.chains.find((chain) => chain.id === id);
    }

    getChainByNetwork(network: string) {
        return this.chains.find((chain) => chain.network === network);
    }
}

export default new ChainStore();