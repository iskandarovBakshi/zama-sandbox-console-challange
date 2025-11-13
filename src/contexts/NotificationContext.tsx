import {
    createContext,
    FC,
    PropsWithChildren,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";
import { Alert, Snackbar } from "@mui/material";
import styles from "@/features/api-keys/components/ApiKeysContainer/styles.module.css";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";

type NotificationType = "success" | "error" | "warning";

interface NotificationState {
    message: ReactNode;
    type: NotificationType;
    open: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any;
    duration?: number;
}

type NotificationStateWithoutOpen = Omit<NotificationState, "open">;

const notificationDuration = 4000;

interface NotificationContextProps {
    showNotification: (notification: NotificationStateWithoutOpen) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
    undefined,
);

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({
        message: "",
        type: "success",
        open: false,
        error: null,
        duration: notificationDuration,
    });

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    const showNotification = useCallback(
        ({ message, type, error }: NotificationStateWithoutOpen) => {
            if (type === "error") {
                console.error(error);
            }
            setNotification({
                message,
                type,
                error,
                open: true,
            });
        },
        [],
    );

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
            }}
        >
            {children}

            <Snackbar
                open={notification.open}
                autoHideDuration={notification.duration}
                onClose={handleCloseNotification}
                className={styles.snackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity={notification.type}
                    onClose={handleCloseNotification}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                    {notification.error ? (
                        <ErrorMessage error={notification.error} />
                    ) : null}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error("useNotification must be used within an NotificationProvider");
    }

    return context;
};
