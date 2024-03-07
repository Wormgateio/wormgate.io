import { NftType } from "../enums/NftType";

export interface RareNftDto {
    id: string,
    name: NftType,
    mintTime: string
}