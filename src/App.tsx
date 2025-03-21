import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Register } from "./pages/FormAuth/Register/Register";
import { Login } from "./pages/FormAuth/Login/Login";
import { LandingPage } from "./Layout/LandingPage/LandingPage";
import { UserDetailsProvider } from "./context/UserContext";
import { StepperParent } from "./pages/UserDetails/StepperParent";
import { ThemeProvider } from "@mui/material";
import { theme } from "./themes/theme";
import { Layout } from "./Layout/UserLayout/Layout";
import { AuthGuard } from "./components/AuthGuard";
import { Transactions } from "./pages/UserPages/Transactions";
import { Reports } from "./pages/UserPages/Report";
import { Payment } from "./pages/UserPages/Payment";
import { OnboardingGuard } from "./components/onboardingGuard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/user",
        element: <Layout />,
        children: [
          {
            path: "/user/profile",
            element: <StepperParent />,
          },
          {
            element: <OnboardingGuard />,
            children: [
              { path: "/user/dashboard", element: <div> dashboarrd</div> },
              { path: "/user/transactions", element: <Transactions /> },
              { path: "/user/reports", element: <Reports /> },
              { path: "/user/payments", element: <Payment /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <UserDetailsProvider>
          <RouterProvider router={router} />
        </UserDetailsProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
