import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core"
import { InferModel  } from "drizzle-orm";

export const todos = sqliteTable("todos" ,{
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
}) 

export type Todo = InferModel<typeof todos>