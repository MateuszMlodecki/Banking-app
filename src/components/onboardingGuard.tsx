import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserDetails } from "../types/types";
import { CircularProgress } from "@mui/material";

export const OnboardingGuard = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const onboardingCompleted =
        localStorage.getItem("onboardingCompleted") === "true";

      if (onboardingCompleted && token && userId) {
        setIsOnboardingComplete(true);
        setLoading(false);
        return;
      }

      if (!token || !userId) {
        setIsOnboardingComplete(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get<UserDetails>(
          `http://localhost:4000/user/profile/${userId}`,
        );
        setIsOnboardingComplete(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setIsOnboardingComplete(false);
          } else if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setIsOnboardingComplete(false);
          } else {
            console.error("Unexpected error:", error);
            setIsOnboardingComplete(false);
          }
        } else {
          console.error("Unknown error:", error);
          setIsOnboardingComplete(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <CircularProgress />;

  return isOnboardingComplete ? <Outlet /> : <Navigate to="/user/profile" />;
};
