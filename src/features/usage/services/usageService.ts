import {
    UsageFilter,
    UsageRecord,
    UsageMetrics,
    ChartDataPoint,
    UsageRecordStore,
} from "@/features/usage/types/usage";
import { ApiKey } from "@/features/api-keys/types/general";
import { generateUsageData } from "@/features/usage/utils/generateDataForApiKey";
import { usageFormatters } from "@/features/usage/utils/usageFormatters";

const STORAGE_KEY_CHART_DATA = "sandbox_chart_data";
export class UsageService {
    public async setUsageData(apiKey: ApiKey): Promise<void> {
        try {
            const currentChartData = JSON.parse(
                localStorage.getItem(STORAGE_KEY_CHART_DATA) ?? "{}",
            );
            localStorage.setItem(
                STORAGE_KEY_CHART_DATA,
                JSON.stringify({
                    ...currentChartData,
                    [apiKey.id]: generateUsageData(apiKey),
                }),
            );
        } catch {
            throw new Error("Failed to save API keys");
        }
    }

    public async deleteUsageDataByKey(keyId: string): Promise<void> {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY_CHART_DATA) ?? "{}",
        ) as UsageRecordStore;
        delete data[keyId];

        localStorage.setItem(STORAGE_KEY_CHART_DATA, JSON.stringify(data));
    }

    public async getUsageDataById(id: string): Promise<UsageRecord[]> {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_CHART_DATA) ?? "{}")?.[
            id
        ] as UsageRecord[];
    }

    public async getFilteredUsageData(filter: UsageFilter): Promise<UsageRecord[]> {
        const usageData = await this.getUsageDataById(filter.tokenId);

        let filteredRecords = [...(usageData ?? [])];

        const dateRange = usageFormatters.getDateRangeForTimeRange(filter.timeRange);

        filteredRecords = filteredRecords.filter((record) => {
            const recordDate = new Date(record.date);

            return recordDate >= dateRange.start && recordDate <= dateRange.end;
        });

        return filteredRecords.toSorted(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }

    public async getUsageMetrics(filter: UsageFilter): Promise<UsageMetrics> {
        const filteredRecords = await this.getFilteredUsageData(filter);

        if (filteredRecords.length === 0) {
            return {
                totalRequests: 0,
                successRate: 0,
                errorRate: 0,
                avgResponseTime: 0,
            };
        }

        const totalRequests = filteredRecords.reduce(
            (sum, record) => sum + record.totalRequests,
            0,
        );
        const totalSuccessRequests = filteredRecords.reduce(
            (sum, record) => sum + record.successRequests,
            0,
        );
        const totalErrorRequests = filteredRecords.reduce(
            (sum, record) => sum + record.errorRequests,
            0,
        );
        const totalResponseTime = filteredRecords.reduce(
            (sum, record) => sum + record.avgResponseTime,
            0,
        );

        const successRate =
            totalRequests > 0 ? (totalSuccessRequests / totalRequests) * 100 : 0;
        const errorRate =
            totalRequests > 0 ? (totalErrorRequests / totalRequests) * 100 : 0;
        const avgResponseTime =
            filteredRecords.length > 0 ? totalResponseTime / filteredRecords.length : 0;

        return {
            totalRequests,
            successRate: Math.round(successRate * 100) / 100,
            errorRate: Math.round(errorRate * 100) / 100,
            avgResponseTime: Math.round(avgResponseTime),
        };
    }

    public async getChartData(filter: UsageFilter): Promise<ChartDataPoint[]> {
        const filteredRecords = await this.getFilteredUsageData(filter);

        const groupedByDate = filteredRecords.reduce(
            (acc, record) => {
                if (!acc[record.date]) {
                    acc[record.date] = {
                        totalRequests: 0,
                        errorRequests: 0,
                        successRequests: 0,
                    };
                }
                acc[record.date].totalRequests += record.totalRequests;
                acc[record.date].errorRequests += record.errorRequests;
                acc[record.date].successRequests += record.successRequests;
                return acc;
            },
            {} as Record<
                string,
                { totalRequests: number; errorRequests: number; successRequests: number }
            >,
        );

        return Object.entries(groupedByDate)
            .map(([date, data]) => ({
                date: usageFormatters.formatDateForChart(date),
                requests: data.totalRequests,
                errors: data.errorRequests,
                successRate:
                    data.totalRequests > 0
                        ? Math.round(
                              (data.successRequests / data.totalRequests) * 10000,
                          ) / 100
                        : 0,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
}
