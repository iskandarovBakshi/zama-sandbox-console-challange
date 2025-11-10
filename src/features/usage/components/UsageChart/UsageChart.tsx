"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, Grid, Paper, Typography, Chip } from "@mui/material";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import styles from "./styles.module.css";
import { useUsage } from "@/features/usage/contexts/UsageContext";
import { ChartDataPoint } from "@/features/usage/types/usage";
import { ApiKey, StatusColors } from "@/features/api-keys/types/general";

interface TooltipData {
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipData[];
    label?: string;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Paper className={styles.customTooltip}>
                <Typography variant="body2" className={styles.tooltipTitle}>
                    {label}
                </Typography>
                {payload.map((entry: TooltipData, index: number) => (
                    <Typography
                        key={index}
                        variant="body2"
                        className={styles.tooltipContent}
                    >
                        {`${entry.name}: ${entry.value.toLocaleString()}`}
                    </Typography>
                ))}
            </Paper>
        );
    }
    return null;
};

export const UsageChart: FC<{ apiKey?: ApiKey }> = ({ apiKey }) => {
    const { activeFilter, loadChartData } = useUsage();
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        const ti = apiKey ? apiKey.id : activeFilter.tokenId;
        loadChartData({
            ...activeFilter,
            tokenId: ti,
        }).then((res) => {
            if (res) {
                setChartData(res);
            }
        });
    }, [activeFilter]);

    return (
        <Grid
            data-testid={chartData.length === 0 ? "chart-data-empty-state" : undefined}
            container
            spacing={3}
        >
            <Grid size={12}>
                <Card className={styles.chartCard}>
                    <CardContent className={styles.cardContent}>
                        <Typography className={styles.chartTitle} variant="h6">
                            {apiKey ? (
                                <>
                                    key: {apiKey.name}{" "}
                                    <Chip
                                        size={"small"}
                                        color={StatusColors[apiKey.status]}
                                        label={apiKey.status}
                                    />
                                </>
                            ) : (
                                "Requests Over Time"
                            )}
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="requests"
                                    stroke="var(--mui-palette-primary-main)"
                                    strokeWidth={2}
                                    dot={{ fill: "var(--mui-palette-primary-main)" }}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="errors"
                                    stroke="var(--mui-palette-error-main)"
                                    strokeWidth={2}
                                    dot={{ fill: "var(--mui-palette-error-main)" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
