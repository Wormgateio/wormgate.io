import { CreateCustomMintDto, CreateMintDto, MintDto } from "../common/dto/MintDto";
import { apiClient } from "../utils/api";
import { AccountDto } from "../common/dto/AccountDto";
import { NFTDto } from "../common/dto/NFTDto";
import { BridgeDto } from "../common/dto/BridgeDto";
import { ChainDto } from "../common/dto/ChainDto";
import { CreateTweetDto } from "../common/dto/CreateTweetDto";
import { LeaderDto } from "../common/dto/LeaderDto";
import { RandomImageDto } from "../common/dto/RandomImageDto";
import { OperationHistoryDto } from "../common/dto/OperationHistoryDto";
import { CreateRefuelDto } from "../common/dto/RefuelDto";
import { BridgeType } from "../common/enums/BridgeType";
import { HyperlaneTransactionInfo } from "../common/dto/HyperlaneTransactionInfo";
import axios from "axios";
import { HYPERLANE_BASE_URL } from "@utils/hyperlaneUrl";

class ApiService {
    async getAccount(): Promise<AccountDto> {
        const response = await apiClient.get('account');
        return response.data;
    }

    async getNft(id: string): Promise<NFTDto> {
        const response = await apiClient.get<NFTDto>('nft', { params: { id } });
        return response.data;
    }

    createRefuel(data: CreateRefuelDto) {
        return apiClient.post('refuel', data);
    }

    async createMint(data: CreateMintDto): Promise<MintDto[]> {
        const response = await apiClient.post('mint', data);
        return response.data;
    }

    async bridgeNFT(data: BridgeDto) {
        await apiClient.post('bridge', data);
    }

    async getCollection() {
        const response = await apiClient.get<NFTDto[]>('collection');
        return response.data;
    }

    async getChains(bridgeType: BridgeType) {
        const response = await apiClient.get<ChainDto[]>('chains',  { params: { bridgeType } });
        return response.data;
    }

    async disconnectTwitter() {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/disconnect');
        return response.data;
    }

    async createTweet(data: CreateTweetDto) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/create-tweet', data);
        return response.data;
    }

    async createIntentTweet(data: CreateTweetDto) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/create-intent-tweet', data);
        return response.data;
    }

    async clearTwitter(userId: string) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/clear', { userId });
        return response.data;
    }

    async followTwitter(userId: string) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('twitter/follow', { userId });
        return response.data;
    }

    async getLeaders() {
        const response = await apiClient.get<LeaderDto[]>('leaders');
        return response.data;
    }

    async getCurrentUserStat() {
        const response = await apiClient.get<LeaderDto>('leaders/current');
        return response.data;
    }

    async getRandomImage() {
        const response = await apiClient.get<RandomImageDto>('cloud/random-image');
        return response.data;
    }

    async deleteFileFromCloud(key: string) {
        const response = await apiClient.post<{ status: 'ok' | 'failed' }>('cloud/delete', { key });
        return response.data;
    }

    async getNftHistory(nftId: string, currentNetwork: string, bridgeType: BridgeType) {
        const response = await apiClient.get<OperationHistoryDto[]>('history', { params: { nftId, currentNetwork, bridgeType } });
        return response.data;
    }

    async getGoldenAxeReward() {
        const response = await apiClient.get('golden-axe-reward');
        return response.data;
    }

    async getHyperlaneTransactionInfo(hash: string) {
         try {
            const response = await axios<HyperlaneTransactionInfo>(
                HYPERLANE_BASE_URL,
                { 
                    params: { 
                        module: 'message', 
                        action: 'get-messages',
                        'origin-tx-hash': hash
                    } 
                }
            );
            return response.data.result;
        } catch {
            return null
        }
    }
}

export default new ApiService();