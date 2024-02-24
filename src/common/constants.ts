import { CryptoAddress } from "./types";
import { NetworkName } from "./enums/NetworkName";

export const CONTRACT_ADDRESS: Record<NetworkName, CryptoAddress> = {
    [NetworkName.Base]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.ArbitrumNova]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.LineaMainnet]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Optimism]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Polygon]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Zora]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Scroll]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Mantle]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Arbitrum]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Avalanche]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.ZkSync]: '0x0B5448ab6E035bC28800a6CA18Fe6E9b695F9c8D',
    [NetworkName.BSC]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Celo]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Core]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Gnosis]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
    [NetworkName.Fantom]: '0xC9940D3C5fCe7F5868D127B38128768AEC7A0809',
};

export const UnailableNetworks: Record<NetworkName, NetworkName[]> = {
    [NetworkName.ArbitrumNova]: [
        NetworkName.Mantle,
        NetworkName.Scroll,
        NetworkName.Zora
    ],
    [NetworkName.Arbitrum]: [],
    [NetworkName.Avalanche]: [
        NetworkName.Zora
    ],
    [NetworkName.Base]: [],
    [NetworkName.BSC]: [
        NetworkName.Zora
    ],
    [NetworkName.LineaMainnet]: [],
    [NetworkName.Mantle]: [
        NetworkName.ArbitrumNova,
        NetworkName.Zora
    ],
    [NetworkName.Optimism]: [],
    [NetworkName.Polygon]: [],
    [NetworkName.Scroll]: [
        NetworkName.ArbitrumNova,
        NetworkName.Zora
    ],
    [NetworkName.ZkSync]: [
        NetworkName.Zora
    ],
    [NetworkName.Zora]: [
        NetworkName.ArbitrumNova,
        NetworkName.Avalanche,
        NetworkName.BSC,
        NetworkName.Mantle,
        NetworkName.Scroll,
    ],
    [NetworkName.Celo]: [],
    [NetworkName.Core]: [],
    [NetworkName.Gnosis]: [],
    [NetworkName.Fantom]: [],
}

export const DEFAULT_REFUEL_COST_USD = 0.25;
export const REFUEL_AMOUNT_USD = [DEFAULT_REFUEL_COST_USD, 0.5, 0.75, 1];

export const TWEET_CONTENT = "Just created a unique omnichain NFT at @Womex_io. Mint NFT, and make bridges using Layer Zero and earn future project tokens.\nCheck out my NFT: ";