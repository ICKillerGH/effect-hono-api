import type { ParseError } from "@effect/schema/ParseResult";
import { Effect } from "effect";
import type { Context } from "hono";

export const handleParseError = (c: Context) => (e: ParseError) =>
  Effect.sync(() => c.json({ [e.name]: [e.message] }, 400));

export const handleSqlError = (c: Context) => () =>
  Effect.sync(() => c.json({ message: "Internal Server Error" }, 500));
