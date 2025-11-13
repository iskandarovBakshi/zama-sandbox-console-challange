"use client";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Skeleton,
    Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FC, useState, MouseEvent } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export const HeaderUserProfile: FC = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Box className={styles.userProfile}>
            {user ? (
                <>
                    <Typography
                        data-testid={"username"}
                        variant="body2"
                        className={clsx(styles.userName, styles.ellipsis)}
                        title={user.name}
                    >
                        {user.name}
                    </Typography>
                    <IconButton
                        onClick={handleMenuOpen}
                        size="small"
                        className={styles.avatarButton}
                    >
                        <Avatar
                            src={user.picture}
                            alt={user.name}
                            className={styles.avatar}
                        >
                            <AccountCircleIcon />
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        slotProps={{
                            paper: {
                                elevation: 3,
                                className: styles.menuPaper,
                            },
                        }}
                        transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                        }}
                        anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                        }}
                    >
                        <Box className={styles.menuUserContent}>
                            <Typography variant="subtitle2" className={styles.ellipsis}>
                                {user.name}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon className={styles.logoutIcon} />
                            Logout
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Skeleton width={"100px"} />
            )}
        </Box>
    );
};
