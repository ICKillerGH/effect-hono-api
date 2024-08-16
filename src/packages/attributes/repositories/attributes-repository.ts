import { Schema } from "@effect/schema";
import { Context, Effect, flow, Layer } from "effect";
import { DrizzleService } from "../../database/services/database-service";
import { attributes } from "../../database/schema";

const AttributeType = Schema.Union(
  Schema.Literal("color"),
  Schema.Literal("label")
);
type AttributeType = Schema.Schema.Type<typeof AttributeType>;

const AttributeTypeTransform = Schema.transform(Schema.String, AttributeType, {
  strict: true,
  decode: (value) => value as AttributeType,
  encode: (value) => value,
});

export const Attribute = Schema.Struct({
  id: Schema.UUID,
  name: Schema.NonEmptyString,
  type: AttributeTypeTransform,
  isActive: Schema.Boolean,
  createdAt: Schema.DateFromString,
  deletedAt: Schema.NullOr(Schema.DateFromString),
});

export const encodeArray = flow(
  Schema.encode(Schema.Array(Attribute)),
  Effect.map(
    (todos): ReadonlyArray<Schema.Schema.Encoded<typeof Attribute>> => todos
  )
);

export type Attribute = Schema.Schema.Type<typeof Attribute>;

const makeRepository = Effect.gen(function* () {
  const db = yield* DrizzleService;

  const findByCriteria = () =>
    Effect.gen(function* () {
      const results = yield* Effect.promise(() => db.select().from(attributes));

      return yield* encodeArray(results);
    });

  const save = (attribute: Attribute) =>
    Effect.promise(async () => {
      await db
        .insert(attributes)
        .values(attribute)
        .onDuplicateKeyUpdate({ set: attribute });
    });

  return {
    findByCriteria,
    save,
  };
});

export class AttributesRepository extends Context.Tag(
  "@packages/attributes/AttributesRepository"
)<AttributesRepository, Effect.Effect.Success<typeof makeRepository>>() {
  static readonly Live = Layer.effect(this, makeRepository).pipe(
    Layer.provide(DrizzleService.Live)
  );
}
