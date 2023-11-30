import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core"
import { InferSelectModel  } from "drizzle-orm";

export const todos = sqliteTable("todos" ,{
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
}) 

export type ToDo = InferSelectModel<typeof todos>