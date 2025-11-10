import { ApiKeyDisplayOptions, ApiKeyStatus } from "@/features/api-keys/types/general";

const DEFAULT_VISIBLE_CHARS = 12;

export const apiKeyFormatter = {
    maskApiKey(key: string, options: ApiKeyDisplayOptions = {}): string {
        if (options.showFullKey) {
            return key;
        }

        const visibleLength = options.maskedKeyLength || DEFAULT_VISIBLE_CHARS;

        if (key.length <= visibleLength) {
            return key;
        }

        const prefixLength = Math.floor(visibleLength * 0.67);
        const suffixLength = visibleLength - prefixLength;

        const prefix = key.substring(0, prefixLength);
        const suffix = key.substring(key.length - suffixLength);
        const maskedPart = "*".repeat(key.length - prefixLength - suffixLength);

        return `${prefix}${maskedPart}${suffix}`;
    },
    getStatusInfo(status: ApiKeyStatus) {
        switch (status) {
            case ApiKeyStatus.ACTIVE:
                return {
                    label: "Active",
                    color: "var(--mui-palette-success-contrastText)",
                    backgroundColor: "var(--mui-palette-success-main)",
                };
            case ApiKeyStatus.REVOKED:
                return {
                    label: "Revoked",
                    color: "var(--mui-palette-error-contrastText)",
                    backgroundColor: "var(--mui-palette-error-main)",
                };
            default:
                return {
                    label: "Unknown",
                    color: "var(--mui-palette-text-primary)",
                    backgroundColor: "transparent",
                };
        }
    },
};
