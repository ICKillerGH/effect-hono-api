import { Effect, Layer, Option } from "effect";
import { DrizzleService } from "../database/services/database-service";
import { Product } from "./types/product";

const makeRepository = Effect.gen(function* () {
  const _ = yield* DrizzleService;

  const findProductById = (
    _: Product.ProductId
  ): Effect.Effect<Option.Option<Product>, never, never> =>
    Effect.sync(() => {
      return Option.fromNullable(null);
    });

  const save = (product: Product) =>
    Effect.gen(function* () {
      return yield* Product.encode(product);
    });

  return { findProductById, save };
});

export class ProductsRepository extends Effect.Tag(
  "@packages/products/ProductsRepository"
)<ProductsRepository, Effect.Effect.Success<typeof makeRepository>>() {
  static readonly Live = Layer.effect(this, makeRepository);
}
