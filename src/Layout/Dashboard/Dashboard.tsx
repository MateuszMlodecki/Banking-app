import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { DashboardAppBar } from "./DashboardAppBar";
import { DrawerComponent } from "./DrawerComponent";
import { DashboardContent } from "./DashboardContent";
import { theme } from "../../themes/theme";

export const Dashboard: React.FC = () => {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen((prev) => !prev);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<CssBaseline />
			<DashboardAppBar handleDrawerToggle={handleDrawerToggle} />
			<DrawerComponent
				mobileOpen={mobileOpen}
				handleDrawerToggle={handleDrawerToggle}
			/>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					backgroundColor: theme.palette.primary.dark,
					marginTop: "64px",
					overflow: "hidden",
				}}
			>
				<DashboardContent />
			</Box>
		</Box>
	);
};
