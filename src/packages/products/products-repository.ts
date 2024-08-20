import { Effect, Layer } from "effect";
import { DrizzleService } from "../database/services/database-service";
import type { Product } from "./types/product";

const makeRepository = Effect.gen(function* () {
  const _ = yield* DrizzleService;

  const hasEnoughStock = (_: Product) => Effect.sync(() => Math.random() > 0.5);

  return { hasEnoughStock };
});

export class ProductsRepository extends Effect.Tag(
  "@packages/products/ProductsRepository"
)<ProductsRepository, Effect.Effect.Success<typeof makeRepository>>() {
  static readonly Live = Layer.effect(this, makeRepository);
}
