import { BridgeType, User } from "@prisma/client";

import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperationCost } from "../../../common/enums/BalanceOperationCost";
import { CreateMintDto } from "../../../common/dto/MintDto";
import { goldenAxeIpf, ipfs } from './ipfs';
import { NftType } from "../../../common/enums/NftType";
import { compareAsc } from "date-fns/compareAsc";
import { getRandomTimesForDay } from "@utils/getRandomTimeForDay";
import { addDays, getDay } from "date-fns";

const NFTS_COUNT_FOR_MINT_GOLDEN_AXE = 1

interface GoldenAxeMintOptions {
    mintTime: Date,
    mintTimes: Date[]
    perDay: number
}

/**
 * Mint операция
 */
export async function POST(request: Request) {
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

    const data: CreateMintDto = await request.json();

    const chainFrom = await prisma.chain.findFirst({
        where: { network: data.chainFromNetwork }
    });

    if (!chainFrom) {
        return new BadRequest(`Chain network ${data.chainFromNetwork} not found`);
    }

    const nfts = await getNfts(user, data.tokenIds.length)

    const nftPromises = nfts.map(({ nft, goldenAxeOptions }, idx) => createNFT({
        name: nft.name,
        description: '',
        pinataImageHash: nft.hash,
        pinataJsonHash: null,
        pinataFileName: nft.fileName,
        user,
        userId: user.id,
        tokenId: data.tokenIds[idx],
        chainId: chainFrom.id,
        chainToNetwork: data.chainToNetworks[idx],
        transactionHash: data.transactionHash,
        isCustom: false,
        bridgeType: data.bridgeType
    }, goldenAxeOptions))

    const createdNfts = await Promise.all(nftPromises)

    return Response.json(createdNfts);
}

interface CreateNFTDto {
    name: string;
    description?: string;
    pinataImageHash: string;
    pinataJsonHash: string | null;
    pinataFileName: string;
    user: User;
    userId: string;
    tokenId: number;
    chainId: string;
    chainToNetwork: string;
    transactionHash: string;
    isCustom: boolean;
    bridgeType: BridgeType;
}

async function createNFT(data: CreateNFTDto, goldenAxeOptions: GoldenAxeMintOptions | null) {
    return prisma.$transaction(async (context) => {

        const chainToFirstBridge = await context.chain.findFirst({
            where: { network: data.chainToNetwork }
        });

        const nft = await context.nft.create({
            data: {
                name: data.name,
                description: data.description,
                pinataImageHash: data.pinataImageHash,
                pinataJsonHash: data.pinataJsonHash,
                pinataFileName: data.pinataFileName,
                userId: data.userId,
                tokenId: data.tokenId,
                chainId: data.chainId,
                chainIdToFirstBridge: chainToFirstBridge?.id,
                isCustom: data.isCustom,
                bridgeType: data.bridgeType
            }
        });

        if (goldenAxeOptions) {
            await context.rareNft.update({
                where: { type: NftType.GoldenAxe },
                data: { mintTimes: getNewMintTimesForGoldenAxe(goldenAxeOptions) }
            })
        }

        const balanceLog = await context.balanceLog.create({
           data: {
               userId: data.userId,
               operation: BalanceOperation.Debit,
               description: 'Начисление за Mint',
               type: BalanceLogType.Mint,
               amount: BalanceOperationCost.Mint,
            }
        });

        await context.mintLog.create({
            data: {
                balanceLogId: balanceLog.id,
                nftId: nft.id,
                transactionHash: data.transactionHash,
                nftType: goldenAxeOptions ? NftType.GoldenAxe : NftType.Common
            }
        });

        if (data.user.reffererId) {
            const balanceLog = await context.balanceLog.create({
                data: {
                    userId: data.user.reffererId,
                    operation: BalanceOperation.Debit,
                    description: 'Начисление за минт от реферального пользователя',
                    type: BalanceLogType.RefferalMint,
                    amount: BalanceOperationCost.RefferalMint,
                }
            });

            await context.refferalLog.create({
                data: {
                    balanceLogId: balanceLog.id,
                    reffererId: data.user.reffererId,
                    refferalId: data.userId
                }
            });
        }

        return nft;
    });
}

async function getNfts(user: User, nftsCount: number) {
    if (user && user.twitterLogin && nftsCount === NFTS_COUNT_FOR_MINT_GOLDEN_AXE){
        const goldenAxeOptions = await prisma.rareNft.findFirst({
            where: { type: NftType.GoldenAxe }
        });

        if (goldenAxeOptions) {
            const mintTime = goldenAxeOptions.mintTimes.find((time) => compareAsc(new Date(), new Date(time)) !== -1) 

            if (mintTime) {
                return [
                    { 
                        nft: goldenAxeIpf, 
                        goldenAxeOptions: {
                            mintTime,
                            mintTimes: goldenAxeOptions.mintTimes,
                            perDay: goldenAxeOptions.perDay
                        } 
                    }
                ]
            }

        }
    }

    return new Array(nftsCount).fill(0).map(() => ({ nft: ipfs[Math.floor(Math.random() * ipfs.length)], goldenAxeOptions: null })) 
}

function getNewMintTimesForGoldenAxe(goldenAxeOptions: GoldenAxeMintOptions) {
    const newMintTimes = goldenAxeOptions.mintTimes.filter((mintTime) => mintTime > new Date())

    if (!newMintTimes.length) {
        const currentDay = getDay(new Date())
        const mintDay = getDay(goldenAxeOptions.mintTime)

        // if we don't mint golden axe for previous day we need to generate new mint times for current day, not for next.
        if (currentDay !== mintDay) {
            return getRandomTimesForDay(goldenAxeOptions.perDay, new Date())
        }
        
        return getRandomTimesForDay(goldenAxeOptions.perDay, addDays(new Date(), 1))
    }

    return newMintTimes
}