import { timestamp } from "drizzle-orm/pg-core";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
export const todosTable = pgTable("todo", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todo:text().notNull(),
  createdAt:timestamp('created_at').notNull().defaultNow(),
  updatedAt:timestamp('updated_at').$onUpdate(()=>new Date()),
});