"use client";

import {
    createContext,
    useContext,
    useState,
    FC,
    PropsWithChildren,
    useEffect,
    useEffectEvent,
} from "react";

const STORAGE_KEY = "feature_flags";

interface FeatureFlagContextProps {
    isAdvancedModeEnabled: boolean;
    toggleAdvancedMode: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextProps | undefined>(undefined);

export const FeatureFlagProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isAdvancedModeEnabled, setIsAdvancedModeEnabled] = useState(false);

    const toggleAdvancedMode = () => {
        const value = !isAdvancedModeEnabled;
        setIsAdvancedModeEnabled(value);
        setFeatureFlagToStorage(value);
    };

    const getFeatureFlagFromStorage = () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "false");
    };

    const setFeatureFlagToStorage = (value: boolean) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    };

    const onMount = useEffectEvent(() => {
        setIsAdvancedModeEnabled(getFeatureFlagFromStorage());
    });

    useEffect(() => {
        onMount();
    }, []);

    return (
        <FeatureFlagContext.Provider
            value={{ isAdvancedModeEnabled, toggleAdvancedMode }}
        >
            {children}
        </FeatureFlagContext.Provider>
    );
};

export const useFeatureFlag = () => {
    const context = useContext(FeatureFlagContext);
    if (context === undefined) {
        throw new Error("useFeatureFlag must be used within a FeatureFlagProvider");
    }
    return context;
};
