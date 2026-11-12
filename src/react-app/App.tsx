import "./index.css";
import { useEffect, useSyncExternalStore } from "react";
import LandingPage from "../pages/LandingPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.tsx";
import TermsPage from "../pages/TermsPage.tsx";
import SupportPage from "../pages/SupportPage.tsx";
import ExpiryCalculatorPage from "../pages/ExpiryCalculatorPage.tsx";
import ResourceDirectoryPage from "../pages/ResourceDirectoryPage";
import ResourceGuidePage from "../pages/ResourceGuidePage";
import { resolveResourcePath } from "../content/resources/guides";
import { getPageSeo, normalizePath } from "../seo.ts";
import { calculatorLocaleForPath } from "../content/calculator-locales";
import { applyDocumentSeo } from "../lib/seo-head";

type AppProps = {
  path?: string;
};

function subscribePath(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
const clientPath = () => normalizePath(window.location.pathname);

export default function App({ path }: AppProps) {
  const currentPath = useSyncExternalStore(subscribePath, clientPath, () => normalizePath(path ?? "/"));
  useEffect(() => { applyDocumentSeo(getPageSeo(currentPath)); }, [currentPath]);
  const calculatorLocale = calculatorLocaleForPath(currentPath);
  const resource = resolveResourcePath(currentPath);

  if (currentPath === "/") return <LandingPage />;
  if (currentPath === "/privacy") return <PrivacyPolicyPage />;
  if (currentPath === "/terms") return <TermsPage />;
  if (currentPath === "/support") return <SupportPage />;
  if (calculatorLocale) return <ExpiryCalculatorPage language={calculatorLocale.language} />;
  if (resource?.guide) return <ResourceGuidePage guide={resource.guide} language={resource.language} />;
  if (resource) return <ResourceDirectoryPage language={resource.language} />;

  return <NotFoundPage />;
}
