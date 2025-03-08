import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const OnboardingGuard = () => {
	const [isOnboardingComplete, setIsOnboardingComplete] = useState<
		boolean | null
	>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserDetails = async () => {
			const token = localStorage.getItem("token");
			const userId = localStorage.getItem("userId");

			if (!token || !userId) {
				setIsOnboardingComplete(false);
				setLoading(false);
				return;
			}

			try {
				const { data } = await axios.get(
					`http://localhost:4000/user/profile/${userId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				const isComplete =
					data.firstName &&
					data.lastName &&
					data.dateOfBirth &&
					data.streetName &&
					data.streetNumber &&
					data.accountNumber &&
					data.bankName &&
					data.city;

				setIsOnboardingComplete(isComplete);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					if (error.response?.status === 401) {
						console.error("Unauthorized access, redirecting to login.");
						localStorage.removeItem("token");
						localStorage.removeItem("userId");
						setIsOnboardingComplete(false);
					} else {
						console.error(
							"Axios error:",
							error.response?.data?.message || error.message
						);
					}
				} else {
					console.error("Unexpected error:", error);
				}
				setIsOnboardingComplete(false);
			} finally {
				setLoading(false);
			}
		};

		fetchUserDetails();
	}, []);

	if (loading) return null;

	return isOnboardingComplete ? <Outlet /> : <Navigate to="/user/profile" />;
};
