import { Effect } from "effect";
import { ProductsRepository } from "../products-repository";
import type { Product } from "../types/product";
import { ProductNotFound } from "../errors/product-not-found";

export const decreaseProductStock = (id: Product.ProductId, by: number) =>
  Effect.gen(function* () {
    const product = yield* yield* ProductsRepository.findProductById(id);

    const updatedProduct = yield* product.decreaseStock(by);

    return yield* ProductsRepository.save(updatedProduct);
  }).pipe(
    Effect.catchTag("NoSuchElementException", () => new ProductNotFound())
  );
