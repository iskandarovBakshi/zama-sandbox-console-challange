import { stringToNumber } from "@/utils/stringToNumber";

export const env = {
    NEXT_PUBLIC_SESSION_DURATION: stringToNumber(
        process.env.NEXT_PUBLIC_SESSION_DURATION,
        3600,
    ),
};
