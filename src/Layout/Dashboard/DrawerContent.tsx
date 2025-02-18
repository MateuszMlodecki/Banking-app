import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import { theme } from "../../themes/theme";

type ActiveViewType = "Overview" | "Transactions" | "Payment" | "Report";

interface DrawerContentProps {
  handleMenuItemClick: (view: ActiveViewType) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  handleMenuItemClick,
}) => {
  const menuList: { text: ActiveViewType; icon: JSX.Element }[] = [
    {
      text: "Overview",
      icon: (
        <DashboardIcon sx={{ color: theme.palette.primary.contrastText }} />
      ),
    },
    {
      text: "Transactions",
      icon: (
        <AccountBalanceIcon
          sx={{ color: theme.palette.primary.contrastText }}
        />
      ),
    },
    {
      text: "Payment",
      icon: <PaymentIcon sx={{ color: theme.palette.primary.contrastText }} />,
    },
    {
      text: "Report",
      icon: (
        <AssessmentIcon sx={{ color: theme.palette.primary.contrastText }} />
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: theme.palette.primary.contrastText,
        height: "100%",
      }}
    >
      <Box>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              marginX: "auto",
              padding: 2,
              textAlign: "center",
              color: theme.palette.primary.contrastText,
            }}
          >
            John Doe
            {/* Notatka dla mnie z przyszlosci, tutaj dynamiczna nazwa uzytkownika */}
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: theme.palette.grey[800] }} />
        <List>
          {menuList.map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleMenuItemClick(text)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      {text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Divider sx={{ borderColor: "#444", marginBottom: 2 }} />
        <List>
          {[
            {
              text: "Help center",
              icon: (
                <HelpIcon sx={{ color: theme.palette.primary.contrastText }} />
              ),
            },
            {
              text: "Settings",
              icon: (
                <SettingsIcon
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              ),
            },
            {
              text: "Profile",
              icon: (
                <PersonIcon
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              ),
            },
            {
              text: "Logout",
              icon: (
                <Logout sx={{ color: theme.palette.primary.contrastText }} />
              ),
            },
          ].map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      {text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
