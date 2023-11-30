import { Elysia } from "elysia"
import { html } from '@elysiajs/html'
import * as elements from "typed-html"

const app = new Elysia().use(html())

app.get("/", ({ html }) => 
html(
    <BaseHtml>
      <body>
            <h1>Hello World!</h1>
        </body>
   </BaseHtml>
))

app.listen(3000, () => console.log("Listening to Elysia on  port 3000"))

const BaseHtml = ({ children }: elements.Children) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BETH todo apps</title>
    </head>
        ${children}
    </html>
`