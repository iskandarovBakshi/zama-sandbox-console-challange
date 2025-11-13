"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    FC,
    PropsWithChildren,
    useEffectEvent,
} from "react";
import { LoginParams, MockUser } from "@/features/auth/types/auth";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useServices } from "@/contexts/ServicesProvider";
import { generateNewUser } from "@/features/auth/services/authService";

interface AuthContextProps {
    user: MockUser | null;
    isLoading: boolean;
    login: (params: LoginParams) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const {
        services: { authService },
    } = useServices();
    const router = useRouter();
    const [user, setUser] = useState<MockUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userLoaded, setUserLoaded] = useState(false);
    const { showNotification } = useNotification();

    const login = (params: LoginParams) => {
        setIsLoading(true);
        return authService
            .login(params)
            .then((user) => {
                setIsLoading(false);
                setUser(user);
                router.push("/dashboard");
            })
            .catch((error) => {
                setIsLoading(false);
                showNotification({
                    type: "error",
                    message: `Login Failed`,
                    error,
                });
            });
    };

    const logout = () => {
        try {
            authService.logout().then(() => {
                localStorage.clear();
                setUser(null);
                router.push("/");
            });
        } catch {
            router.push("/");
        }
    };

    const onMount = useEffectEvent(async () => {
        try {
            const userFromStorage = await authService.getCurrentUser();
            const user = userFromStorage ?? generateNewUser("Resurrected user");

            if (!userFromStorage) {
                authService.setUserData(user);
            }
            setUser(user);
        } catch (error) {
            showNotification({
                message: "Current User is unavailable",
                type: "error",
                error,
            });
        } finally {
            setUserLoaded(true);
        }
    });

    useEffect(() => {
        onMount();
    }, []);

    if (!userLoaded) return null;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: user !== null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
