import { Schema } from "@effect/schema";
import { Effect, flow } from "effect";

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

export class Attribute extends Schema.Class<Attribute>(
  "@packages/attributes/Attribute"
)({
  id: Schema.UUID.pipe(Schema.brand("AttributeId")),
  name: Schema.NonEmptyString,
  type: AttributeTypeTransform,
  isActive: Schema.Boolean,
  createdAt: Schema.DateFromString,
  deletedAt: Schema.NullOr(Schema.DateFromString),
}) {
  static readonly encode = Schema.encode(this);

  static readonly encodeArray = flow(
    Schema.encode(Schema.Array(this)),
    Effect.map(
      (todos): ReadonlyArray<Schema.Schema.Encoded<typeof Attribute>> => todos
    )
  );
}

export namespace Attribute {
  export type AttributeId = Attribute["id"];
}
