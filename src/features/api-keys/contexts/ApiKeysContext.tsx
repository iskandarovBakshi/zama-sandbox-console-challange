"use client";
import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { ApiKey, CreateApiKeyRequest } from "@/features/api-keys/types/general";
import { useNotification } from "@/contexts/NotificationContext";
import { useServices } from "@/contexts/ServicesProvider";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { STORAGE_KEY } from "../services/apiKeyService";

interface ApiKeysContextProps {
    createDialogOpen: boolean;
    setCreateDialogOpen: (value: boolean) => void;
    loading: boolean;
    apiKeys: ApiKey[];
    showApiKeyOf: string;
    handleRevokeKey: (keyId: string) => void;
    handleRegenerateKey: (keyId: string) => void;
    handleDeleteKey: (keyId: string) => void;
    handleCreateKey: (apikey: CreateApiKeyRequest) => void;
}

const ApiKeysContext = createContext<ApiKeysContextProps | undefined>(undefined);

export const ApiKeysProvider: FC<PropsWithChildren> = ({ children }) => {
    const {
        services: { apiKeyService, usageService },
    } = useServices();
    const { user } = useAuth();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [showApiKeyOf, setShowApiKeyOf] = useState("");
    const { showNotification } = useNotification();

    const loadApiKeys = async () => {
        try {
            setLoading(true);

            const keys = await apiKeyService.getApiKeys(user?.id ?? "");
            setApiKeys(keys);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to load API keys";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
        setLoading(false);
    };

    const handleCreateKey = async (apiKey: CreateApiKeyRequest) => {
        try {
            const newApiKey = await apiKeyService.createApiKey(apiKey, user?.id ?? "");
            await usageService.setUsageData(newApiKey);

            await loadApiKeys();
            showNotification({
                message: "API key created successfully!",
                type: "success",
            });
            setCreateDialogOpen(false);
            setShowApiKeyOf(newApiKey.id);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to create API key";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        try {
            await apiKeyService.revokeApiKey(keyId, user?.id ?? "");
            await loadApiKeys();
            showNotification({
                message: "API key revoked successfully!",
                type: "success",
            });
            setShowApiKeyOf("");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to revoke API key";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    const handleRegenerateKey = async (oldKeyId: string) => {
        try {
            const oldKey = await apiKeyService.getApiKeyById(oldKeyId, user?.id ?? "");
            if (!oldKey) {
                throw new Error("API key not found");
            }

            const newKey = await apiKeyService.regenerateApiKey(oldKey, user?.id ?? "");
            await loadApiKeys();
            showNotification({
                message: "API key regenerated successfully!",
                type: "success",
            });
            setShowApiKeyOf(newKey.id);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to regenerate API key";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    const handleDeleteKey = async (keyId: string) => {
        try {
            await apiKeyService.deleteApiKey(keyId, user?.id ?? "");

            await usageService.deleteUsageDataByKey(keyId);
            await loadApiKeys();
            showNotification({
                message: "API key deleted successfully!",
                type: "success",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to delete API key";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    useEffect(() => {
        loadApiKeys();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                loadApiKeys();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <ApiKeysContext.Provider
            value={{
                showApiKeyOf,
                apiKeys,
                handleRevokeKey,
                handleRegenerateKey,
                handleDeleteKey,
                setCreateDialogOpen,
                loading,
                createDialogOpen,
                handleCreateKey,
            }}
        >
            {children}
        </ApiKeysContext.Provider>
    );
};
export function useApiKeys() {
    const context = useContext(ApiKeysContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
