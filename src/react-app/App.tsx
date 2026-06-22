import "./index.css";
import LandingPage from "../pages/LandingPage.tsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.tsx";
import TermsPage from "../pages/TermsPage.tsx";
import SupportPage from "../pages/SupportPage.tsx";

export default function App() {
  const path = window.location.pathname;

  if (path === "/privacy") return <PrivacyPolicyPage />;
  if (path === "/terms") return <TermsPage />;
  if (path === "/support") return <SupportPage />;

  return <LandingPage />;
}
