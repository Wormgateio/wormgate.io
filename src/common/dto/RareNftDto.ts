import { RareNftName } from "../enums/RareNftName";

export interface RareNftDto {
    id: string,
    name: RareNftName,
    mintTime: string
}