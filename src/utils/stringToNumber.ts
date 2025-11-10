// convert string to number NaN in mind
export const stringToNumber = (s: string | undefined, fallback: number) => {
    return Number.isFinite(Number(s)) ? Number(s) : fallback;
};
