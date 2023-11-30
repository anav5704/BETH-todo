import { Elysia, t } from "elysia"
import { html } from '@elysiajs/html'
import * as elements from "typed-html"

const app = new Elysia().use(html())

app.get("/", ({ html }) =>
    html(
        <BaseHtml>
            <body hx-get="/todos" hx-swap="innerHTML" hx-trigger="load" class="h-screen w-screen flex items-center justify-center flex-col gap-5">
            </body>
        </BaseHtml>
    ))

// Routes  
app.get("/todos", () => <ToDoList todos={db} />)

app.post("/todos    ", ({ body }) => {
    if (body.content.length === 0) throw new Error("Content cannot be empty")
    const newTodo = {
        id: db.length ++,
        content: body.content,
        completed: false,
    }
    db.push(newTodo)
    return <ToDoItem {...newTodo} />
},
    {
        body: t.Object({
            content: t.String()
        })
    })

app.post("/todos/toggle/:id", ({ params }) => {
    const todo = db.find((todo) => todo.id === params.id)
    if (todo) {
        todo.completed = !todo.completed
        return <ToDoItem {...todo} />
    }
},
    {
        params: t.Object({
            id: t.Numeric()
        })
    })

app.delete("/todos/:id", ({ params }) => {
    const todo = db.find((todo) => todo.id === params.id)
    if (todo) db.filter((todo) => todo.id !== params.id)
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
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
        ${children}
    </html>
`

type ToDo = {
    id: number,
    content: string,
    completed: boolean,
}

const db: ToDo[] = [
    { id: 1, content: "eat food", completed: false },
    { id: 2, content: "eat food", completed: false },
    { id: 3, content: "sleep", completed: false },
    { id: 4, content: "wake up", completed: true }
]

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
        <form hx-post="/todos" hx-swap="beforebegin" class="flex flex-col space-y-3">
            <input class="py-1 border" type="text" name="content" />
            <button type="submit" class="border rounded-md px-6 py-1 bg-green-500 text-white hover:bg-green-600">Create</button>
        </form>
    )
}