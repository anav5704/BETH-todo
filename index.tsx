import { Elysia } from "elysia"
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

app.get("/todos", () => <ToDoList todos={db}/> )

app.listen(3000, () => console.log("Listening to Elysia on  port 3000"))

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
    { id: 2, content: "drink water", completed: true }
]

const ToDoItem = ({ id, content, completed }: ToDo) => {
    return (
        <div class="flex flex-row space-x-5 items-center justify-end">
            <p>{content}</p>
            <input type="checkbox" checked={completed} id={id} />
            <button class="border rounded-md px-6 py-1 bg-rose-500 text-white hover:bg-rose-600">Delete</button>
        </div>
    )
}


const ToDoList = ({ todos }: { todos: ToDo[] }) => {
    return (
        <div class="flex flex-col gap-y-3"> 
            {todos.map((todo) => (
                <ToDoItem {...todo} />
            ))}
        </div>
    )
}