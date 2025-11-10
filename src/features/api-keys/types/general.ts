export enum ApiKeyStatus {
    ACTIVE = "active",
    REVOKED = "revoked",
}

export const StatusColors = {
    active: "success",
    revoked: "error",
} as const;

export interface ApiKey {
    id: string;
    name: string;
    description?: string;
    key: string;
    status: ApiKeyStatus;
    userId: string;
}

export interface CreateApiKeyRequest {
    name: string;
}

export interface ApiKeyDisplayOptions {
    showFullKey?: boolean;
    maskedKeyLength?: number;
}
