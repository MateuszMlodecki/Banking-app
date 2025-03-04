import React, { useState } from "react";
import { useUserDetails } from "../../context/UserContext";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
			setMessage("User  not logged in. Please login again.");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:4000/user/profile/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ ...userDetails, onboardingCompleted: true }),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				setMessage(result.message || "Failed to save profile.");
			} else {
				localStorage.setItem("onboardingCompleted", "true");
				setMessage(result.message);
				setTimeout(() => navigate("/dashboard"), 1000);
			}
		} catch (error) {
			console.error("Profile save error:", error);
			setMessage("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<Typography variant="h2">Summary</Typography>
			<Typography sx={{ maxWidth: "50%", whiteSpace: "pre-wrap" }}>
				{JSON.stringify(userDetails, null, 2)}
			</Typography>

			<Button
				variant="contained"
				onClick={handleSaveProfile}
				sx={{ width: "200px" }}
				disabled={loading}
			>
				{loading ? <CircularProgress size={24} /> : "Save Profile"}
			</Button>

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
