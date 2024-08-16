import { drizzle } from "drizzle-orm/mysql2";
import { Context, Data, Effect, Layer } from "effect";
import mysql from "mysql2/promise";

export class DatabaseConnectionError extends Data.TaggedError(
  "@packages/database/DatabaseConnectionError"
) {}

export const makeConnection = Effect.tryPromise({
  try: async () =>
    mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "tu_estampa",
      // database: "estampa_effect",
    }),
  catch: () => new DatabaseConnectionError(),
});

export class ConnectionService extends Context.Tag(
  "@packages/database/ConnectionService"
)<ConnectionService, Effect.Effect.Success<typeof makeConnection>>() {
  static readonly Live = Layer.effect(this, makeConnection);
}

const makeDrizzle = Effect.gen(function* () {
  const connection = yield* ConnectionService;

  return drizzle(connection);
});

export class DrizzleService extends Context.Tag(
  "@packages/database/DrizzleService"
)<DrizzleService, Effect.Effect.Success<typeof makeDrizzle>>() {
  static readonly Live = Layer.effect(this, makeDrizzle).pipe(
    Layer.provide(ConnectionService.Live)
  );
}
