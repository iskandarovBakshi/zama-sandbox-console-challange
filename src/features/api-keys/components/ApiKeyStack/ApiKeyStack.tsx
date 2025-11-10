"use client";

import { FC } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Collapse,
    CircularProgress,
} from "@mui/material";
import { VpnKey as KeyIcon } from "@mui/icons-material";
import { ApiKeyDisplay } from "@/features/api-keys/components/ApiKeyDisplay/ApiKeyDisplay";
import { ApiKeyActions } from "@/features/api-keys/components/ApiKeyActions/ApiKeyActions";
import styles from "./styles.module.css";
import { useApiKeys } from "@/features/api-keys/contexts/ApiKeysContext";
import { TransitionGroup } from "react-transition-group";

export const ApiKeyStack: FC = () => {
    const { loading, apiKeys, handleRevokeKey, handleRegenerateKey, handleDeleteKey } =
        useApiKeys();

    if (!apiKeys?.length && !loading) {
        return (
            <Box className={styles.emptyState}>
                <KeyIcon className={styles.emptyStateIcon} />
                <Typography className={styles.emptyStateTitle} variant="h6">
                    No API keys yet
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {loading && (
                <Box className={styles.loadingContainer}>
                    <CircularProgress />
                </Box>
            )}
            <TransitionGroup component={Stack} gap={2}>
                {apiKeys.map((apiKey) => (
                    <Collapse in key={apiKey.id}>
                        <Box data-testid="api-key-item">
                            <Card className={styles.apiKeyCard}>
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        p: 3,
                                    }}
                                >
                                    <Box className={styles.cardHeader}>
                                        <Typography
                                            variant="h6"
                                            className={styles.cardTitle}
                                        >
                                            {apiKey.name}
                                        </Typography>
                                        <ApiKeyActions
                                            apiKey={apiKey}
                                            onRevoke={() => handleRevokeKey?.(apiKey.id)}
                                            onRegenerate={() =>
                                                handleRegenerateKey?.(apiKey.id)
                                            }
                                            onDelete={() => handleDeleteKey?.(apiKey.id)}
                                        />
                                    </Box>

                                    <Box className={styles.keySection}>
                                        <ApiKeyDisplay apiKey={apiKey} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Collapse>
                ))}
            </TransitionGroup>
        </>
    );
};
