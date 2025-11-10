"use client";
import { FC } from "react";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import { Button } from "@mui/material";
import { usePathname } from "next/navigation";
import styles from "./styles.module.css";
import clsx from "clsx";

const links = [
    { href: "/dashboard", label: "Dashboard", Icon: SpaceDashboardOutlinedIcon },
    { href: "/dashboard/api-keys", label: "API Keys", Icon: KeyOutlinedIcon },
    { href: "/dashboard/usage", label: "Usage", Icon: BarChartOutlinedIcon },
    { href: "/dashboard/docs", label: "Docs", Icon: ImportContactsOutlinedIcon },
];

export const DashboardLinks: FC = () => {
    const pathname = usePathname();
    return (
        <>
            {links.map(({ href, label, Icon }) => {
                const isActive = pathname === href;
                return (
                    <Button
                        key={href}
                        startIcon={<Icon />}
                        className={clsx(styles.button, {
                            [styles.active]: isActive,
                        })}
                        href={href}
                    >
                        {label}
                    </Button>
                );
            })}
        </>
    );
};
