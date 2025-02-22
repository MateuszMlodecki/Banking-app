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
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { theme } from "../../themes/theme";

type ActiveViewType = "Overview" | "Transactions" | "Payment" | "Report";

interface DrawerContentProps {
  handleMenuItemClick: (view: ActiveViewType) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  handleMenuItemClick,
}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

  const bottomMenu = [
    // action:undefined narazie jako placeholder
    {
      text: "Help center",
      icon: <HelpIcon sx={{ color: theme.palette.primary.contrastText }} />,
      action: undefined,
    },
    {
      text: "Settings",
      icon: <SettingsIcon sx={{ color: theme.palette.primary.contrastText }} />,
      action: undefined,
    },
    {
      text: "Profile",
      icon: <PersonIcon sx={{ color: theme.palette.primary.contrastText }} />,
      action: undefined,
    },
    {
      text: "Logout",
      icon: <LogoutIcon sx={{ color: theme.palette.primary.contrastText }} />,
      action: handleLogout,
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
          {bottomMenu.map(({ text, icon, action }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={action}>
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
