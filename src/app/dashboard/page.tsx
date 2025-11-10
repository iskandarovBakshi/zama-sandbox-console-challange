import { DashboardContainer } from "@/features/dashboard/components/DashboardContainer/DashboardContainer";
import { ApiKeysProvider } from "@/features/api-keys/contexts/ApiKeysContext";
import { UsageProvider } from "@/features/usage/contexts/UsageContext";

export default function DashboardPage() {
    return (
        <ApiKeysProvider>
            <UsageProvider>
                <DashboardContainer />
            </UsageProvider>
        </ApiKeysProvider>
    );
}
