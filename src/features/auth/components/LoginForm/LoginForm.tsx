"use client";
import { FC, useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Button, TextField, InputAdornment, IconButton, Box } from "@mui/material";
import zod from "zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toFormikValidationSchema } from "zod-formik-adapter";

const loginSchema = zod.object({
    username: zod
        .string("Username required")
        .min(1, "Username must be at least 1 characters"),
    password: zod
        .string("Password required")
        .min(6, "Password must be at least 6 characters"),
});

export const LoginForm: FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: toFormikValidationSchema(loginSchema),
        onSubmit(values) {
            login(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    slotProps={{
                        htmlInput: {
                            "data-testid": "username-input",
                        },
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    slotProps={{
                        htmlInput: {
                            "data-testid": "password-input",
                        },
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((s) => !s)}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>
            <Button
                loading={isLoading}
                variant={"contained"}
                fullWidth
                type={"submit"}
                data-testid={"login-button"}
            >
                Login
            </Button>
        </form>
    );
};
