"use client";

import { FC, MouseEvent, useState } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import RegenerateIcon from "@mui/icons-material/Refresh";
import RevokeIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import { ApiKey, ApiKeyStatus } from "@/features/api-keys/types/general";
import styles from "./styles.module.css";
import clsx from "clsx";

type ActionType = "revoke" | "regenerate" | "delete";

interface ApiKeyActionsProps {
    apiKey: ApiKey;
    onRevoke?: () => void;
    onRegenerate?: () => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const ApiKeyActions: FC<ApiKeyActionsProps> = ({
    apiKey,
    onRevoke,
    onRegenerate,
    onDelete,
    disabled = false,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        type: ActionType | null;
        open: boolean;
    }>({ type: null, open: false });

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        if (!disabled) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleActionClick = (type: ActionType) => {
        setAnchorEl(null);
        setConfirmDialog({ type, open: true });
    };

    const handleConfirmAction = () => {
        if (!confirmDialog.type) return;

        switch (confirmDialog.type) {
            case "revoke":
                onRevoke?.();
                break;
            case "regenerate":
                onRegenerate?.();
                break;
            case "delete":
                onDelete?.();
                break;
        }

        setConfirmDialog({ type: null, open: false });
    };

    const handleCancelAction = () => {
        setConfirmDialog({ type: null, open: false });
    };

    const getActionTooltip = () => {
        if (disabled) return "Actions disabled";
        return "Key actions";
    };

    const getConfirmDialogContent = () => {
        switch (confirmDialog.type) {
            case "revoke":
                return {
                    title: "Revoke API Key",
                    message: `Are you sure you want to revoke the API key "${apiKey.name}"?`,
                    warning:
                        "This action cannot be undone. Any applications using this key will immediately lose access.",
                    confirmText: "Revoke",
                    confirmColor: "warning" as const,
                };
            case "regenerate":
                return {
                    title: "Regenerate API Key",
                    message: `Are you sure you want to regenerate the API key "${apiKey.name}"?`,
                    warning:
                        "This will create a new key and revoke the current one. Any applications using the current key will need to be updated.",
                    confirmText: "Regenerate",
                    confirmColor: "primary" as const,
                };
            case "delete":
                return {
                    title: "Delete API Key",
                    message: `Are you sure you want to delete the API key "${apiKey.name}"?`,
                    warning:
                        "This action cannot be undone. The key will be permanently removed.",
                    confirmText: "Delete",
                    confirmColor: "error" as const,
                };
            default:
                return null;
        }
    };

    const menuOpen = Boolean(anchorEl);
    const confirmContent = getConfirmDialogContent();

    const isActionsExceptDeleteDisabled = apiKey.status === ApiKeyStatus.REVOKED;

    return (
        <>
            <Tooltip title={getActionTooltip()} arrow>
                <span>
                    <IconButton
                        onClick={handleMenuClick}
                        size="small"
                        disabled={disabled}
                        className={styles.actionButton}
                        data-testid="more-button"
                    >
                        <MoreIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                className={styles.dropdownMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem
                    onClick={() => handleActionClick("regenerate")}
                    className={clsx(styles.menuItem, styles.regenerate)}
                    disabled={isActionsExceptDeleteDisabled}
                    data-testid="regenerate-button"
                >
                    <ListItemIcon>
                        <RegenerateIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography className={styles.menuItemText}>Regenerate</Typography>
                </MenuItem>

                <MenuItem
                    onClick={() => handleActionClick("revoke")}
                    className={clsx(styles.menuItem, styles.revoke)}
                    disabled={isActionsExceptDeleteDisabled}
                    data-testid="revoke-button"
                >
                    <ListItemIcon>
                        <RevokeIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography className={styles.menuItemText}>Revoke</Typography>
                </MenuItem>

                <MenuItem
                    onClick={() => handleActionClick("delete")}
                    className={clsx(styles.menuItem, styles.delete)}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography className={styles.menuItemText}>Delete</Typography>
                </MenuItem>
            </Menu>

            <Dialog
                open={confirmDialog.open}
                onClose={handleCancelAction}
                maxWidth="sm"
                fullWidth
            >
                {confirmContent && (
                    <>
                        <DialogTitle>
                            <Box display="flex" alignItems="center" gap={1}>
                                <WarningIcon color={confirmContent.confirmColor} />
                                {confirmContent.title}
                            </Box>
                        </DialogTitle>

                        <DialogContent>
                            <Typography variant="body1" gutterBottom>
                                {confirmContent.message}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mt: 2 }}
                            >
                                <strong>{confirmContent.warning}</strong>
                            </Typography>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={handleCancelAction}>Cancel</Button>
                            <Button
                                onClick={handleConfirmAction}
                                variant="contained"
                                color={confirmContent.confirmColor}
                                data-testid="modal-submit-button"
                            >
                                {confirmContent.confirmText}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};
