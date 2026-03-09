import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState<{ role: string; username: string } | null>(
    null,
  );

  const checkAuth = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("access_token");
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return { user, isLoggedIn: !!user };
};
