import { Hono } from "hono";
import subjects from "./routes/subjects";
import lessons from "./routes/lessons";
import admin from "./routes/admin";

const app = new Hono<{ Bindings: Env }>();

app.route("/api/subjects", subjects);
app.route("/api/lessons", lessons);
app.route("/api/admin", admin);

export default app;
