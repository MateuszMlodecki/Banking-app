import { Box, TextField, Typography, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { theme } from "../../themes/theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "../../utils/errorHandler";
import { PaymentValueRegex } from "../../utils/constants";

interface PaymentFormData {
	receiver: string;
	fromAccount: string;
	toAccount: string;
	amount: string;
	date: string;
	title: string;
}

export const Payment = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<PaymentFormData>({
		defaultValues: {
			receiver: "",
			fromAccount: "",
			toAccount: "",
			amount: "",
			date: new Date().toISOString().split("T")[0],
			title: "",
		},
	});
	const [message, setMessage] = useState<string>("");
	const navigate = useNavigate();

	const onSubmit = async (data: PaymentFormData) => {
		const userId = localStorage.getItem("userId");
		const token = localStorage.getItem("token");

		if (!userId || !token) {
			setMessage("User not logged in. Please login again.");
			return;
		}

		try {
			const response = await axios.post(
				`http://localhost:4000/user/${userId}/transaction`,
				{
					receiver: data.receiver,
					amount: data.amount,
					date: data.date,
					title: data.title,
					fromAccount: data.fromAccount,
					toAccount: data.toAccount,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setMessage(response.data.message || "Transaction successful");
			navigate("/user");
		} catch (error) {
			errorHandler(error);
			console.error("Transaction error:", error);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				maxWidth: 400,
				margin: "auto",
			}}
		>
			<Typography variant="h5" sx={{ color: "text.primary" }}>
				Payment
			</Typography>

			<Controller
				name="receiver"
				control={control}
				rules={{ required: "Receiver is required" }}
				render={({ field }) => (
					<TextField
						label="Receiver"
						fullWidth
						{...field}
						error={!!errors.receiver}
						helperText={errors.receiver?.message}
					/>
				)}
			/>

			<Controller
				name="fromAccount"
				control={control}
				rules={{ required: "From Account is required" }}
				render={({ field }) => (
					<TextField
						label="From Account"
						fullWidth
						{...field}
						error={!!errors.fromAccount}
						helperText={errors.fromAccount?.message}
					/>
				)}
			/>

			<Controller
				name="toAccount"
				control={control}
				rules={{ required: "To Account is required" }}
				render={({ field }) => (
					<TextField
						label="To Account"
						fullWidth
						{...field}
						error={!!errors.toAccount}
						helperText={errors.toAccount?.message}
					/>
				)}
			/>

			<Controller
				name="amount"
				control={control}
				rules={{
					required: "Amount is required",
					pattern: {
						value: PaymentValueRegex,
						message: "Enter a valid amount ( like 100 or 100.50)",
					},
				}}
				render={({ field }) => (
					<TextField
						label="Amount"
						fullWidth
						type="number"
						{...field}
						error={!!errors.amount}
						helperText={errors.amount?.message}
					/>
				)}
			/>

			<Controller
				name="date"
				control={control}
				rules={{ required: "Date is required" }}
				render={({ field }) => (
					<TextField
						label="Transfer Date"
						type="date"
						fullWidth
						InputLabelProps={{ shrink: true }}
						inputProps={{ min: new Date().toISOString().split("T")[0] }}
						{...field}
						error={!!errors.date}
						helperText={errors.date?.message}
					/>
				)}
			/>

			<Controller
				name="title"
				control={control}
				rules={{ required: "Transfer Title is required" }}
				render={({ field }) => (
					<TextField
						label="Transfer Title"
						fullWidth
						{...field}
						error={!!errors.title}
						helperText={errors.title?.message}
					/>
				)}
			/>

			<Button
				sx={{ background: theme.palette.secondary.light }}
				variant="contained"
				onClick={handleSubmit(onSubmit)}
			>
				Send Transfer
			</Button>

			{message && (
				<Typography
					variant="h4"
					sx={{
						color: message.includes("success")
							? "green"
							: theme.palette.error.main,
					}}
				>
					{message}
				</Typography>
			)}
		</Box>
	);
};
