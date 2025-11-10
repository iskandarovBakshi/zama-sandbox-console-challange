import { FC } from "react";
import { UsageWrapper } from "@/features/usage/components/UsageWrapper/UsageWrapper";
import { UsageProvider } from "@/features/usage/contexts/UsageContext";

export const UsageContainer: FC = () => {
    return (
        <UsageProvider>
            <UsageWrapper />
        </UsageProvider>
    );
};
