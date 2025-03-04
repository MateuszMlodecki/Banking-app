import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Register } from "./pages/FormAuth/Register/Register";
import { Login } from "./pages/FormAuth/Login/Login";
import { LandingPage } from "./Layout/LandingPage/LandingPage";
import { UserDetailsProvider } from "./context/UserContext";
import { StepperParent } from "./pages/UserDetails/StepperParent";
import { ThemeProvider } from "@mui/material";
import { theme } from "./themes/theme";
import { Dashboard } from "./Layout/Dashboard/Dashboard";
import { AuthGuard } from "./components/AuthGuard";
import { Transactions } from "./components/DashboardComponents/Transactions";
import { Reports } from "./components/DashboardComponents/Report";
import { Payment } from "./components/DashboardComponents/Payment";

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
				element: <Dashboard />,
				children: [
					//tu powinien byc drugi guard, ktory sprawdza czy onboardingCompleted jest true
					//jesli nie to przekieruj na /user/profile
					{ path: "/user/transactions", element: <Transactions /> },
					{ path: "/user/reports", element: <Reports /> },
					{ path: "/user/payments", element: <Payment /> },
					{
						path: "/user/profile",
						element: <StepperParent />,
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
