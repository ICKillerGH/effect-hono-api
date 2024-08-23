import { Data } from "effect";

export class ProductNotFound extends Data.TaggedError(
  "@packages/products/errors/ProductNotFound"
) {}
