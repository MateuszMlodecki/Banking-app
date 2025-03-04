import React from "react";
import { Box } from "@mui/material";
import { drawerWidth } from "../../utils/constants";
import { Outlet } from "react-router-dom";

export const DashboardContent: React.FC = () => {
	return (
		<Box sx={{ marginLeft: { xs: 0, sm: drawerWidth } }}>
			<Outlet />
		</Box>
	);
};
