import { PrismaClient } from '@prisma/client'
import { NetworkType } from '../src/common/enums/NetworkType';
const prisma = new PrismaClient()

const chains = [
    {
        chainId: 8453,
        name: 'Base',
        network: 'base',
        lzChain: 184,
        token: 'ETH',
        rpcUrl: 'https://mainnet.base.org',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 42170,
        name: 'Arbitrum Nova',
        network: 'arbitrum-nova',
        lzChain: 175,
        token: 'ETH',
        rpcUrl: 'https://arbitrum-nova.drpc.org',
        availableNetworkTypes: [NetworkType.LayerZero]
    },
    {
        chainId: 42161,
        name: 'Arbitrum One',
        network: 'arbitrum',
        lzChain: 110,
        token: 'ETH',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 43114,
        name: 'Avalance',
        network: 'avalanche',
        lzChain: 106,
        token: 'AVAX',
        rpcUrl: 'https://rpc.ankr.com/avalanche',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 59144,
        name: 'Linea Mainnet',
        network: 'linea-mainnet',
        lzChain: 183,
        token: 'ETH',
        rpcUrl: 'https://linea.drpc.org',
        availableNetworkTypes: [NetworkType.LayerZero]
    },
    {
        chainId: 5000,
        name: 'Mantle',
        network: 'mantle',
        lzChain: 181,
        token: 'MNT',
        rpcUrl: 'https://rpc.mantle.xyz',
        availableNetworkTypes: [NetworkType.LayerZero]
    },
    {
        chainId: 10,
        name: 'OP Mainnet',
        network: 'optimism',
        lzChain: 111,
        token: 'ETH',
        rpcUrl: 'https://rpc.ankr.com/optimism',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 137,
        name: 'Polygon',
        network: 'matic',
        lzChain: 109,
        token: 'MATIC',
        rpcUrl: 'https://rpc.ankr.com/polygon',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 1101,
        name: 'Polygon zkEVM',
        network: 'polygon-zkevm',
        lzChain: 158,
        token: 'MATIC',
        rpcUrl: 'https://zkevm-rpc.com',
        availableNetworkTypes: [],
    },
    {
        chainId: 534352,
        name: 'Scroll',
        network: 'scroll',
        lzChain: 214,
        token: 'ETH',
        rpcUrl: 'https://scroll.blockpi.network/v1/rpc/public',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 7777777,
        name: 'Zora',
        network: 'zora',
        lzChain: 195,
        token: 'ETH',
        rpcUrl: 'https://rpc.zora.energy',
        availableNetworkTypes: [NetworkType.LayerZero]
    },
    {
        chainId: 324,
        name: 'zkSync Era',
        network: 'zksync-era',
        lzChain: 165,
        token: 'ETH',
        rpcUrl: 'https://mainnet.era.zksync.io',
        availableNetworkTypes: [NetworkType.LayerZero]
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        network: 'bsc',
        lzChain: 102,
        token: 'BNB',
        rpcUrl: 'https://rpc.ankr.com/bsc',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 42220,
        name: 'Celo',
        network: 'celo',
        lzChain: 125,
        token: 'CELO',
        rpcUrl: 'https://forno.celo.org',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 1666600000,
        name: 'Harmony',
        network: 'harmony',
        lzChain: 116,
        token: 'ONE',
        rpcUrl: 'https://api.harmony.one',
        availableNetworkTypes: [],
    },
    {
        chainId: 1116,
        name: 'Core',
        network: 'coreDao',
        lzChain: 153,
        token: 'CORE',
        rpcUrl: 'https://rpc.coredao.org',
        availableNetworkTypes: [NetworkType.LayerZero]
    },
    {
        chainId: 100,
        name: 'Gnosis',
        network: 'gnosis',
        lzChain: 145,
        token: 'xDAI',
        rpcUrl: 'https://rpc.gnosischain.com',
        availableNetworkTypes: [NetworkType.LayerZero, NetworkType.Hyperlane]
    },
    {
        chainId: 250,
        name: 'Fantom',
        network: 'fantom',
        lzChain: 112,
        token: 'FTM',
        rpcUrl: 'https://rpc.ankr.com/fantom',
        availableNetworkTypes: [NetworkType.LayerZero]
    }
];

async function seed() {
    await prisma.$transaction(
        chains.map(chain =>
            prisma.chain.upsert({
                where: { chainId: chain.chainId },
                update: chain,
                create: chain,
            })
        )
    );
}

seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })