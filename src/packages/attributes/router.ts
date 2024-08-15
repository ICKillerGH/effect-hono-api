import { Hono } from "hono";
import { Attribute } from "./repositories/attributes-repository";
import { Effect, Either, pipe } from "effect";
import { createAttribute } from "./services/create-attribute";
import { decodeUnknownEither } from "@effect/schema/Schema";
import { runtime } from "../../lib/runtime";
import { validator } from "hono/validator";
import type { Schema } from "@effect/schema";
import { getAttributes } from "./services/get-attributes";

const attributesRouter = new Hono();

type ValidatorFrom = "cookie" | "form" | "json" | "query" | "param";

function validateSchema<A, I>(
  from: ValidatorFrom,
  schema: Schema.Schema<A, I, never>
) {
  return validator(from, (value, c) => {
    return pipe(
      value,
      decodeUnknownEither(schema),
      Either.getOrElse((left) => c.json({ [left.name]: [left.message] }))
    );
  });
}

attributesRouter.get("/", (c) => {
  const effect = Effect.gen(function* () {
    return c.json(yield* getAttributes());
  });

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
