import { Data } from "effect";

export class InsufficentStock extends Data.TaggedError(
  "@packages/products/errors/InsufficentStock"
) {}
