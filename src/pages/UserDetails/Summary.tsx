import React, { useState } from "react";
import { useUserDetails } from "../../context/UserContext";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { theme } from "../../themes/theme";
import axios from "axios";

export const Summary: React.FC = () => {
	const { userDetails } = useUserDetails();
	const [message, setMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleSaveProfile = async () => {
		setMessage("");
		setLoading(true);
		const userId = localStorage.getItem("userId");
		const token = localStorage.getItem("token");

		if (!userId || !token) {
			setMessage("User not logged in. Please login again.");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(
				`http://localhost:4000/user/profile/${userId}`,
				{ ...userDetails, onboardingCompleted: true },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			localStorage.setItem("onboardingCompleted", "true");
			setMessage(response.data.message);
			setTimeout(() => {
				navigate("/user");
				window.location.reload();
			}, 1000);
		} catch (error: unknown) {
			console.error("Profile save error:", error);

			if (axios.isAxiosError(error)) {
				setMessage(error.response?.data?.message || "Failed to save profile.");
			} else {
				setMessage("An unexpected error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<Typography variant="h2">Summary</Typography>
			<Typography
				sx={{
					display: "flex",
					justifyContent: "center",
					maxWidth: "50%",
					whiteSpace: "pre-wrap",
				}}
			>
				{JSON.stringify(userDetails, null, 2)}
			</Typography>

			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<Button
					sx={{
						width: "200px",
						color: theme.palette.primary.contrastText,
						backgroundColor: theme.palette.secondary.main,
					}}
					variant="contained"
					onClick={handleSaveProfile}
					disabled={loading}
				>
					{loading ? <CircularProgress size={24} /> : "Save Profile"}
				</Button>
			</Box>

			{message && (
				<Typography
					variant="body1"
					sx={{ color: message.includes("success") ? "green" : "red" }}
					aria-live="polite"
				>
					{message}
				</Typography>
			)}
		</Box>
	);
};
