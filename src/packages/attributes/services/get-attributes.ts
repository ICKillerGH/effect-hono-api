import { Effect } from "effect";
import { AttributesRepository } from "../repositories/attributes-repository";

export const getAttributes = () =>
  Effect.gen(function* () {
    const repository = yield* AttributesRepository;

    return yield* repository.findByCriteria();
  });
