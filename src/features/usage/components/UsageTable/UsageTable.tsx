"use client";

import { FC, useState, ChangeEvent } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Chip,
    Tooltip,
    TableCellProps,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import styles from "./styles.module.css";
import { useUsage } from "@/features/usage/contexts/UsageContext";

interface HeadCell {
    id: string;
    label: string;
    align: TableCellProps["align"];
}

const headCells: HeadCell[] = [
    {
        id: "date",
        label: "Date",
        align: "left",
    },
    {
        id: "totalRequests",
        label: "Requests",
        align: "right",
    },
    {
        id: "successRate",
        label: "Success Rate",
        align: "center",
    },
    {
        id: "avgResponseTime",
        label: "Avg Response Time",
        align: "right",
    },
];

export const UsageTable: FC = () => {
    const { filteredUsageData } = useUsage();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const enhancedUsageData = filteredUsageData.map((record) => ({
        ...record,
        successRate:
            record.totalRequests > 0
                ? Math.round((record.successRequests / record.totalRequests) * 10000) /
                  100
                : 0,
    }));

    const paginatedData = enhancedUsageData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatResponseTime = (ms: number): string => {
        if (ms >= 1000) {
            return `${(ms / 1000).toFixed(1)}s`;
        }
        return `${ms}ms`;
    };

    const getSuccessRateColor = (rate: number): "success" | "warning" | "error" => {
        if (rate >= 90) return "success";
        if (rate >= 50) return "warning";
        return "error";
    };

    return (
        <Card className={styles.tableCard}>
            <CardContent className={styles.cardContent}>
                <Box className={styles.header}>
                    <Typography className={styles.title} variant="h6">
                        Detailed Usage Metrics
                    </Typography>
                    <Tooltip title="Usage metrics for all API requests within the selected time range">
                        <InfoIcon className={styles.infoIcon} />
                    </Tooltip>
                </Box>

                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.align}
                                        className={styles.headerCell}
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={styles.tableRow}
                                    data-testid={"paginated-data-item-row"}
                                >
                                    <TableCell className={styles.tableCell}>
                                        {new Date(row.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell align="right" className={styles.tableCell}>
                                        <Typography className={styles.requestsCount}>
                                            {row.totalRequests.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className={styles.tableCell}
                                    >
                                        <Chip
                                            label={`${row.successRate}%`}
                                            color={getSuccessRateColor(row.successRate)}
                                            size="small"
                                            className={styles.successChip}
                                        />
                                    </TableCell>
                                    <TableCell align="right" className={styles.tableCell}>
                                        <Typography className={styles.responseTime}>
                                            {formatResponseTime(row.avgResponseTime)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {paginatedData.length === 0 && (
                                <TableRow data-testid={"empty-table-text"}>
                                    <TableCell colSpan={5} className={styles.noDataCell}>
                                        <Typography className={styles.noDataText}>
                                            No usage data available for the selected
                                            filters
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {enhancedUsageData.length > 0 && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={enhancedUsageData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className={styles.pagination}
                    />
                )}
            </CardContent>
        </Card>
    );
};
