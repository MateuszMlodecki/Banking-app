import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthGuard = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkToken = async () => {
			try {
				const token = localStorage.getItem("token");
				const pathname = window.location.pathname.split("/")[1];
				const isLendingPage = pathname === "";
				const isLoginPage = pathname === "login";
				const isRegisterPage = pathname === "register";

				const isAuthPage = isLendingPage || isLoginPage || isRegisterPage;

				if (!token && !isAuthPage) {
					navigate("/login");
					return;
				}

				if (token) {
					const response = await fetch("http://localhost:4000/validate-token", {
						headers: { Authorization: `Bearer ${token}` },
					});

					if (response.status === 200 && isAuthPage) {
						navigate("/dashboard");
						return;
					}

					//pobieranie profilu
					// jak bedzie obecny to po prostu return;
					// jak nie bedzie profilu to przekieruj do /stepper'a
					// mozesz dodac w localStorage cos w stylu onboardingCompleted: boolean
					// jesli jest profil uzupelniony to zapisz to w localStorage, zeby nie robic w kolko zbednych requestow
				}
			} catch {
				localStorage.removeItem("token");
				navigate("/login");
			} finally {
				setIsLoading(false);
			}
		};

		checkToken();
	}, [navigate]);

	if (isLoading) return <CircularProgress />;

	return (
		<>
			<Outlet />
		</>
	);
};
