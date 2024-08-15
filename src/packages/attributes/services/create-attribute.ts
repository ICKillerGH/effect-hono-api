import { Effect } from "effect";
import {
  Attribute,
  AttributesRepository,
} from "../repositories/attributes-repository";

export const createAttribute = (attribute: Attribute) =>
  Effect.gen(function* () {
    const repository = yield* AttributesRepository;

    yield* repository.save(attribute);
  });
