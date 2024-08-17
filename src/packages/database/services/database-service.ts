import * as MysqlDrizzle from "@effect/sql-drizzle/Mysql";
import { MysqlClient } from "@effect/sql-mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import { Config, Context, Data, Effect, Layer, Redacted } from "effect";
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

export const MysqlLive = MysqlClient.layer({
  host: Config.string("DATABASE_HOST"),
  database: Config.string("DATABASE_NAME"),
  username: Config.string("DATABASE_USER"),
  password: Config.succeed(Redacted.make("DATABASE_PASSWORD")),
  // transformQueryNames: Config.succeed(String.camelToSnake),
  // transformResultNames: Config.succeed(String.snakeToCamel),
});

export const DrizzleLive = MysqlDrizzle.layer.pipe(Layer.provide(MysqlLive));
