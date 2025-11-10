"use client";

import { Container, Typography, Paper, Stack, Alert } from "@mui/material";
import CopyButton from "@/features/docs/components/CopyButton/CopyButton";
import { FC } from "react";
import styles from "./styles.module.css";

export const DocsContainer: FC = () => {
    const curlExample = `curl -X GET "https://api.sandbox.com/v1/hello" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

    const nodeExample = `const response = await fetch("https://api.sandbox.com/v1/hello", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  }
});

const data = await response.json();
console.log(data);`;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={4}>
                <div>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Getting Started
                    </Typography>
                    <Typography variant="body1" color="text.secondary" component={"p"}>
                        Welcome to the Sandbox Console API documentation. Learn how to
                        authenticate and make your first API call.
                    </Typography>
                </div>

                <div>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Authentication
                    </Typography>
                    <Typography variant="body1" component={"p"}>
                        All API requests require authentication using an API key. Include
                        your API key in the Authorization header:
                    </Typography>
                    <Paper className={styles.paper}>
                        <CopyButton text="Authorization: Bearer YOUR_API_KEY" />
                        <pre className={styles.pre}>
                            Authorization: Bearer YOUR_API_KEY
                        </pre>
                    </Paper>
                    <Typography variant="body2" color="text.secondary">
                        You can generate API keys from the <strong>API Keys</strong> page
                        in your dashboard.
                    </Typography>
                </div>

                <div>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Your First API Call
                    </Typography>
                    <Typography variant="body1" component={"p"}>
                        Make a simple request to test your authentication:
                    </Typography>

                    <div>
                        <Typography variant="h6" component="h3" gutterBottom>
                            curl
                        </Typography>
                        <Paper className={styles.paper}>
                            <CopyButton text={curlExample} />
                            <pre className={styles.pre}>{curlExample}</pre>
                        </Paper>
                    </div>

                    <div>
                        <Typography variant="h6" component="h3" gutterBottom>
                            Node.js
                        </Typography>
                        <Paper className={styles.paper}>
                            <CopyButton text={nodeExample} />
                            <pre className={styles.pre}>{nodeExample}</pre>
                        </Paper>
                    </div>
                </div>

                <div>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Common Issues
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2" component="div">
                            <strong>Tip:</strong> If you receive a{" "}
                            <code>401 Unauthorized</code> error, check that:
                            <ul style={{ margin: "8px 0", paddingLeft: "24px" }}>
                                <li>Your API key is valid</li>
                                <li>
                                    You&apos;re including the correct &quot;Bearer &quot;
                                    prefix
                                </li>
                                <li>There are no extra spaces in the header value</li>
                            </ul>
                        </Typography>
                    </Alert>
                </div>
            </Stack>
        </Container>
    );
};
