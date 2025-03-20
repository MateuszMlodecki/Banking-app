import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { LayoutAppBar } from "./LayoutAppBar";
import { DrawerComponent } from "./DrawerComponent";
import { LayoutContent } from "./LayoutContent";
import { theme } from "../../themes/theme";

export const Layout: React.FC = () => {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen((prev) => !prev);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<CssBaseline />
			<LayoutAppBar handleDrawerToggle={handleDrawerToggle} />
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
				<LayoutContent />
			</Box>
		</Box>
	);
};
