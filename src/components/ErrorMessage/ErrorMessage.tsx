import { FC } from "react";
import styles from "./styles.module.css";
import { Box } from "@mui/material";

interface ErrorMessageProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
    return (
        <Box className={styles.errorMessageContainer}>
            Error message:{" "}
            <code className={styles.errorMessage}>
                {JSON.stringify(error?.stack ? error?.stack : error)}
            </code>
        </Box>
    );
};
