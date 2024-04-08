import { Interface } from "ethers"

interface Log {
    _type: string,
    address: string,
    blockHash: string,
    blockNumber: number,
    data: string,
    topics: string[],
    transactionHash: string,
    transactionIndex: number
}

export const getBlockIds = (logs: Log[], iface: Interface) => {
    const blockIds: number[] = []

    logs.forEach((log) => {
        if (log.data !== "0x") {
            return
        }

        const parsedLog = iface.parseLog({ data: log.data, topics: log.topics })

        if (parsedLog) {
            const tokenIdIndex = parsedLog.fragment.inputs.findIndex((input) => input.name === 'tokenId');
            if (tokenIdIndex !== -1) {
                blockIds.push(Number(parsedLog.args[tokenIdIndex]))
            }
        }
    })

    return blockIds
}