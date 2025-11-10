import { faker } from "@faker-js/faker";
import { ApiKey } from "@/features/api-keys/types/general";
import { UsageRecord } from "@/features/usage/types/usage";

function generateUsageItem(id: number, apiKey: ApiKey): UsageRecord {
    const dateObject = new Date();
    dateObject.setDate(dateObject.getDate() - id);
    const date = dateObject.toISOString().split("T")[0];

    const totalRequests = faker.number.int({ min: 500, max: 5000 });

    // Pick a realistic success rate between 70% and 99%
    const successRatePercent = faker.number.int({ min: 70, max: 99 });
    const successRequests = Math.round((successRatePercent / 100) * totalRequests);
    const errorRequests = totalRequests - successRequests;

    return {
        id: `usage-${String(id).padStart(3, "0")}`,
        date,
        apiKeyId: apiKey.id,
        apiKeyName: apiKey.name,
        totalRequests,
        successRequests,
        errorRequests,
        avgResponseTime: faker.number.int({ min: 80, max: 600 }), // ms
    };
}

export function generateUsageData(apiKey: ApiKey) {
    return Array.from({ length: 90 }, (_, i) => generateUsageItem(i + 1, apiKey));
}
