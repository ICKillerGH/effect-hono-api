import { Hono } from "hono";
import { Effect } from "effect";
import { createAttribute } from "./services/create-attribute";
import { runtime } from "../shared/runtime";
import { getAttributes } from "./services/get-attributes";
import { validateSchema } from "../shared/middleware";
import { handleParseError, handleSqlError } from "../shared/lib";
import { Attribute } from "./types/attribute";
import { getOneAttributeById } from "./services/get-one-attribute-by-id";

const attributesRouter = new Hono();

attributesRouter.get("/", (c) => {
  const effect = Effect.gen(function* () {
    return c.json(yield* getAttributes());
  }).pipe(
    Effect.catchTags({
      ParseError: handleParseError(c),
      SqlError: handleSqlError(c),
    })
  );

  return runtime.runPromise(effect);
});

attributesRouter.post("/", validateSchema("json", Attribute), (c) => {
  const effect = Effect.gen(function* () {
    const data = yield* createAttribute(c.req.valid("json"));

    return c.json(data);
  });

  return runtime.runPromise(effect);
});

attributesRouter.get("/:id", (c) => {
  const effect = Effect.gen(function* () {
    const attribute = yield* getOneAttributeById(
      c.req.param("id") as Attribute.AttributeId
    );

    return c.json(attribute);
  });

  return runtime.runPromise(effect);
});

export default attributesRouter;
