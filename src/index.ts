import { Hono } from "hono";
import { attributesRouter } from "./packages/attributes/router";

// program.pipe(
//   Effect.provide(AttributesRepository.Live),
//   Effect.catchTag("ParseError", (e) => Console.error(e.message)),
//   Effect.catchTag("@packages/persistence/StorageError", (e) =>
//     Console.error("Data Store not available")
//   ),
//   Effect.runFork
// );

const app = new Hono();

app.route("/attributes", attributesRouter);

export default {
  port: 8000,
  fetch: app.fetch,
};
