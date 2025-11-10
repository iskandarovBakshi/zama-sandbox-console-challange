import { AppBar, Container, Stack, Toolbar } from "@mui/material";
import styles from "./styles.module.css";
import Link from "next/link";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { DashboardLinks } from "@/features/dashboard/components/DashboardLinks/DashboardLinks";
import { FeatureToggle } from "@/components/FeatureToggle/FeatureToggle";
import { HeaderUserProfile } from "@/features/dashboard/components/HeaderUserProfile/HeaderUserProfile";

export const Header = () => {
    return (
        <>
            <AppBar color="default">
                <Toolbar className={styles.toolbar}>
                    <Container className={styles.container}>
                        <Stack direction={"row"} spacing={8} className={styles.stackRoot}>
                            <Link href="/dashboard" className={styles.heroLink}>
                                <PrivacyTipIcon />
                                Sandbox Console
                            </Link>
                            <Stack
                                className={styles.dashboardLinks}
                                direction={"row"}
                                spacing={4}
                            >
                                <DashboardLinks />
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                className={styles.userProfile}
                            >
                                <FeatureToggle />
                                <HeaderUserProfile />
                            </Stack>
                        </Stack>
                    </Container>
                </Toolbar>
            </AppBar>
            <Toolbar className={styles.toolbarPlaceholder} />
        </>
    );
};
