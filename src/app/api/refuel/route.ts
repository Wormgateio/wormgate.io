import { NextRequest } from "next/server";
import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
import { CreateRefuelDto } from "../../../common/dto/RefuelDto";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";

export async function POST(request: NextRequest) {
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

    const data: CreateRefuelDto = await request.json();

    await prisma.$transaction(async (context) => {
        await context.refuelLog.create({
            data: {
                balanceLog: {
                    create: {
                        userId: user.id,
                        operation: BalanceOperation.Debit,
                        description: 'Начисление за Refuel',
                        type: BalanceLogType.Refuel,
                        amount: 0
                    }
                },
                transactionHash: data.transactionHash
            }
        });
    });

    return Response.json({});
}