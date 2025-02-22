import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children?: ReactNode;
  redirectIfAuthenticated?: boolean;
}

export const AuthGuard = ({
  children,
  redirectIfAuthenticated = false,
}: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (children) navigate("/login");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          if (redirectIfAuthenticated) navigate("/Dashboard");
        } else {
          localStorage.removeItem("token");
          if (children) navigate("/login");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
        if (children) navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [navigate, redirectIfAuthenticated, children]);

  if (isLoading) return <p>Loading...</p>;

  return <>{children}</>;
};
