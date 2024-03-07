import prisma from "../../../utils/prismaClient";
import { NftType } from "../../../common/enums/NftType";

export async function GET() {
    const data = await prisma.rareNft.findFirst({
        where: { type: NftType.GoldenAxe },
        select: { reward: true }
    })

    return Response.json(data?.reward || 0);
}