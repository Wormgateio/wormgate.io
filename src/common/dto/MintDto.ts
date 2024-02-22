export interface MintDto {
    id: string;
    pinataImageHash: string;
    name: string;
    description?: string;
}

export interface CreateCustomMintDto {
    name: string;
    description?: string;
    metamaskWalletAddress: string;
    tokenId: number;
    chainNetwork: string;
    transactionHash: string;
}

export interface CreateMintDto {
    metamaskWalletAddress: string;
    tokenId: number;
    chainFromNetwork: string;
    chainToNetwork: string;
    transactionHash: string;
}