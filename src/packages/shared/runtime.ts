import { Data, Effect, ManagedRuntime } from "effect";
import { AttributesRepository } from "../attributes/repositories/attributes-repository";
import type { ParseError } from "@effect/schema/ParseResult";
import type { Context } from "hono";

export const runtime = ManagedRuntime.make(AttributesRepository.Live);

export const handleParseError = (c: Context) => (e: ParseError) =>
  Effect.succeed(c.json({ [e.name]: [e.message] }, 400));

export class JsonParseError extends Data.TaggedError(
  "@packages/shared/JsonParseError"
) {}
