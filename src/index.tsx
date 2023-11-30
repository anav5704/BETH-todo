import { Elysia, t } from "elysia"
import { html } from "@elysiajs/html"
import * as elements from "typed-html"
import { ToDo, todos } from "./db/schema"
import { eq } from "drizzle-orm"
import { db } from "./db"

const app = new Elysia().use(html())

app.get("/", ({ html }) =>
    html(
        <BaseHtml>
            <body hx-get="/todos" hx-swap="innerHTML" hx-trigger="load" class="h-screen w-screen flex items-center justify-center flex-col gap-5">
            </body>
        </BaseHtml>
    ))

// Routes  
app.get("/todos", async () => {
    const data = await db.select().from(todos).all()
    return <ToDoList todos={data} />
})

app.post("/todos", async ({ body }) => {
    if (body.content.length === 0) throw new Error("Content cannot be empty")
    const newTodo = await db.insert(todos).values(body).returning().get()
    return <ToDoItem {...newTodo} />
},
    {
        body: t.Object({
            content: t.String()
        })
    })

app.post("/todos/toggle/:id", async ({ params }) => {
    const Oldodo = await db
        .select()
        .from(todos)
        .where(eq(todos.id, params.id))
        .get()

    const newTodo = await db
        .update(todos)
        .set({ completed: !Oldodo?.completed })
        .where(eq(todos.id, params.id))
        .returning()
        .get()

    return <ToDoItem {...newTodo} />
},
    {
        params: t.Object({
            id: t.Numeric()
        })
    })

app.delete("/todos/:id", async ({ params }) => {
    await db.delete(todos).where(eq(todos.id, params.id)).run()
},
    {
        params: t.Object({
            id: t.Numeric()
        })
    })


// Listener
app.listen(3000, () => console.log("Listening to Elysia on  port 3000"))


// Components
const BaseHtml = ({ children }: elements.Children) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BETH todo apps</title>
        <script src="https://unpkg.com/htmx.org@1.9.9" integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX" crossorigin="anonymous"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
        ${children}
    </html>
`

const ToDoItem = ({ id, content, completed }: ToDo) => {
    return (
        <div class="flex flex-row space-x-5 items-center justify-end">
            <p>{content}</p>
            <input id={id} type="checkbox" checked={completed} hx-post={`/todos/toggle/${id}`} hx-target="closest div" hx-swap="outerHTML" />
            <button hx-delete={`/todos/${id}`} hx-swap="outerHTML" hx-target="closest div" class="border rounded-md px-6 py-1 bg-rose-500 text-white hover:bg-rose-600">Delete</button>
        </div >
    )
}

const ToDoList = ({ todos }: { todos: ToDo[] }) => {
    return (
        <div class="flex flex-col gap-y-3">
            {todos.map((todo) => (
                <ToDoItem {...todo} />
            ))}
            <ToDoForm />
        </div>
    )
}

const ToDoForm = () => {
    return (
        <form _="on submit target.reset()" hx-post="/todos" hx-swap="beforebegin" class="flex flex-col space-y-3">
            <input class="py-1 border" type="text" name="content" />
            <button type="submit" class="border rounded-md px-6 py-1 bg-green-500 text-white hover:bg-green-600">Create</button>
        </form>
    )
}