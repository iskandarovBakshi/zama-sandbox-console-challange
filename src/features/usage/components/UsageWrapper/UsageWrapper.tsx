"use client";
import { FC, useEffect } from "react";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { UsageFilters } from "@/features/usage/components/UsageFilters/UsageFilters";
import { UsageChart } from "@/features/usage/components/UsageChart/UsageChart";
import { UsageTable } from "@/features/usage/components/UsageTable/UsageTable";
import styles from "./styles.module.css";
import { useUsage } from "@/features/usage/contexts/UsageContext";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { UsageTimeRange } from "@/features/usage/types/usage";

export const UsageWrapper: FC = () => {
    const { isAdvancedModeEnabled } = useFeatureFlag();
    const { metrics, loadApiKeys, handleFilterChange } = useUsage();

    useEffect(() => {
        loadApiKeys().then((keys) => {
            if (keys && keys.length > 0) {
                handleFilterChange({
                    timeRange: UsageTimeRange.LAST_7_DAYS,
                    tokenId: keys[0].id,
                });
            }
        });
    }, []);

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.pageHeader}>
                <Typography className={styles.pageTitle} variant="h4">
                    Usage Analytics
                </Typography>
            </Box>

            <UsageFilters />

            {metrics && (
                <Grid container spacing={3} className={styles.metricsGrid}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card className={styles.metricCard}>
                            <CardContent className={styles.metricCardContent}>
                                <Box className={styles.metricHeader}>
                                    <Typography
                                        className={styles.metricLabel}
                                        variant="body2"
                                    >
                                        Total Requests
                                    </Typography>
                                    <TrendingUpIcon className={styles.metricIcon} />
                                </Box>
                                <Typography className={styles.metricValue} variant="h4">
                                    {metrics.totalRequests.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card className={styles.metricCard}>
                            <CardContent className={styles.metricCardContent}>
                                <Box className={styles.metricHeader}>
                                    <Typography
                                        className={styles.metricLabel}
                                        variant="body2"
                                    >
                                        Success Rate
                                    </Typography>
                                    <TrendingUpIcon className={styles.metricIcon} />
                                </Box>
                                <Typography className={styles.metricValue} variant="h4">
                                    {metrics.successRate.toFixed(1)}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card className={styles.metricCard}>
                            <CardContent className={styles.metricCardContent}>
                                <Box className={styles.metricHeader}>
                                    <Typography
                                        className={styles.metricLabel}
                                        variant="body2"
                                    >
                                        Avg Response Time
                                    </Typography>
                                    <TrendingUpIcon className={styles.metricIcon} />
                                </Box>
                                <Typography className={styles.metricValue} variant="h4">
                                    {metrics.avgResponseTime}ms
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {isAdvancedModeEnabled && (
                        <>
                            <Grid
                                data-testid={"feature-toggle-advanced-feature-card-0"}
                                size={{ xs: 12, sm: 6, md: 3 }}
                            >
                                <Card className={styles.metricCard}>
                                    <CardContent className={styles.metricCardContent}>
                                        <Box className={styles.metricHeader}>
                                            <Typography
                                                className={styles.metricLabel}
                                                variant="body2"
                                            >
                                                Error Rate
                                            </Typography>
                                            <TrendingUpIcon
                                                className={styles.metricIcon}
                                            />
                                        </Box>
                                        <Typography
                                            className={styles.metricValue}
                                            variant="h4"
                                        >
                                            {(100 - metrics.successRate).toFixed(1)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid
                                data-testid={"feature-toggle-advanced-feature-card-1"}
                                size={{ xs: 12, sm: 6, md: 3 }}
                            >
                                <Card className={styles.metricCard}>
                                    <CardContent className={styles.metricCardContent}>
                                        <Box className={styles.metricHeader}>
                                            <Typography
                                                className={styles.metricLabel}
                                                variant="body2"
                                            >
                                                P95 Response Time
                                            </Typography>
                                            <TrendingUpIcon
                                                className={styles.metricIcon}
                                            />
                                        </Box>
                                        <Typography
                                            className={styles.metricValue}
                                            variant="h4"
                                        >
                                            {/* WARNING: calculation is not correct*/}
                                            {Math.round(metrics.avgResponseTime * 1.8)}ms
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    )}
                </Grid>
            )}

            <Box className={styles.chartsSection}>
                <UsageChart />
            </Box>

            <Box className={styles.tableSection}>
                <UsageTable />
            </Box>
        </Container>
    );
};
