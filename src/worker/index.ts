import { Hono } from "hono";
import { serveVideo } from "./video";
import { ocrVideo } from "../content/ocr-video";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));
app.on(["GET", "HEAD"], "/media/ocr-demo.mp4", (c) => serveVideo(c.req.raw, c.env.ASSETS, ocrVideo.byteLength));

export default app;
