import {
    ApiKey,
    ApiKeyStatus,
    CreateApiKeyRequest,
} from "@/features/api-keys/types/general";
import { faker } from "@faker-js/faker";

export const STORAGE_KEY = "sandbox_api_keys";

export class ApiKeyService {
    public async getStorageData(): Promise<ApiKey[]> {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }

        let data: ApiKey[] = JSON.parse(stored);
        data = data.map((key) => ({
            ...key,
        }));

        return data;
    }

    public async getApiKeys(userId: string): Promise<ApiKey[]> {
        const data = await this.getStorageData();

        return data.filter((key) => key.userId === userId);
    }

    public async setStorageData(data: ApiKey[]): Promise<void> {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
            throw new Error("Failed to save API keys");
        }
    }

    public async revokeApiKey(id: string, userId: string): Promise<void> {
        const data = await this.getApiKeys(userId);
        const keyIndex = data.findIndex((key) => key.id === id);

        if (keyIndex === -1) {
            throw new Error("API key not found");
        }

        if (data[keyIndex].userId !== userId) {
            throw new Error("Access denied");
        }

        data[keyIndex] = {
            ...data[keyIndex],
            id: data[keyIndex].id,
            status: ApiKeyStatus.REVOKED,
        };

        await this.setStorageData(data);
    }

    public async deleteApiKey(id: string, userId: string): Promise<void> {
        let data = await this.getApiKeys(userId);

        data = data.filter((key) => !(key.id === id && key.userId === userId));

        await this.setStorageData(data);
    }

    public async createApiKey(
        request: CreateApiKeyRequest,
        userId: string,
    ): Promise<ApiKey> {
        const data = await this.getStorageData();

        const key = faker.string.uuid();
        const id = faker.string.uuid();

        const newApiKey = {
            id,
            name: request.name.trim(),
            key,
            status: ApiKeyStatus.ACTIVE,
            userId: userId,
        };

        if (data.some((key) => key.id === newApiKey.id)) {
            throw new Error("API key with this ID already exists");
        }
        data.unshift(newApiKey);
        await this.setStorageData(data);

        return newApiKey;
    }

    public async regenerateApiKey(oldKey: ApiKey, userId: string): Promise<ApiKey> {
        const data = await this.getApiKeys(userId);
        const foundIndex = data.findIndex((key) => key.id === oldKey.id);

        if (foundIndex === -1) {
            throw new Error("API key not found");
        }

        if (data[foundIndex].userId !== userId) {
            throw new Error("Access denied");
        }

        const newKeyId = faker.string.uuid();

        data[foundIndex] = {
            ...oldKey,
            key: newKeyId,
            status: ApiKeyStatus.ACTIVE,
        };

        await this.setStorageData(data);

        return data[foundIndex];
    }

    public async getApiKeyById(id: string, userId: string): Promise<ApiKey | null> {
        const keys = await this.getApiKeys(userId);
        return keys.find((key) => key.id === id) || null;
    }
}
