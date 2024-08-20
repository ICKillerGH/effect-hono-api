import { Effect } from "effect";
import { ProductsRepository } from "../products-repository";
import type { Product } from "../types/product";
import { InsufficentStock } from "../errors/insufficent-stock";

export const decreaseProductStock = (id: Product.ProductId, by: number) =>
  Effect.gen(function* () {    
    const hasEnoughStock = yield* ProductsRepository.hasEnoughStock(id);

    if (hasEnoughStock) {
      return yield* new InsufficentStock();
    }

    

    yield* ProductsRepository.

    return yield* Effect.void;
  });
