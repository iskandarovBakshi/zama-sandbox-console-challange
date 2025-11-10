import { FC } from "react";
import { ApiKeysProvider } from "@/features/api-keys/contexts/ApiKeysContext";
import { ApiKeysWrapper } from "@/features/api-keys/components/ApiKeysWrapper/ApiKeysWrapper";

export const ApiKeysContainer: FC = () => {
    return (
        <ApiKeysProvider>
            <ApiKeysWrapper />
        </ApiKeysProvider>
    );
};
