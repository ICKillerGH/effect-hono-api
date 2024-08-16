import { Hono } from "hono";
import { Attribute } from "./repositories/attributes-repository";
import { Effect } from "effect";
import { createAttribute } from "./services/create-attribute";
import { handleParseError, runtime } from "../shared/runtime";
import { getAttributes } from "./services/get-attributes";
import { validateSchema } from "../shared/middleware";

const attributesRouter = new Hono();

attributesRouter.get("/", async (c) => {
  const effect = Effect.gen(function* () {
    return c.json(yield* getAttributes());
  }).pipe(Effect.catchTag("ParseError", handleParseError(c)));

  return runtime.runPromise(effect);
});

attributesRouter.post("/", validateSchema("json", Attribute), (c) => {
  const effect = Effect.gen(function* () {
    const data = c.req.valid("json");

    yield* createAttribute(data);

    return c.json(data);
  });

  return runtime.runPromise(effect);
});

export { attributesRouter };
