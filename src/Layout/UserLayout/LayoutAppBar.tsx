import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerWidth } from "../../utils/constants";
import { theme } from "../../themes/theme";

interface AppBarComponentProps {
	handleDrawerToggle: () => void;
}

export const LayoutAppBar: React.FC<AppBarComponentProps> = ({
	handleDrawerToggle,
}) => {
	return (
		<AppBar
			position="fixed"
			sx={{
				background: theme.palette.primary.dark,
			}}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{
						mr: 2,
						display: { sm: "none" },
						background: theme.palette.primary.dark,
						borderRadius: "50%",
						padding: "8px",
						"&:hover": { background: theme.palette.grey[800] },
					}}
				>
					<MenuIcon />
				</IconButton>
				<Typography
					variant="h6"
					noWrap
					component="div"
					sx={{
						display: "flex",
						flexDirection: { xs: "row-reverse", sm: "row" },
						flexGrow: 1,
						color: theme.palette.primary.contrastText,
						fontWeight: "bold",
						marginLeft: { sm: drawerWidth },
					}}
				>
					BankingApp dashboard
				</Typography>
			</Toolbar>
		</AppBar>
	);
};
