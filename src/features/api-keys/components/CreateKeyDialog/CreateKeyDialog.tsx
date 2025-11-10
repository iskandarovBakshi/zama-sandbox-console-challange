"use client";

import { FC } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

import styles from "./styles.module.css";
import { useApiKeys } from "@/features/api-keys/contexts/ApiKeysContext";
import { useFormik } from "formik";
import zod from "zod";
import { useNotification } from "@/contexts/NotificationContext";
import { toFormikValidationSchema } from "zod-formik-adapter";

const schema = zod.object({
    name: zod
        .string("name required")
        .min(6, "API Key name must be at least 6 characters"),
});

export const CreateKeyDialog: FC = () => {
    const { createDialogOpen, setCreateDialogOpen, handleCreateKey } = useApiKeys();

    const { showNotification } = useNotification();

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: toFormikValidationSchema(schema),
        onSubmit(values) {
            try {
                handleCreateKey(values);
            } catch (error) {
                showNotification({
                    type: "error",
                    message: "Failed to create API key. Please try again.",
                    error,
                });
            }
        },
    });

    const handleDialogClose = () => setCreateDialogOpen(false);

    return (
        <Dialog
            onTransitionExited={() => {
                formik.resetForm();
            }}
            open={createDialogOpen}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Create New API Key</Typography>
                    <IconButton onClick={handleDialogClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent className={styles.dialogContent}>
                <Box className={styles.warningBox}>
                    <WarningIcon className={styles.warningIcon} />
                    <Typography className={styles.warningText}>
                        <strong>Important:</strong> Store API Keys securely and never
                        share them publicly.
                    </Typography>
                </Box>
                <form id={"api-key-creation-form"} onSubmit={formik.handleSubmit}>
                    <label className={styles.formLabel} htmlFor="api-key-name">
                        API Key Name *
                    </label>
                    <TextField
                        fullWidth
                        placeholder="e.g., Production API Key, Testing Key"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={!!formik.errors.name}
                        helperText={formik.errors.name}
                        name={"name"}
                        id="api-key-name"
                        className={styles.textField}
                        autoFocus
                        slotProps={{
                            htmlInput: {
                                "data-testid": "api-key-name-input",
                            },
                        }}
                    />
                </form>
            </DialogContent>

            <DialogActions className={styles.dialogActions}>
                <Button onClick={handleDialogClose} disabled={formik.isSubmitting}>
                    Cancel
                </Button>
                <Button
                    form={"api-key-creation-form"}
                    type={"submit"}
                    variant="contained"
                    disabled={!formik.isValid}
                    data-testid="create-api-key-form-submit"
                >
                    {formik.isSubmitting ? "Creating..." : "Create API Key"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
