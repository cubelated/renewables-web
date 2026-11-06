import { renderToString } from "react-dom/server";
import App from "./App";

export { getPageSeo, INDEXED_PATHS } from "../seo";
export { ocrVideo } from "../content/ocr-video";

export function render(pathname: string): string {
  return renderToString(<App path={pathname} />);
}
