import { Hono } from "hono";
import attributesRouter from "./packages/attributes/router";

const app = new Hono();

app.route("/attributes", attributesRouter);

export default {
  port: 8000,
  fetch: app.fetch,
};
