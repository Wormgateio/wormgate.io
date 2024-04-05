import { Interface } from "ethers"
import { BridgeType } from "../../common/enums/BridgeType"

interface Log {
    _type: string,
    address: string,
    blockHash: string,
    blockNumber: number,
    data: string,
    index: 358,
    topics: string[],
    transactionHash: string,
    transactionIndex: number
}

const tokenIdNameByBridgeType = {
    [BridgeType.Hyperlane]: 'itemId',
    [BridgeType.LayerZero]: 'tokenId',
}

export const getBlockIds = (logs: Log[], iface: Interface, bridgeType: BridgeType) => {
    const blockIds: number[] = []

    logs.forEach((log) => {
        const parsedLog = iface.parseLog({ data: log.data, topics: log.topics })

        if (parsedLog) {
            const tokenIdIndex = parsedLog?.fragment.inputs.findIndex((input) => input.name === tokenIdNameByBridgeType[bridgeType]);
            if (tokenIdIndex !== -1) {
                blockIds.push(Number(parsedLog.args[tokenIdIndex]))
            }
        }
    })

    return blockIds
}