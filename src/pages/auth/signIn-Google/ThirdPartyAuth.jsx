import { Button } from "react-bootstrap";
import IconifyIcon from "../../../components/wrappers/IconifyIcon";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const ThirdPartyAuth = () => {
  const navigate = useNavigate();

  // 🔹 Function to open centered popup
  const openPopup = (url) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      "OAuth Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // 🔹 Google Handler
  const handleGoogle = () => {
    openPopup(`${BACKEND_URL}/auth/google/start`);
  };

  // 🔹 Microsoft Handler
  const handleMicrosoft = () => {
    openPopup(`${BACKEND_URL}/auth/microsoft/start`);
  };

  // 🔹 Listen for OAuth success message
  useEffect(() => {
    const receiveMessage = (event) => {
      // 🔐 SECURITY: Only accept from backend
      if (event.origin !== BACKEND_URL) return;

      if (event.data.message === "oauth_success") {
        const token = event.data.token;

        // Save JWT
        localStorage.setItem("access_token", token);

        // Redirect to dashboard
        navigate("/dashboard");
      }
    };

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [navigate]);

  return (
    <>
      <p className="mt-3 fw-semibold no-span">OR sign with</p>

      <div className="text-center d-flex gap-1 justify-content-center">
        <Button variant="light" className="shadow-none" onClick={handleGoogle}>
          <IconifyIcon icon="bxl:google" height={20} width={20} />
        </Button>

        <Button variant="light" className="shadow-none" onClick={handleMicrosoft}>
          <IconifyIcon icon="bxl:microsoft" height={20} width={20} />
        </Button>
      </div>
    </>
  );
};

export default ThirdPartyAuth;
