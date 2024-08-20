import { Effect, Layer } from "effect";
import { DrizzleService } from "../../database/services/database-service";
import { attributes } from "../../database/schema";
import { Attribute } from "../types/attribute";

const makeRepository = Effect.gen(function* () {
  const db = yield* DrizzleService;

  const findByCriteria = () =>
    Effect.gen(function* () {
      const results = yield* db.select().from(attributes);

      return yield* Attribute.encodeArray(results);
    });

  const save = (attribute: Attribute) =>
    Effect.gen(function* () {
      yield* db
        .insert(attributes)
        .values(attribute)
        .onDuplicateKeyUpdate({ set: attribute });

      return yield* Attribute.encode(attribute);
    });

  return {
    findByCriteria,
    save,
  };
});

export class AttributesRepository extends Effect.Tag(
  "@packages/attributes/AttributesRepository"
)<AttributesRepository, Effect.Effect.Success<typeof makeRepository>>() {
  static readonly Live = Layer.effect(this, makeRepository).pipe(
    Layer.provide(DrizzleService.Live)
  );
}
