"use client";
import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import {
    ChartDataPoint,
    UsageFilter,
    UsageMetrics,
    UsageRecord,
    UsageTimeRange,
} from "@/features/usage/types/usage";
import { useNotification } from "@/contexts/NotificationContext";
import { ApiKey } from "@/features/api-keys/types/general";
import { useServices } from "@/contexts/ServicesProvider";
import { useAuth } from "@/features/auth/contexts/AuthContext";

interface UsageContextProps {
    metrics: UsageMetrics | null;
    handleFilterChange: (newFilter: UsageFilter) => void;
    apiKeys: ApiKey[];
    filteredUsageData: UsageRecord[];
    loadApiKeys: () => Promise<ApiKey[] | null>;
    activeFilter: UsageFilter;
    loadChartData: (filter: UsageFilter) => Promise<ChartDataPoint[] | undefined>;
}

const UsageContext = createContext<UsageContextProps | undefined>(undefined);

export const UsageProvider: FC<PropsWithChildren> = ({ children }) => {
    const {
        services: { apiKeyService, usageService },
    } = useServices();
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [filteredUsageData, setFilteredUsageData] = useState<UsageRecord[]>([]);

    const [activeFilter, setActiveFilter] = useState<UsageFilter>({
        timeRange: UsageTimeRange.LAST_7_DAYS,
        tokenId: "",
    });

    const loadUsageMetrics = async (filter: UsageFilter) => {
        try {
            if (!filter.tokenId) return;

            const usageMetrics = await usageService.getUsageMetrics(filter);

            setMetrics(usageMetrics);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to load usage metrics";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    const loadChartData = async (filter: UsageFilter) => {
        if (!filter.tokenId) return;
        try {
            const chartData = await usageService.getChartData(filter);

            return chartData;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to load chart data";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    const loadFilteredUsageData = async (filter: UsageFilter) => {
        try {
            if (!filter.tokenId) return;

            const filteredUsageData = await usageService.getFilteredUsageData(filter);
            setFilteredUsageData(filteredUsageData);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to load filtered usage data";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }
    };

    const loadApiKeys = async () => {
        try {
            const keys = await apiKeyService.getApiKeys(user?.id ?? "");
            setApiKeys(keys);
            return keys;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to load API keys";
            showNotification({
                message: errorMessage,
                type: "error",
                error,
            });
        }

        return null;
    };

    const handleFilterChange = (newFilter: UsageFilter) => {
        setActiveFilter(newFilter);
        loadUsageMetrics(newFilter);
        loadChartData(newFilter);
        loadFilteredUsageData(newFilter);
    };

    return (
        <UsageContext.Provider
            value={{
                handleFilterChange,
                metrics,
                apiKeys,
                filteredUsageData,
                loadApiKeys,
                activeFilter,
                loadChartData,
            }}
        >
            {children}
        </UsageContext.Provider>
    );
};

export const useUsage = () => {
    const context = useContext(UsageContext);

    if (context === undefined) {
        throw new Error("useUsage must be used within an UsageProvider");
    }

    return context;
};
