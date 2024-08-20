import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import type { Attribute } from "../attributes/types/attribute";

export const attributes = mysqlTable("attributes_attributes", {
  id: varchar("id", { length: 36 }).primaryKey().$type<Attribute.AttributeId>(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 20, enum: ["label", "color"] }).notNull(),
  isActive: boolean("is_active").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
