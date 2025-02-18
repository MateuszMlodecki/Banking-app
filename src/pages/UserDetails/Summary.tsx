import React from "react";
import { useUserDetails } from "../../context/UserContext";
import { Box, Typography } from "@mui/material";

export const Summary: React.FC = () => {
  const { userDetails } = useUserDetails();

  console.log("user details", userDetails);
  return (
    <Box>
      <Typography variant="h2">Summary</Typography>
      <Typography sx={{ maxWidth: "50%" }}>
        {JSON.stringify(userDetails, null, 2)}
      </Typography>
    </Box>
  );
};
