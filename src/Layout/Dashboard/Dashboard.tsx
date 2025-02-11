import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { Overview } from "../../components/DashboardComponents/Overview";
import { Transactions } from "../../components/DashboardComponents/Transactions";
import { Payment } from "../../components/DashboardComponents/Payment";
import { Report } from "../../components/DashboardComponents/Report";
import { Logout } from "@mui/icons-material";

/*
Jak zrobic responsywny Drawer, opcje:
1. Albo za pomoca css zrobic go responsywny
  + jak bede skalowal strone to bedzie sie plynnie zmienial
  - duzo zabawy css'em, prawdopodbnie bolesnej, ale tez jednorazowej :')
2. Zrobic dwie wersje drawera - desktop, mobile (dwa oddzielne komponenty)
  + odizolowanie logiki
  + prostszy kod
  - jak bede skalowal strone to bede musial zrefreshowac, zeby zaladowalo mi mobile drawer ponizej
  okreslonej rozdzielczosci


w obydwu opcjach rozbij to na komponenty, mozesz stylowac elementy Mui za pomoca styled();
najlepiej nie zmieniac za bardzo nazw, tj
import {Button as MuiButton}

export const Button = styled(MuiButton) itd....
*/

const drawerWidth = 240;

type ActiveViewType = "Overview" | "Transactions" | "Payment" | "Report";

export const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [activeView, setActiveView] =
    React.useState<ActiveViewType>("Overview");

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleMenuItemClick = (view: ActiveViewType) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  const activeViewObjMap: Record<ActiveViewType, JSX.Element> = {
    Overview: <Overview />,
    Payment: <Payment />,
    Report: <Report />,
    Transactions: <Transactions />,
  };

  const menuList: { text: ActiveViewType; icon: JSX.Element }[] = [
    {
      text: "Overview",
      icon: <DashboardIcon sx={{ color: "#F7F5F2" }} />,
    },
    {
      text: "Transactions",
      icon: <AccountBalanceIcon sx={{ color: "#F7F5F2" }} />,
    },
    {
      text: "Payment",
      icon: <PaymentIcon sx={{ color: "#F7F5F2" }} />,
    },
    {
      text: "Report",
      icon: <AssessmentIcon sx={{ color: "#F7F5F2" }} />,
    },
  ];

  const theme = useTheme();

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#F7F5F2",
        backgroundColor: theme.palette.background.paper,
        height: "100%",
      }}
    >
      <Box>
        <Toolbar>
          <Typography
            sx={{
              marginX: "auto",
              padding: 2,
              textAlign: "center",
              color: "#F7F5F2",
            }}
          >
            John Doe
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: "#444" }} />
        <List>
          {menuList.map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleMenuItemClick(text)}
                sx={{
                  textAlign: "center",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ color: "#F7F5F2" }}>{text}</Typography>
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
              icon: <HelpIcon sx={{ color: "#F7F5F2" }} />,
            },
            {
              text: "Settings",
              icon: <SettingsIcon sx={{ color: "#F7F5F2" }} />,
            },
            { text: "Profile", icon: <PersonIcon sx={{ color: "#F7F5F2" }} /> },
            { text: "Logout", icon: <Logout sx={{ color: "#F7F5F2" }} /> },
          ].map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ color: "#F7F5F2" }}>{text}</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "#222222",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              background: "#222222",
              borderRadius: "50%",
              padding: "8px",
              "&:hover": { background: "#444" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#F7F5F2", fontWeight: "bold" }}
          >
            BankingApp dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1c1c1c",
              color: "#F7F5F2",
              borderRight: "2px solid #444",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1c1c1c",
              color: "#F7F5F2",
              borderRight: "2px solid #444",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#222222",
          marginTop: "64px",
          overflow: "hidden",
        }}
      >
        <Toolbar />
        {activeViewObjMap[activeView]}
      </Box>
    </Box>
  );
};
