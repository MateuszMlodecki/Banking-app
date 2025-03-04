import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { RegisterValues } from "../../../types/types";
import { theme } from "../../../themes/theme";
import { LandingPageAppBar } from "../../../Layout/LandingPage/LandingPageAppBar";
import { LandingPageDrawer } from "../../../Layout/LandingPage/LandingPageDrawer";
import { registerSchema } from "../../../utils/AuthSchemas";
import { useNavigate } from "react-router-dom";

export const Register = () => {
	const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};
	const navigate = useNavigate();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterValues>({
		mode: "onChange",
		resolver: yupResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		},
	});

	const onSubmit = async (data: RegisterValues) => {
		try {
			const response = await fetch("http://localhost:4000/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				setErrorMessage(result.message || "Registration failed");
				return;
			}

			setSuccessMessage("Registration successful! Moving to Login page.");
			setErrorMessage("");
			setTimeout(() => navigate("/Login"), 3000);
		} catch (error) {
			console.error("Registration error:", error);
			setErrorMessage("Something went wrong. Please try again later.");
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				color: theme.palette.primary.contrastText,
				backgroundColor: theme.palette.background.default,
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				padding: "20px",
				boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
				maxWidth: "400px",
				margin: "auto",
			}}
		>
			<LandingPageAppBar handleDrawerToggle={handleDrawerToggle} />
			<LandingPageDrawer
				mobileOpen={mobileOpen}
				handleDrawerToggle={handleDrawerToggle}
			/>
			<Typography>Register with your email</Typography>

			<TextField
				{...register("email")}
				label="Email"
				error={!!errors.email}
				helperText={errors.email?.message}
			/>
			<TextField
				{...register("password")}
				label="Password"
				type="password"
				error={!!errors.password}
				helperText={errors.password?.message}
			/>
			<TextField
				{...register("repeatPassword")}
				label="Repeat Password"
				type="password"
				error={!!errors.repeatPassword}
				helperText={errors.repeatPassword?.message}
			/>

			<Button
				sx={{ background: theme.palette.secondary.light }}
				type="submit"
				variant="contained"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Registering..." : "Register"}
			</Button>

			{successMessage && (
				<Typography variant="h6" sx={{ color: theme.palette.success.main }}>
					{successMessage}
				</Typography>
			)}
			{errorMessage && (
				<Typography variant="h6" sx={{ color: theme.palette.error.main }}>
					{errorMessage}
				</Typography>
			)}
		</Box>
	);
};
