// Global provders
"use client";
import { CssBaseline, InitColorSchemeScript, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { FC, PropsWithChildren } from "react";
import { theme } from "./theme";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { FeatureFlagProvider } from "@/contexts/FeatureFlagContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ServicesProvider } from "@/contexts/ServicesProvider";

export const ProviderTree: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <InitColorSchemeScript defaultMode={"light"} />
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <NotificationProvider>
                        <ServicesProvider>
                            <AuthProvider>
                                <FeatureFlagProvider>{children}</FeatureFlagProvider>
                            </AuthProvider>
                        </ServicesProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </>
    );
};
