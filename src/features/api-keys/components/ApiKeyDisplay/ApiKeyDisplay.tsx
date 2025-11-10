"use client";

import { useState } from "react";
import { FC } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { ApiKey, ApiKeyStatus } from "@/features/api-keys/types/general";
import { apiKeyFormatter } from "@/features/api-keys/utils/formatting";
import styles from "./styles.module.css";
import { Tooltip } from "@mui/material";
import clsx from "clsx";
import { useApiKeys } from "@/features/api-keys/contexts/ApiKeysContext";
import { useNotification } from "@/contexts/NotificationContext";

interface ApiKeyDisplayProps {
    apiKey: ApiKey;
    onCopy?: (key: string, success: boolean) => void;
    className?: string;
}

export const ApiKeyDisplay: FC<ApiKeyDisplayProps> = ({ apiKey, className = "" }) => {
    const { showApiKeyOf } = useApiKeys();
    const { showNotification } = useNotification();
    const [copySuccess, setCopySuccess] = useState(false);
    const handleCopyKey = async () => {
        try {
            await navigator.clipboard.writeText(apiKey.key);
            setCopySuccess(true);

            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        } catch (error) {
            showNotification({
                message: "Failed to copy API key",
                type: "error",
                error,
            });
        }
    };

    const isRevoked = apiKey.status === ApiKeyStatus.REVOKED;

    const displayKey = apiKeyFormatter.maskApiKey(apiKey.key, {
        showFullKey: showApiKeyOf === apiKey.id,
    });

    const statusInfo = apiKeyFormatter.getStatusInfo(apiKey.status);

    return (
        <Box className={clsx(className, styles.display)}>
            <Box className={styles.key} component="code">
                {displayKey}
            </Box>

            <Tooltip title={copySuccess ? "Copied!" : "Copy API key"}>
                {/* issue: https://github.com/mui/material-ui/issues/ */}
                <span>
                    <Button
                        onClick={handleCopyKey}
                        className={clsx(styles.copyButton, {
                            [styles.copied]: copySuccess,
                        })}
                        variant="outlined"
                        size="small"
                        startIcon={<CopyIcon />}
                        disabled={isRevoked}
                    >
                        {copySuccess ? "Copied" : "Copy"}
                    </Button>
                </span>
            </Tooltip>

            <Box
                className={styles.status}
                style={{
                    color: statusInfo.color,
                    backgroundColor: statusInfo.backgroundColor,
                }}
            >
                <Box
                    className={styles.statusDot}
                    style={{
                        backgroundColor: statusInfo.color,
                    }}
                />
                {statusInfo.label}
            </Box>
        </Box>
    );
};
