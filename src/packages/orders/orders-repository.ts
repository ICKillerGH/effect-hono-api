import { Effect, Layer } from "effect";
import { DrizzleService } from "../database/services/database-service";
import { Order } from "./types/order";

const orders: Order[] = [];

const makeRepository = Effect.gen(function* () {
  const _ = yield* DrizzleService;

  const save = (order: Order) =>
    Effect.gen(function* () {
      orders.push(order);

      return yield* Order.encode(order);
    });

  return {
    save,
  };
});

export class OrdersRepository extends Effect.Tag(
  "@packages/orders/OrdersRepository"
)<OrdersRepository, Effect.Effect.Success<typeof makeRepository>>() {
  static readonly Live = Layer.effect(this, makeRepository);
}
