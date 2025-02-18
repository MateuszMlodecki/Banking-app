import React from "react";
import { Drawer } from "@mui/material";
import { DrawerContent } from "./DrawerContent";
import { ActiveViewType } from "../../types/types";
import { theme } from "../../themes/theme";
import { drawerWidth } from "../../utils/constants";

interface DrawerComponentProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  handleMenuItemClick: (view: ActiveViewType) => void;
}

export const DrawerComponent: React.FC<DrawerComponentProps> = ({
  mobileOpen,
  handleDrawerToggle,
  handleMenuItemClick,
}) => {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            borderRight: "2px solid",
            borderColor: theme.palette.grey[800],
          },
        }}
      >
        <DrawerContent handleMenuItemClick={handleMenuItemClick} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            borderRight: "2px solid",
            borderColor: theme.palette.grey[800],
          },
        }}
        open
      >
        <DrawerContent handleMenuItemClick={handleMenuItemClick} />
      </Drawer>
    </>
  );
};
