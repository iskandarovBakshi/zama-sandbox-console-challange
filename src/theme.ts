import { createTheme } from "@mui/material/styles";
import Link from "next/link";

export const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
    },
    defaultColorScheme: "light",
    typography: {
        fontFamily: "var(--font-geist-sans)",
    },
    spacing: 4,
    components: {
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
        },
        MuiLink: {
            defaultProps: {
                component: Link,
            },
        },
        MuiToolbar: {
            defaultProps: {
                variant: "dense",
            },
        },
        MuiStack: {
            defaultProps: {
                useFlexGap: true,
            },
        },
        MuiButton: {
            defaultProps: {
                size: "small",
                disableElevation: true,
                disableRipple: true,
                LinkComponent: Link,
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiIconButton: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
});
