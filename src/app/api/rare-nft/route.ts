import Joi from "joi";
import { OAuth2UserOptions } from "twitter-api-sdk/dist/OAuth2User";
import prisma from "../../../utils/prismaClient";

import { BadRequest } from "../utils/responses";
import { AccountDto } from "../../../common/dto/AccountDto";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { TwitterUser } from "../../../common/types";
import { NftType } from "../../../common/enums/NftType";
import { getRandomTimeForNextDay } from "@utils/getRandomTimeForNextDay";

interface CreateAccountDto {
    metamaskAddress: string;
}

const schema = Joi.object({
    metamaskAddress: Joi.string()
});

export async function GET(request: Request) {
    const rareNft = await prisma.rareNft.findMany(
        {
            where: { type: NftType.GoldenAxe }
        }
    );

    return Response.json(rareNft);
}

/**
 * Создание нового пользователя после привязки кошелька MetaMask
 */
export async function POST(request: Request) {
    const rareNft = await prisma.rareNft.update({
        where: {
            type: NftType.GoldenAxe
        },
        data: { 
            type: NftType.GoldenAxe,
            mintTime: getRandomTimeForNextDay()
        }
    });

    return Response.json(rareNft);
}