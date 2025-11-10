export enum UsageTimeRange {
    LAST_7_DAYS = "7d",
    LAST_30_DAYS = "30d",
    LAST_90_DAYS = "90d",
}

export interface UsageRecord {
    id: string;
    date: string;
    apiKeyId: string;
    apiKeyName: string;
    totalRequests: number;
    successRequests: number;
    errorRequests: number;
    avgResponseTime: number;
}

export interface UsageRecordStore {
    [key: string]: UsageRecord[];
}

export interface UsageMetrics {
    totalRequests: number;
    successRate: number;
    errorRate: number;
    avgResponseTime: number;
}

export interface UsageFilter {
    timeRange: UsageTimeRange;
    tokenId: string;
}

export interface ChartDataPoint {
    date: string;
    requests: number;
    errors: number;
    successRate: number;
}
