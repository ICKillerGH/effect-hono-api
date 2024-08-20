import { Schema } from "@effect/schema";

export class Product extends Schema.Class<Product>(
  "@packages/products/Product"
)({
  id: Schema.UUID.pipe(Schema.brand("ProductId")),
  stock: Schema.Int.pipe(Schema.positive()),
}) {}

export namespace Product {
  export type ProductId = Product["id"];
}
