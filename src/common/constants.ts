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

export const CONTRACT_REFUEL_ADDRESS: Record<NetworkName, CryptoAddress> = {
    [NetworkName.Base]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.ArbitrumNova]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.LineaMainnet]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Optimism]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Polygon]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Zora]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Scroll]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Mantle]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Arbitrum]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Avalanche]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.ZkSync]: '0x0E55617A818e4454A95255f42226A71C38F8f364',
    [NetworkName.BSC]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Celo]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Core]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Gnosis]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
    [NetworkName.Fantom]: '0x762f491a899525ec5270ed67697d8c8a6835e1d7',
};

export const LZ_RELAYER: Record<NetworkName, CryptoAddress> = {
    [NetworkName.Base]: '0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa',
    [NetworkName.ArbitrumNova]: '0xa658742d33ebd2ce2f0bdff73515aa797fd161d9',
    [NetworkName.LineaMainnet]: '0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9',
    [NetworkName.Optimism]: '0x81e792e5a9003cc1c8bf5569a00f34b65d75b017',
    [NetworkName.Polygon]: '0x75dc8e5f50c8221a82ca6af64af811caa983b65f',
    [NetworkName.Zora]: '0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9',
    [NetworkName.Scroll]: '0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9',
    [NetworkName.Mantle]: '0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa',
    [NetworkName.Arbitrum]: '0x177d36dbe2271a4ddb2ad8304d82628eb921d790',
    [NetworkName.Avalanche]: '0xcd2e3622d483c7dc855f72e5eafadcd577ac78b4',
    [NetworkName.ZkSync]: '0x9923573104957bf457a3c4df0e21c8b389dd43df',
    [NetworkName.BSC]: '0xa27a2ca24dd28ce14fb5f5844b59851f03dcf182',
    [NetworkName.Celo]: '0x15e51701f245f6d5bd0fee87bcaf55b0841451b3',
    [NetworkName.Core]: '0xfe7c30860d01e28371d40434806f4a8fcdd3a098',
    [NetworkName.Gnosis]: '0x5b19bd330a84c049b62d5b0fc2ba120217a18c1c',
    [NetworkName.Fantom]: '0x52eea5c490fb89c7a0084b32feab854eeff07c82',
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