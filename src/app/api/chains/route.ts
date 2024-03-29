import { NextRequest } from "next/server";
import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
import { BridgeType } from "@prisma/client";

export async function GET(request: NextRequest) {
    const bridge = request.nextUrl.searchParams.get('bridgeType') as BridgeType | null;

    if (!bridge) {
        return new BadRequest('bridge is required for chains');
    }

    const chains = await prisma.chain.findMany();

    const visibleChains = chains.filter((chain) => chain.availableBridgeTypes.includes(bridge))

    return Response.json(visibleChains, {
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });
}