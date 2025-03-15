import axios from "axios";
import { useNavigate } from "react-router-dom";

export const errorHandler = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		const status = error.response?.status;
		const message = error.response?.data?.message || error.message;
		const navigate = useNavigate();

		switch (status) {
			case 400:
				console.error("Bad Request:", message);
				alert("Invalid request. Please check your input.");
				break;

			case 401:
			case 403:
				console.error("Unauthorized:", message);
				alert("Session expired. Please log in again.");
				localStorage.clear();
				navigate("/login");
				break;

			case 404:
				console.error("Resource Not Found:", message);
				alert("Requested resource not found.");
				break;

			case 408:
				console.error("Request Timeout:", message);
				alert("Server took too long to respond. Please try again.");
				break;

			case 429:
				console.error("Too Many Requests:", message);
				alert("You are making too many requests. Please slow down.");
				break;

			case 500:
				console.error("Internal Server Error:", message);
				alert("An error occurred on the server. Try again later.");
				break;

			case 503:
				console.error("Service Unavailable:", message);
				alert("Server is currently unavailable. Please try again later.");
				break;

			default:
				console.error(`Unexpected Error (${status}):`, message);
				alert("An unexpected error occurred. Please try again.");
		}
	} else {
		console.error("Unexpected error:", error);
		alert("An unexpected error occurred. Please try again.");
	}
};
