import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Typography, Button, Box } from "@mui/material";
import { Step2Values } from "../../types/types";
import { validationSchemaStep2 } from "../../utils/validationSchemaStepper";
import { theme } from "../../themes/theme";

export const AddressInfo: React.FC<{
	setIsStepValid: (isValid: boolean) => void;
	onSubmit: (data: Step2Values) => void;
}> = ({ setIsStepValid, onSubmit }) => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		mode: "all",
		resolver: yupResolver(validationSchemaStep2),
		defaultValues: {
			streetName: "",
			streetNumber: "",
			flatNumber: "",
			city: "",
		},
	});

	useEffect(() => {
		setIsStepValid(isValid);
	}, [isValid, setIsStepValid]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography>Address Information</Typography>
			<Controller
				name="streetName"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Street Name"
						fullWidth
						error={!!errors.streetName}
						helperText={errors.streetName?.message}
					/>
				)}
			/>
			<Controller
				name="streetNumber"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Street Number"
						fullWidth
						error={!!errors.streetNumber}
						helperText={errors.streetNumber?.message}
					/>
				)}
			/>
			<Controller
				name="flatNumber"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Flat Number"
						fullWidth
						error={!!errors.flatNumber}
						helperText={errors.flatNumber?.message}
					/>
				)}
			/>
			<Controller
				name="city"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="City"
						fullWidth
						error={!!errors.city}
						helperText={errors.city?.message}
					/>
				)}
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Button
					sx={{
						color: theme.palette.primary.contrastText,
						backgroundColor: theme.palette.secondary.main,
					}}
					type="submit"
					variant="contained"
					disabled={!isValid}
				>
					Continue
				</Button>
			</Box>
		</form>
	);
};
