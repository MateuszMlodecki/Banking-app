import React, { useEffect, useState } from "react";
import {
	Alert,
	Box,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { theme } from "../../themes/theme";
import { errorHandler } from "../../utils/errorHandler";

export const DrawerContent: React.FC = () => {
	const navigate = useNavigate();
	const [profile, setProfile] = useState<{
		firstName: string;
		lastName: string;
	}>({
		firstName: "",
		lastName: "",
	});

	const onboardingCompleted =
		localStorage.getItem("onboardingCompleted") === "true";

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("onboardingCompleted");
		navigate("/login");
	};

	useEffect(() => {
		const fetchProfile = async () => {
			const token = localStorage.getItem("token");
			const userId = localStorage.getItem("userId");

			if (token && userId) {
				try {
					const response = await fetch(
						`http://localhost:4000/user/profile/${userId}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (!response.ok) {
						console.error("Failed to fetch profile data.");
						return;
					}

					const profileData = await response.json();
					setProfile(profileData);
				} catch (error) {
					errorHandler(error);
				}
			}
		};

		fetchProfile();
	}, []);

	const menuList: { text: string; icon: JSX.Element; path: string }[] = [
		{ text: "Overview", icon: <DashboardIcon />, path: "/user" },
		{
			text: "Transactions",
			icon: <AccountBalanceIcon />,
			path: "/user/transactions",
		},
		{ text: "Payment", icon: <PaymentIcon />, path: "/user/payments" },
		{ text: "Reports", icon: <AssessmentIcon />, path: "/user/reports" },
	];

	const bottomMenu = [
		{ text: "Help center", icon: <HelpIcon /> },
		{ text: "Settings", icon: <SettingsIcon /> },
		{
			text: "Profile",
			icon: <PersonIcon />,
			action: () => navigate("/user/profile"),
		},
		{ text: "Logout", icon: <LogoutIcon />, action: handleLogout },
	];

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				color: theme.palette.primary.contrastText,
				height: "100%",
			}}
		>
			<Box>
				<Toolbar>
					<Typography
						variant="h6"
						sx={{
							marginX: "auto",
							padding: 2,
							textAlign: "center",
							color: theme.palette.primary.contrastText,
						}}
					>
						{profile.firstName} {profile.lastName}
					</Typography>
				</Toolbar>
				<Divider sx={{ borderColor: theme.palette.grey[800] }} />
				{!onboardingCompleted && (
					<Alert severity="warning">
						Please fill your profile to access your account functions
					</Alert>
				)}
				<List>
					{menuList.map(({ text, icon, path }) => (
						<ListItem key={text} disablePadding>
							<ListItemButton
								disabled={!onboardingCompleted}
								onClick={() => navigate(path)}
							>
								<ListItemIcon
									sx={{ color: theme.palette.primary.contrastText }}
								>
									{icon}
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography
											sx={{ color: theme.palette.primary.contrastText }}
										>
											{text}
										</Typography>
									}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
			<Box>
				<Divider sx={{ borderColor: "#444", marginBottom: 2 }} />
				<List>
					{bottomMenu.map(({ text, icon, action }) => (
						<ListItem key={text} disablePadding>
							<ListItemButton onClick={action}>
								<ListItemIcon
									sx={{ color: theme.palette.primary.contrastText }}
								>
									{icon}
								</ListItemIcon>
								<ListItemText
									primary={
										<Typography
											sx={{ color: theme.palette.primary.contrastText }}
										>
											{text}
										</Typography>
									}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Box>
	);
};
