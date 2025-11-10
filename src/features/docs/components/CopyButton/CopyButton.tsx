"use client";

import { useState, FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "./styles.module.css";
import { useNotification } from "@/contexts/NotificationContext";

interface CopyButtonProps {
    text: string;
}

const CopyButton: FC<CopyButtonProps> = ({ text }) => {
    const { showNotification } = useNotification();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            showNotification({
                error,
                type: "error",
                message: "Failed to copy",
            });
        }
    };

    return (
        <Tooltip title={copied ? "Copied!" : "Copy"}>
            <IconButton
                onClick={handleCopy}
                className={styles.copyButton}
                aria-label="Copy code"
                size="small"
            >
                <ContentCopyIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default CopyButton;
