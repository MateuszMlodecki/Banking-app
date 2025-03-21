import axios from "axios";
//import { useNavigate } from "react-router-dom";

export const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    //const navigate = useNavigate();

    console.error(`Error ${status || "unknown"}:`, {
      message,
      details: error.response?.data?.details || "No additional details",
    });

    switch (status) {
      case 400:
        console.error("Bad Request:", message);
        console.log("Invalid request. Please check your input.");
        break;

      case 401:
      case 403:
        console.error("Unauthorized:", message);
        console.log("Session expired. Please log in again.");
        localStorage.clear();
        //	navigate("/login", { state: { fromError: true } });
        break;

      case 404:
        console.error("Resource Not Found:", message);
        console.log("Requested resource not found.");
        //Todo tu w przyszlosci bedzie jakies przekierowanie na strone 404 ktora powstanie w przyszlosci
        break;

      case 408:
        console.error("Request Timeout:", message);
        console.log("Server took too long to respond. Please try again.");
        break;

      case 429:
        console.error("Too Many Requests:", message);
        console.log("You are making too many requests. Please slow down.");
        break;

      case 500:
        console.error("Internal Server Error:", message);
        console.log("An error occurred on the server. Try again later.");
        break;

      case 503:
        console.error("Service Unavailable:", message);
        console.log("Server is currently unavailable. Please try again later.");
        break;

      default:
        console.error(`Unexpected Error (${status || "unknown"}):`, message);
        console.log("An unexpected error occurred. Please try again.");
        break;
    }
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.log("Unexpected non-Axios error:", errorMessage);
    console.log("An unexpected error occurred. Please try again.");
  }
};
