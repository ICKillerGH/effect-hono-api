import { Schema } from "@effect/schema";
import { Context, Effect, Layer } from "effect";
import { StorageError } from "../../persistence/persistence-service";

export const Attribute = Schema.Struct({
  id: Schema.UUID,
  name: Schema.NonEmptyString,
  type: Schema.Union(Schema.Literal("color"), Schema.Literal("label")),
  isActive: Schema.Boolean,
  createdAt: Schema.DateFromString,
  deletedAt: Schema.NullOr(Schema.DateFromString),
});

export type Attribute = Schema.Schema.Type<typeof Attribute>;

const attributes: Attribute[] = [];

const makeRepository = Effect.gen(function* () {
  const db = yield* Effect.tryPromise({
    try: async () => {
      // throw new Error();
      return "the query";
    },
    catch: () => new StorageError(),
  });

  return {
    findByCriteria: () => Effect.succeed(attributes),
    save: (attribute: Attribute) =>
      Effect.sync(() => {
        attributes.push(attribute);
        console.log("Saved!");
      }),
  };
});

export class AttributesRepository extends Context.Tag(
  "@packages/attributes/AttributesRepository"
)<AttributesRepository, Effect.Effect.Success<typeof makeRepository>>() {
  static readonly Live = Layer.effect(this, makeRepository);
}
