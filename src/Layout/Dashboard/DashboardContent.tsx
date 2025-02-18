import React from "react";
import { Overview } from "../../components/DashboardComponents/Overview";
import { Transactions } from "../../components/DashboardComponents/Transactions";
import { Payment } from "../../components/DashboardComponents/Payment";
import { Report } from "../../components/DashboardComponents/Report";
import { ActiveViewType } from "../../types/types";
import { Box } from "@mui/material";
import { drawerWidth } from "../../utils/constants";

interface ActiveViewRendererProps {
  activeView: ActiveViewType;
}

export const DashboardContent: React.FC<ActiveViewRendererProps> = ({
  activeView,
}) => {
  const activeViewObjMap: Record<ActiveViewType, JSX.Element> = {
    Overview: <Overview />,
    Payment: <Payment />,
    Report: <Report />,
    Transactions: <Transactions />,
  };

  return (
    <Box sx={{ marginLeft: { xs: 0, sm: drawerWidth } }}>
      {activeViewObjMap[activeView]}
    </Box>
  );
};
