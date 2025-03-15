import { Box, TextField, Typography, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { theme } from "../../themes/theme";

export const Payment = () => {
	const [formData, setFormData] = useState({
		recipient: "",
		fromAccount: "",
		toAccount: "",
		value: "",
		date: dayjs() as Dayjs,
		title: "",
	});

	const handleChange = (field: string, value: string | Dayjs) => {
		setFormData((prev) => ({
			...prev,
			[field]: value ?? dayjs(),
		}));
	};

	const handleSubmit = () => {
		console.log("Payment Data:", formData);
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
					value={formData.recipient}
					onChange={(e) => handleChange("recipient", e.target.value)}
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
					onChange={(date) => handleChange("date", date)}
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
			</Box>
		</LocalizationProvider>
	);
};
