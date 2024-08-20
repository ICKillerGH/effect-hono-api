import { Schema } from "@effect/schema";

export class OrderItem extends Schema.Class<OrderItem>(
  "@packages/orders/types/OrderItem"
)({
  quantity: Schema.Positive,
  productId: Schema.UUID,
  productName: Schema.NonEmptyString,
  productImage: Schema.NonEmptyString,
  productPrice: Schema.Positive,
  logo: Schema.NonEmptyString,
  logoPositionId: Schema.UUID,
}) {}

export class Order extends Schema.Class<Order>("@packages/orders/types/Order")({
  id: Schema.UUID.pipe(Schema.brand("OrderId")),
  number: Schema.Positive,
  status: Schema.Union(
    Schema.Literal("processing"),
    Schema.Literal("cancelled"),
    Schema.Literal("completed")
  ),
  storeId: Schema.UUID,
  customerId: Schema.UUID,
  items: Schema.NonEmptyArray(OrderItem),
  //   billingInfo: BillingInfo;
  total: Schema.Positive,
  createdAt: Schema.DateFromString,
}) {
  static readonly encode = Schema.encode(this);
}
