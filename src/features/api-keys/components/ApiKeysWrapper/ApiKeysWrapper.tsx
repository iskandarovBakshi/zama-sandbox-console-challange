"use client";
import { FC } from "react";
import { useApiKeys } from "@/features/api-keys/contexts/ApiKeysContext";
import { Box, Button, Typography } from "@mui/material";
import styles from "@/features/api-keys/components/ApiKeysContainer/styles.module.css";
import AddIcon from "@mui/icons-material/Add";
import { ApiKeyStack } from "@/features/api-keys/components/ApiKeyStack/ApiKeyStack";
import { CreateKeyDialog } from "@/features/api-keys/components/CreateKeyDialog/CreateKeyDialog";

export const ApiKeysWrapper: FC = () => {
    const { setCreateDialogOpen } = useApiKeys();

    return (
        <>
            <Box className={styles.container}>
                <Box className={styles.header}>
                    <Box className={styles.titleSection}>
                        <Typography className={styles.title} variant="h4">
                            API Keys
                        </Typography>
                        <Typography className={styles.subtitle} variant="body1">
                            Create, revoke, and regenerate pretend API keys.
                        </Typography>
                    </Box>
                    <Box className={styles.actionsSection}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateDialogOpen(true)}
                            className={styles.createButton}
                            data-testid="create-api-key"
                        >
                            Create API Key
                        </Button>
                    </Box>
                </Box>

                <Box className={styles.tableSection}>
                    <ApiKeyStack />
                </Box>

                <CreateKeyDialog />
            </Box>
        </>
    );
};
