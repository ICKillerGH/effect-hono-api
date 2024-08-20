import { Effect } from "effect";
import { OrdersRepository } from "../orders-repository";
import type { Order } from "../types/order";

export const createOrder = (order: Order) =>
  Effect.gen(function* () {
    // check product stock

    return yield* OrdersRepository.save(order);
  });
