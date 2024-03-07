import { NftType } from "../enums/NftType";

export interface RareNftDto {
    id: string,
    name: NftType,
    mintTimes: string[],
    perDay: number,
    reward: number
}