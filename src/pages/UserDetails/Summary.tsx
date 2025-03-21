import React, { useState } from "react";
import { useUserDetails } from "../../context/UserContext";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { theme } from "../../themes/theme";
import axios from "axios";
import { errorHandler } from "../../utils/errorHandler";

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
      const profileData = {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        dateOfBirth: userDetails.dateOfBirth,
        streetName: userDetails.streetName,
        streetNumber: userDetails.streetNumber,
        flatNumber: userDetails.flatNumber,
        city: userDetails.city,
      };
      const profileResponse = await axios.post(
        `http://localhost:4000/user/${userId}/profile`,
        profileData,
      );
      const bankData = {
        bankName: userDetails.bankName,
        accountNumber: userDetails.accountNumber,
      };

      const bankResponse = await axios.post(
        `http://localhost:4000/user/${userId}/account`,
        bankData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("onboardingCompleted", "true");
      setMessage(
        `${profileResponse.data.message} ${bankResponse.data.message}`,
      );
      navigate("/user");
    } catch (error: unknown) {
      errorHandler(error);
      setMessage("Failed to save profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  console.log("Details", userDetails);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Box>
        <Typography variant="h2">Summary</Typography>
        <Typography>First name: {userDetails.firstName}</Typography>
        <Typography>Last name: {userDetails.lastName}</Typography>
        <Typography>Date of birth: {userDetails.dateOfBirth}</Typography>
        <Typography>Street name: {userDetails.streetName}</Typography>
        <Typography>Street number: {userDetails.streetNumber}</Typography>
        <Typography>Flat number: {userDetails.flatNumber}</Typography>
        <Typography>City: {userDetails.city}</Typography>
        <Typography>Bank name: {userDetails.bankName}</Typography>
        <Typography>Account number: {userDetails.accountNumber}</Typography>
      </Box>
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
