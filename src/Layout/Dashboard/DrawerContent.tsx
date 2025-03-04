import React, { useEffect, useState } from "react";
import {
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

type ActiveViewType = "Overview" | "Transactions" | "Payment" | "Report";

interface DrawerContentProps {
	handleMenuItemClick: (view: ActiveViewType) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
	handleMenuItemClick,
}) => {
	const navigate = useNavigate();
	const [profile, setProfile] = useState<{
		firstName: string;
		lastName: string;
	}>({
		firstName: "",
		lastName: "",
	});

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const handleEditProfile = () => {
		navigate("/stepper");
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
					console.error("Error fetching profile:", error);
				}
			}
		};

		fetchProfile();
	}, []);

	const menuList: { text: ActiveViewType; icon: JSX.Element }[] = [
		{
			text: "Overview",
			icon: <DashboardIcon />,
		},
		{
			text: "Transactions",
			icon: <AccountBalanceIcon />,
		},
		{
			text: "Payment",
			icon: <PaymentIcon />,
		},
		{
			text: "Report",
			icon: <AssessmentIcon />,
		},
	];

	const bottomMenu = [
		{
			text: "Help center",
			icon: <HelpIcon />,
		},
		{
			text: "Settings",
			icon: <SettingsIcon />,
		},
		{
			text: "Profile",
			icon: <PersonIcon />,
			action: handleEditProfile,
		},
		{
			text: "Logout",
			icon: <LogoutIcon />,
			action: handleLogout,
		},
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
				<List>
					{menuList.map(({ text, icon }) => (
						<ListItem key={text} disablePadding>
							<ListItemButton onClick={() => handleMenuItemClick(text)}>
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
