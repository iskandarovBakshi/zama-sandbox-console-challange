import { Container } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { Header } from "@/features/dashboard/components/Header/Header";

export const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <main>
            <Header />
            <Container>{children}</Container>
        </main>
    );
};
