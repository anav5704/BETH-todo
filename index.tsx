import { Elysia } from "elysia"
import { html } from '@elysiajs/html'
import * as elements from "typed-html"

const app = new Elysia().use(html())

app.get("/", ({ html }) => 
html(
    <BaseHtml>
      <body class="h-screen w-screen flex items-center justify-center flex-col gap-5">
            <button class="border rounded-sm px-6 py-2" hx-post='/pizza' hx-swap="outerHTML">
                Order pizza from Elysia server
            </button>
        </body>
   </BaseHtml>
))

app.post("/pizza", () => <div class="text-6xl">🍕</div>)

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