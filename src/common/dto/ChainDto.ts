import { Bridge } from "../enums/Bridge";

export interface ChainDto {
    id: string;
    name: string;
    network: string;
    chainId: number;
    lzChain: number;
    token: string;
    rpcUrl: string;
    availableBridges: Bridge[]
}