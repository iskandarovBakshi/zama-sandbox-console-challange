import { UsageTimeRange } from "@/features/usage/types/usage";

export const usageFormatters = {
    getDateRangeForTimeRange(timeRange: UsageTimeRange): {
        start: Date;
        end: Date;
    } {
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const start = new Date();
        switch (timeRange) {
            case UsageTimeRange.LAST_7_DAYS:
                start.setDate(start.getDate() - 7);
                break;
            case UsageTimeRange.LAST_30_DAYS:
                start.setDate(start.getDate() - 30);
                break;
            case UsageTimeRange.LAST_90_DAYS:
                start.setDate(start.getDate() - 90);
                break;
            default:
                start.setDate(start.getDate() - 7);
                break;
        }
        start.setHours(0, 0, 0, 0);

        return { start, end };
    },
    formatDateForChart(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    },
};
