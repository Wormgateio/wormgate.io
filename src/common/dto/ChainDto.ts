import { BridgeType } from "../enums/BridgeType";

export interface ChainDto {
    id: string;
    name: string;
    network: string;
    chainId: number;
    lzChain: number;
    hyperlaneChain: number;
    token: string;
    rpcUrl: string;
    availableBridgeTypes: BridgeType[]
}