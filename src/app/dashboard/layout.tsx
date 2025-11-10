import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout/DashboardLayout";
import { ReactNode } from "react";
export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
