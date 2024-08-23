import { Schema } from "@effect/schema";
import { Effect } from "effect";
import { InsufficentStock } from "../errors/insufficent-stock";

export class Product extends Schema.Class<Product>(
  "@packages/products/types/Product"
)({
  id: Schema.UUID.pipe(Schema.brand("ProductId")),
  stock: Schema.Int.pipe(Schema.positive()),
}) {
  decreaseStock = (by: number) =>
    Effect.gen(this, function* () {
      if (by > this.stock) {
        return yield* new InsufficentStock();
      }

      const newStock = this.stock - by;

      return yield* Product.decode({ ...this, stock: newStock });
    });

  static readonly decode = Schema.decode(this);

  static readonly encode = Schema.encode(this);
}

export namespace Product {
  export type ProductId = Product["id"];
}
