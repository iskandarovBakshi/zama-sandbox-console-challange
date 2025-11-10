import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useEffectEvent,
    useMemo,
} from "react";
import { interceptServiceApisPingSession } from "@/utils/interceptServiceApisPingSession";
import { AuthService } from "@/features/auth/services/authService";
import { ApiKeyService } from "@/features/api-keys/services/apiKeyService";
import { UsageService } from "@/features/usage/services/usageService";
import { fetchRequest } from "@/utils/fetchWrapper";
import { SessionResponse } from "@/features/auth/types/auth";
import { useNotification } from "@/contexts/NotificationContext";
import { usePathname, useRouter } from "next/navigation";

// simple throttle function
function throttle<T>(func: () => Promise<T>) {
    let pending = false;

    return async () => {
        if (pending) return;

        pending = true;
        func().finally(() => {
            pending = false;
        });
    };
}
interface ServicesProviderProps {
    services: {
        authService: AuthService;
        apiKeyService: ApiKeyService;
        usageService: UsageService;
    };
}

const ServicesContext = createContext<ServicesProviderProps | undefined>(undefined);

export const ServicesProvider: FC<PropsWithChildren> = ({ children }) => {
    const { showNotification } = useNotification();
    const router = useRouter();
    const pathname = usePathname();

    const logout = async () => {
        try {
            await services.authService.logout();
            router.push("/");
        } catch {
            router.push("/");
        }
    };

    const checkSession = async () => {
        try {
            const data = await fetchRequest<SessionResponse>("/api/session", {
                method: "GET",
            });

            if (!data.loggedIn) {
                showNotification({
                    message: "Session expired. please log in again",
                    type: "warning",
                });

                logout();

                return new Error("Session expired.");
            }

            return data;
        } catch (error) {
            showNotification({
                message: "Session couldn't be retrieved",
                type: "error",
                error,
            });

            logout();

            return error;
        }
    };

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const throttledSessionCheck = useMemo(() => {
        return throttle(checkSession);
    }, []);
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const services = useMemo(
        // eslint-disable-next-line react-hooks/preserve-manual-memoization
        () => ({
            authService: new AuthService(),
            apiKeyService: interceptServiceApisPingSession(
                new ApiKeyService(),
                throttledSessionCheck,
            ),
            usageService: interceptServiceApisPingSession(
                new UsageService(),
                throttledSessionCheck,
            ),
        }),
        [],
    );

    const onMount = useEffectEvent(() => {
        if (pathname === "/") return;
        return setTimeout(throttledSessionCheck);
    });

    useEffect(() => {
        // check session on pages where we don't call services
        const timer = onMount();

        return () => clearTimeout(timer);
    }, []);

    return (
        <ServicesContext.Provider
            value={{
                services,
            }}
        >
            {children}
        </ServicesContext.Provider>
    );
};

export function useServices() {
    const context = useContext(ServicesContext);

    if (context === undefined) {
        throw new Error("useServices must be used within an ServicesProvider");
    }

    return context;
}
