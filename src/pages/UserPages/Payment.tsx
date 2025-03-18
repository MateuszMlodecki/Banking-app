import { Box, TextField, Typography, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { theme } from "../../themes/theme";
import axios from "axios";

/*
- nie uzywasz react hook form, a powinienes
- nie uzywasz axiosa
- dayjs wydaje mi sie zbedny*
- nie ma czegos takiego jak ProfileNumber, jest accountNumber, natomiast nie potrzebujesz go w tym komponencie,
wystarczy, ze przy .post requescie wyslesz poprawne userId nadawcy (w params /user/:id/transaction)
 */

export const Payment = () => {
	const [formData, setFormData] = useState({
		receiver: "",
		fromAccount: "",
		toAccount: "",
		value: "",
		date: dayjs() as Dayjs,
		title: "",
	});
	const [message, setMessage] = useState("");
	const [accountNumber, setAccountNumber] = useState("");

	useEffect(() => {
		const fetchProfileNumber = async () => {
			const token = localStorage.getItem("token");
			const userId = localStorage.getItem("userId");

			if (token && userId) {
				try {
					const response = await fetch(
						`http://localhost:4000/user/profile/${userId}`,
						{
							headers: {
								authorization: `Bearer ${token}`,
							},
						}
					);
					if (!response.ok) {
						console.log("Failed to fetch user data.");
						return;
					}

					const profileData = await response.json();
					setAccountNumber(profileData);
					setFormData((prev) => ({
						...prev,
						fromAccount: profileData.accountNumber,
					}));
				} catch (error) {
					console.log("Profile fetch error:", error);
				}
			}
		};
		fetchProfileNumber();
	}, []);

	const handleChange = (field: string, value: string | Dayjs) => {
		setFormData((prev) => ({
			...prev,
			[field]: value ?? dayjs(),
		}));
	};

	const handleSubmit = async () => {
		try {
			const transactionData = {
				recipient: formData.receiver,
				value: Number(formData.value),
				date: formData.date.toISOString(),
				title: formData.title,
			};
			console.log(transactionData);

			const response = await axios.post(
				"http://localhost:4000/transaction",
				transactionData
			);

			setMessage(response.data.message);
		} catch (error) {
			console.error("Payment error:", error);
			setMessage("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
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
				<TextField
					label="Receiver"
					fullWidth
					value={formData.receiver}
					onChange={(e) => handleChange("receiver", e.target.value)}
				/>
				<TextField
					label="From Account"
					fullWidth
					value={formData.fromAccount}
					onChange={(e) => handleChange("fromAccount", e.target.value)}
				/>
				<TextField
					label="To Account"
					fullWidth
					value={formData.toAccount}
					onChange={(e) => handleChange("toAccount", e.target.value)}
				/>
				<TextField
					label="Amount"
					fullWidth
					type="number"
					value={formData.value}
					onChange={(e) => handleChange("value", e.target.value)}
				/>
				<DatePicker
					format="DD-MM-YYYY"
					label="Transfer Date"
					value={formData.date}
					onChange={(date) => handleChange("date", date ?? dayjs())}
					shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
					sx={{
						".MuiDateCalendar-root": {
							color: theme.palette.primary.contrastText,
							borderRadius: "2px",
							borderWidth: "1px",
							border: "1px solid",
						},
					}}
					slotProps={{
						textField: {
							fullWidth: true,
							margin: "normal",
						},
					}}
				/>
				<TextField
					label="Transfer Title"
					fullWidth
					value={formData.title}
					onChange={(e) => handleChange("title", e.target.value)}
				/>
				<Button
					sx={{ background: theme.palette.secondary.light }}
					variant="contained"
					onClick={handleSubmit}
				>
					Send Transfer
				</Button>
				{message && (
					<Typography variant="h4" sx={{ color: theme.palette.error.main }}>
						{message}
					</Typography>
				)}
			</Box>
		</LocalizationProvider>
	);
};
