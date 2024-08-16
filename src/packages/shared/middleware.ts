import type { Schema } from "@effect/schema";
import { decodeUnknownEither } from "@effect/schema/Schema";
import { Either, pipe } from "effect";
import { validator } from "hono/validator";

type ValidatorFrom = "cookie" | "form" | "json" | "query" | "param";

export function validateSchema<A, I>(
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
