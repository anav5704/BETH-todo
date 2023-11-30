import { Elysia } from "elysia"
import { html } from '@elysiajs/html'

const app = new Elysia().use(html())

app.get("/", ({ html }) => html(HTML_SHELL))

app.listen(3000, () => console.log("Listening to Elysia on  port 3000"))

const HTML_SHELL = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BETH todo apps</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
`

