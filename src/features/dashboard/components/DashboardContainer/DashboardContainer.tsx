"use client";
import { FC } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useApiKeys } from "@/features/api-keys/contexts/ApiKeysContext";
import { UsageChart } from "@/features/usage/components/UsageChart/UsageChart";

export const DashboardContainer: FC = () => {
    const { apiKeys } = useApiKeys();

    if (apiKeys.length === 0) {
        return (
            <div>
                You have no keys yet
                <Button href={"/dashboard/api-keys"}>Create an API Key</Button>
            </div>
        );
    }

    return (
        <Stack direction={"row"} flexWrap={"wrap"} gap={2} sx={{ pt: 8 }}>
            <Stack flex={1} flexBasis={"100%"} sx={{ mb: 8 }}>
                <Typography variant={"h4"} fontWeight={600}>
                    Recent activity for top keys
                </Typography>
            </Stack>
            {apiKeys.slice(0, 2).map((ak) => (
                <Stack key={ak.id} flex={1}>
                    <UsageChart apiKey={ak} />
                </Stack>
            ))}
        </Stack>
    );
};
