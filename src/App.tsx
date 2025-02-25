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
				path: "/stepper",
				element: <StepperParent />,
			},
			{ path: "/dashboard", element: <Dashboard /> },
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
