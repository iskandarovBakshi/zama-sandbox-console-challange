"use client";

import { FC } from "react";
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import { UsageTimeRange } from "@/features/usage/types/usage";
import styles from "./styles.module.css";
import Link from "next/link";
import { useUsage } from "@/features/usage/contexts/UsageContext";
import { StatusColors } from "@/features/api-keys/types/general";

const TIME_RANGE_OPTIONS = [
    { value: UsageTimeRange.LAST_7_DAYS, label: "Last 7 days" },
    { value: UsageTimeRange.LAST_30_DAYS, label: "Last 30 days" },
    { value: UsageTimeRange.LAST_90_DAYS, label: "Last 90 days" },
];

export const UsageFilters: FC = () => {
    const { activeFilter, handleFilterChange, apiKeys } = useUsage();
    const handleTimeRangeChange = (timeRange: UsageTimeRange) => {
        handleFilterChange({ ...activeFilter, timeRange });
    };

    const handleTokenChange = (tokenId: string) => {
        handleFilterChange({
            ...activeFilter,
            tokenId: tokenId,
        });
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.filtersContainer}>
                <FormControl className={styles.formControl}>
                    <InputLabel id={"filter-token-label"}>Select Token</InputLabel>
                    <Select
                        value={activeFilter.tokenId}
                        label="Select Token"
                        labelId={"filter-token-label"}
                        id={"filter-token"}
                        onChange={(e) => {
                            handleTokenChange(e.target.value);
                        }}
                    >
                        {apiKeys.length === 0 && (
                            <MenuItem className={styles.createTokenLinkItem} value={""}>
                                <Link
                                    className={styles.createTokenLink}
                                    href={"/dashboard/api-keys"}
                                >
                                    Create token
                                </Link>
                            </MenuItem>
                        )}
                        {apiKeys.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                <Stack direction={"row"} gap={2}>
                                    <span className={styles.selectTokenName}>
                                        {option.name}{" "}
                                    </span>
                                    <Chip
                                        color={StatusColors[option.status]}
                                        size={"small"}
                                        label={option.status}
                                    />
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={styles.formControl}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={activeFilter.timeRange}
                        label="Time Range"
                        onChange={(e) =>
                            handleTimeRangeChange(e.target.value as UsageTimeRange)
                        }
                    >
                        {TIME_RANGE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};
