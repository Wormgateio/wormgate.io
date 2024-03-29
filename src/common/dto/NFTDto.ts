import { BridgeType } from "../enums/BridgeType";

export interface NFTDto {
    id: string;
    pinataImageHash: string;
    pinataFileName: string;
    name: string;
    description: string;
    createdAt: string;
    tokenId: number;
    chainNativeId: number;
    chainId: string;
    chainNetwork: string;
    chainName: string;
    chainIdToFirstBridge: string;
    userId: string;
    userWalletAddress: string;
    userName: string | null;
    tweeted: boolean;
    isCustom: boolean;
    bridgeType: BridgeType
}