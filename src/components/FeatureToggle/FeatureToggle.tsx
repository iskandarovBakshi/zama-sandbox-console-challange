"use client";

import { FormControlLabel, Switch, Tooltip, Typography } from "@mui/material";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { usePathname } from "next/navigation";

export const FeatureToggle = () => {
    const { isAdvancedModeEnabled, toggleAdvancedMode } = useFeatureFlag();
    const pathname = usePathname();

    if (pathname !== "/dashboard/usage") return null;

    return (
        <Tooltip title="Toggle advanced analytics view" arrow>
            <FormControlLabel
                data-testid={"feature-toggle-advanced-label"}
                control={
                    <Switch
                        checked={isAdvancedModeEnabled}
                        onChange={toggleAdvancedMode}
                        size="small"
                        color="primary"
                    />
                }
                label={
                    <Typography fontSize={11} variant="body2" component="span">
                        Advanced Mode
                    </Typography>
                }
            />
        </Tooltip>
    );
};
