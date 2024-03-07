import { User } from "@prisma/client";

import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperationCost } from "../../../common/enums/BalanceOperationCost";
import { CreateMintDto } from "../../../common/dto/MintDto";
import { goldenAxeIpf, ipfs } from './ipfs';
import { NftType } from "../../../common/enums/NftType";
import { compareAsc } from "date-fns/compareAsc";
import { getRandomTimeForNextDay } from "@utils/getRandomTimeForNextDay";

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

    const { nft, isGoldenAxe} = await getNft()

    const createdNFT = await createNFT({
        name: nft.name,
        description: '',
        pinataImageHash: nft.hash,
        pinataJsonHash: null,
        pinataFileName: nft.fileName,
        user,
        userId: user.id,
        tokenId: data.tokenId,
        chainId: chainFrom.id,
        chainIdToFirstBridge: (await prisma.chain.findFirst({
            where: { network: data.chainToNetwork }
        }))?.id!,
        transactionHash: data.transactionHash,
        isCustom: false
    }, isGoldenAxe);

    return Response.json(createdNFT);
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
    chainIdToFirstBridge: string;
    transactionHash: string;
    isCustom: boolean;
}

async function createNFT(data: CreateNFTDto, isGoldenAxe: boolean) {
    return prisma.$transaction(async (context) => {
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
                chainIdToFirstBridge: data.chainIdToFirstBridge,
                isCustom: data.isCustom
            }
        });

        if (isGoldenAxe) {
            await context.rareNft.update({
                where: { type: NftType.GoldenAxe },
                data: { mintTime: getRandomTimeForNextDay() }
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
                nftType: isGoldenAxe ? NftType.GoldenAxe : NftType.Common
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

async function getNft() {
    const goldenAxeOptions = await prisma.rareNft.findFirst({
        where: { type: NftType.GoldenAxe }
    });

    if (goldenAxeOptions) {
        const isReturnGoldenAxe = compareAsc(new Date(), new Date(goldenAxeOptions?.mintTime)) !== -1

        if (isReturnGoldenAxe) {
            return { nft: goldenAxeIpf, isGoldenAxe: true }
        }
    }

    return { nft: ipfs[Math.floor(Math.random() * ipfs.length)], isGoldenAxe: false } 
}