import { BadRequest } from "../utils/responses";
import prisma from "../../../utils/prismaClient";

export async function GET(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    const user = await prisma.user.findFirst({
        where: { metamaskWalletAddress }
    });

    if (!user) {
        return new BadRequest('User not found');
    }

    const nfts = await prisma.nft.findMany({
        where: {
            userId: user.id
        },
        select: {
            id: true,
            pinataImageHash: true,
            pinataFileName: true,
            name: true,
            description: true,
            createdAt: true,
            tokenId: true,
            tweetLog: true,
            chain: true,
            user: true,
            isCustom: true,
            chainIdToFirstBridge: true,
            bridgeType: true
        }
    }).then(list => list.map(item => {
        return ({
            id: item.id,
            name: item.name,
            pinataImageHash: item.pinataImageHash,
            pinataFileName: item.pinataFileName,
            isCustom: item.isCustom,
            description: item.description,
            createdAt: item.createdAt,
            tokenId: item.tokenId,
            chainNativeId: item.chain.chainId,
            chainId: item.chain.id,
            chainNetwork: item.chain.network,
            chainName: item.chain.name,
            chainIdToFirstBridge: item.chainIdToFirstBridge,
            userId: item.user.id,
            userWalletAddress: item.user.metamaskWalletAddress,
            userName: item.user.twitterLogin,
            tweeted: !!item.tweetLog,
            bridgeType: item.bridgeType
        })
    }));

    return Response.json(nfts);
}