import { FC } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import styles from "./styles.module.css";
import { LoginForm } from "@/features/auth/components/LoginForm/LoginForm";

export const HomeContainer: FC = () => {
    return (
        <Container maxWidth="sm">
            <Box className={styles.centeredContainer}>
                <Paper elevation={3} className={styles.paper}>
                    <Typography variant="h5" component="h4" className={styles.title}>
                        Sandbox Console
                    </Typography>

                    <Typography variant="body1" className={styles.description}>
                        Welcome to the developer sandbox console. Access your API keys,
                        usage metrics, and documentation.
                    </Typography>

                    <LoginForm />
                </Paper>
            </Box>
        </Container>
    );
};
