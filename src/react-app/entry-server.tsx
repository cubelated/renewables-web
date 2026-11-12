import { renderToString } from "react-dom/server";
import App from "./App";

export { getPageSeo, getPageModifiedOn, INDEXED_PATHS, SITE_URL } from "../seo";
export { ocrVideo } from "../content/ocr-video";
export { renderSeoHead } from "../lib/seo-head";

export function render(pathname: string): string {
  return renderToString(<App path={pathname} />);
}
