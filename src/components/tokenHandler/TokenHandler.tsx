// src/components/TokenHandler.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TokenHandler = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");

    if (tokenFromURL) {
      Cookies.set("token", tokenFromURL, { expires: 7 }); // Store for 7 days
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete("token");

      // Redirect to same page without token in URL
      navigate({
        pathname: location.pathname,
        search: newSearchParams.toString(),
      }, { replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
};

export default TokenHandler;
