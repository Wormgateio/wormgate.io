import { BridgeType } from "../common/enums/BridgeType";

const BLOCK_EXPLORER_BY_BRIDGE_TYPE: Record<BridgeType, string> = {
  [BridgeType.Hyperlane]: 'https://explorer.hyperlane.xyz/message',
  [BridgeType.LayerZero]: 'https://layerzeroscan.com/tx',

}

export function getBridgeBlockExplorer(bridgeType: BridgeType, hash: string) {
  if (!hash) {
    return null
  }
  
  return `${BLOCK_EXPLORER_BY_BRIDGE_TYPE[bridgeType]}/${hash}`;
}