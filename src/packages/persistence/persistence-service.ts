import { Data } from "effect";

export class StorageError extends Data.TaggedError(
  "@packages/persistence/StorageError"
) {}
