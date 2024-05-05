import { CryptoAddress } from './types';
import { NetworkName } from './enums/NetworkName';
import { BridgeType } from './enums/BridgeType';

export const LZ_CONTRACT_ADDRESS: Record<NetworkName, CryptoAddress> = {
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

export const BRIDGE_ESTIMATION_TOKENS: Record<NetworkName, number> = {
  [NetworkName.Base]: 35000004,
  [NetworkName.ArbitrumNova]: 90000008,
  [NetworkName.LineaMainnet]: 5000001,
  [NetworkName.Optimism]: 15000001,
  [NetworkName.Polygon]: 20000003,
  [NetworkName.Zora]: 40000001,
  [NetworkName.Scroll]: 45000001,
  [NetworkName.Mantle]: 100000003,
  [NetworkName.Arbitrum]: 10000003,
  [NetworkName.Avalanche]: 30000001,
  [NetworkName.ZkSync]: 105000002,
  [NetworkName.BSC]: 25000002,
  [NetworkName.Celo]: 65000001,
  [NetworkName.Core]: 60000001,
  [NetworkName.Gnosis]: 85000001,
  [NetworkName.Fantom]: 9500000,
};

const LZ_UNAVAILABLE_NETWORKS: Record<NetworkName, NetworkName[]> = {
  [NetworkName.ArbitrumNova]: [NetworkName.Scroll, NetworkName.Core],
  [NetworkName.Arbitrum]: [],
  [NetworkName.Avalanche]: [NetworkName.Zora],
  [NetworkName.Base]: [NetworkName.Core, NetworkName.Avalanche],
  [NetworkName.BSC]: [],
  [NetworkName.LineaMainnet]: [NetworkName.Core],
  [NetworkName.Mantle]: [NetworkName.Core],
  [NetworkName.Optimism]: [],
  [NetworkName.Polygon]: [],
  [NetworkName.Scroll]: [NetworkName.ArbitrumNova, NetworkName.Core, NetworkName.Celo],
  [NetworkName.ZkSync]: [NetworkName.Celo, NetworkName.Core],
  // important to use vpn for zora if located in Russia
  [NetworkName.Zora]: [NetworkName.Core],
  [NetworkName.Celo]: [NetworkName.Core, NetworkName.Scroll, NetworkName.ZkSync],
  [NetworkName.Core]: [
    NetworkName.ArbitrumNova,
    NetworkName.Base,
    NetworkName.Celo,
    NetworkName.Fantom,
    NetworkName.Gnosis,
    NetworkName.LineaMainnet,
    NetworkName.Mantle,
    NetworkName.Scroll,
    NetworkName.ZkSync,
    NetworkName.Zora,
  ],
  [NetworkName.Gnosis]: [NetworkName.Core],
  [NetworkName.Fantom]: [NetworkName.Core],
};

const HYPERLANE_UNAVAILABLE_NETWORKS: Partial<Record<NetworkName, NetworkName[]>> = {
  [NetworkName.Arbitrum]: [],
  [NetworkName.Avalanche]: [],
  [NetworkName.Base]: [],
  [NetworkName.BSC]: [],
  [NetworkName.Optimism]: [],
  [NetworkName.Polygon]: [],
  [NetworkName.Scroll]: [],
  [NetworkName.Celo]: [],
  [NetworkName.Gnosis]: [],
};

export const HYPERLANE_CONTRACT_ADDRESS: Partial<Record<NetworkName, CryptoAddress>> = {
  [NetworkName.Base]: '0x11b965675aaafb77ab738bc797663677278d16b2',
  // [NetworkName.ArbitrumNova]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
  // [NetworkName.LineaMainnet]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
  [NetworkName.Optimism]: '0x11b965675aaafb77ab738bc797663677278d16b2',
  [NetworkName.Polygon]: '0x11b965675aaafb77ab738bc797663677278d16b2',
 // [NetworkName.Zora]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
  [NetworkName.Scroll]: '0x11b965675aaafb77ab738bc797663677278d16b2',
 // [NetworkName.Mantle]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
  [NetworkName.Arbitrum]: '0x11b965675aaafb77ab738bc797663677278d16b2',
  [NetworkName.Avalanche]: '0x11b965675aaafb77ab738bc797663677278d16b2',
 // [NetworkName.ZkSync]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
  [NetworkName.BSC]: '0x11b965675aaafb77ab738bc797663677278d16b2',
  [NetworkName.Celo]: '0x11b965675aaafb77ab738bc797663677278d16b2',
 // [NetworkName.Core]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
  [NetworkName.Gnosis]: '0x11b965675aaafb77ab738bc797663677278d16b2',
 // [NetworkName.Fantom]: '0xfFD7026AD9dF52aA82982c40F15f88c4B92e4C25',
};

export const HyperlaneAvailableNetworks = [NetworkName.Base, NetworkName.Polygon, NetworkName.Arbitrum, NetworkName.Gnosis];

export function getContractAddress(ntType: BridgeType, network: NetworkName): CryptoAddress {
  if (ntType === BridgeType.LayerZero) {
    return LZ_CONTRACT_ADDRESS[network as NetworkName];
  }

  if (ntType === BridgeType.Hyperlane) {
    return HYPERLANE_CONTRACT_ADDRESS[network as NetworkName] || ('' as CryptoAddress);
  }

  return '' as CryptoAddress;
}

export function getUnavailableNetworks(bridgeType: BridgeType) {
  return bridgeType === BridgeType.Hyperlane ? HYPERLANE_UNAVAILABLE_NETWORKS : LZ_UNAVAILABLE_NETWORKS;
}

export const DEFAULT_REFUEL_COST_USD = 0.25;
export const REFUEL_AMOUNT_USD = [DEFAULT_REFUEL_COST_USD, 0.5, 0.75, 1];

export const TWEET_CONTENT =
  'Just created a unique omnichain NFT at @Womex_io. Mint NFT, and make bridges using Layer Zero and earn future project tokens.\nCheck out my NFT: ';
