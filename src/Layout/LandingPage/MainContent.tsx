import React from "react";
import { Box, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Vault } from "../../components/VaultAnimation/Vault";
import { theme } from "../../themes/theme";

export const MainContent: React.FC = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: "100vh",
        padding: 3,
        backgroundColor: theme.palette.primary.dark,
        marginTop: "64px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          paddingTop: "200px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ color: theme.palette.secondary.light }}
          >
            selected for you!
          </Typography>
          <Typography
            sx={{
              color: theme.palette.secondary.contrastText,
              fontSize: "36px",
            }}
          >
            BankingApp project
          </Typography>

          <Box
            sx={{
              width: "66%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "100px",
              padding: "10px",
              color: theme.palette.secondary.light,
              background: theme.palette.primary.main,
              borderRadius: "25px",
            }}
          >
            <LockIcon />
            <Typography
              sx={{ color: theme.palette.secondary.light, fontWeight: "bold" }}
            >
              Banking 24X7
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Vault />
        </Box>
      </Box>
    </Box>
  );
};
