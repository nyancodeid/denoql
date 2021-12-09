# DenoQL: Deno GraphQL Scraper
GraphQL Scraper running on [Deno](https://deno.land/)

## Schema
Basicly you can read more the detail of every graphql schema when you running `serve` (GraphQL Playground). But, if you only need to know about what field is available and all of graphql schema here is the Gist link.

[https://gist.github.com/nyancodeid/16e1ed47bfbd5410ccb8b04b4c57508c](https://gist.github.com/nyancodeid/16e1ed47bfbd5410ccb8b04b4c57508c)

## Example
```ts
import { useQuery } from 'https://deno.land/x/denoql/mod.ts'

// read more about another GraphQL Schema here
// https://gist.github.com/nyancodeid/16e1ed47bfbd5410ccb8b04b4c57508c
//
const query = `
{
  page(url:"http://news.ycombinator.com") {
    items: queryAll(selector:"tr.athing") {
      rank: text(selector:"td span.rank")
      title: text(selector:"td.title a")
      sitebit: text(selector:"span.comhead a")
      url: attr(selector:"td.title a", name:"href")
      attrs: next {
        score: text(selector:"span.score")
      }
    }
    length: count(selector: "tr.athing")
  }
}`

// Run GraphQL Query
const response = await useQuery(query);

// Do something with response (Object)
console.log(response);
```

## Example GraphQL Playground Server

```ts
import { createServer } from 'https://deno.land/x/denoql/mod.ts'

// default listen on port :8080/graphql
createServer()

// or custom listen port :3000/graphql
createServer(3000)
```

```bash
# direct run server
$ deno run -A --unstable https://deno.land/x/denoql/serve.ts

# or direct run server with custom port
$ deno run -A --unstable https://deno.land/x/denoql/serve.ts --port 3000

# or use argument like this
$ deno run -A --unstable https://deno.land/x/denoql/serve.ts --port=3001
```

Tested out on Deno version `v1.16.x`