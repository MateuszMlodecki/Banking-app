export const formatAccountNumber = (value: string) => {
	if (!value) return value;

	const cleaned = value.replace(/\D/g, "");
	const cleanedLimited = cleaned.slice(0, 26);
	const formatted = cleanedLimited
		.replace(/^(\d{2})(\d{0,})/, "$1 $2")
		.replace(/(\d{4})(?=\d)/g, "$1 ")
		.trim();

	return formatted;
};
