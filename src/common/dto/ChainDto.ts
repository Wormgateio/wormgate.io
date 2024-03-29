import { NetworkType } from "../enums/NetworkType";

export interface ChainDto {
    id: string;
    name: string;
    network: string;
    chainId: number;
    lzChain: number;
    token: string;
    rpcUrl: string;
    availableNetworkTypes: NetworkType[]
}