export interface CreateRefuelDto {
    transactionHash: string;
    metamaskWalletAddress: string;
    chainFromNetwork: string;
    chainToNetwork: string;
}