import { NextRequest } from "next/server";
import prisma from "../../../utils/prismaClient";
import { BadRequest, NotFoundError } from "../utils/responses";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');

    if (id) {
        const nft = await prisma.nft.findFirst({
            where: { id },
            include: { chain: true, user: true, tweetLog: true },
        });

        if (!nft) {
            return new NotFoundError('User not found');
        }

        return Response.json({
            id: nft.id,
            name: nft.name,
            pinataImageHash: nft.pinataImageHash,
            pinataFileName: nft.pinataFileName,
            description: nft.description,
            createdAt: nft.createdAt,
            tokenId: nft.tokenId,
            chainNativeId: nft.chain.chainId,
            chainId: nft.chain.id,
            chainNetwork: nft.chain.network,
            chainName: nft.chain.name,
            userId: nft.user.id,
            userWalletAddress: nft.user.metamaskWalletAddress,
            userName: nft.user.twitterLogin,
            tweeted: !!nft.tweetLog,
            bridgeType: nft.bridgeType
        });
    }

    return new BadRequest('NFT id is required');
}