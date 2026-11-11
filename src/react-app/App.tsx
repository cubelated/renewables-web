import "./index.css";
import LandingPage from "../pages/LandingPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.tsx";
import TermsPage from "../pages/TermsPage.tsx";
import SupportPage from "../pages/SupportPage.tsx";
import ExpiryCalculatorPage from "../pages/ExpiryCalculatorPage.tsx";
import { normalizePath } from "../seo.ts";

type AppProps = {
  path?: string;
};

export default function App({ path }: AppProps) {
  const currentPath = normalizePath(
    path ??
      (typeof window === "undefined" ? "/" : window.location.pathname),
  );

  if (currentPath === "/") return <LandingPage />;
  if (currentPath === "/privacy") return <PrivacyPolicyPage />;
  if (currentPath === "/terms") return <TermsPage />;
  if (currentPath === "/support") return <SupportPage />;
  if (currentPath === "/tools/expiry-calculator") return <ExpiryCalculatorPage />;

  return <NotFoundPage />;
}
