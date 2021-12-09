# DenoQL: Deno GraphQL Scraper
GraphQL Scraper using Deno

## Example
```ts
import { useQuery } from 'https://deno.land/x/denoql/mod.ts'

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
```

## Example GraphQL Playground Server

```ts
import { createServer } from 'https://deno.land/x/denoql/mod.ts'

// default listen on port :8080/graphql
createServer()

// custom listen port :3000/graphql
createServer(3000)
```

```bash
# direct run server
$ deno run -A --unstable https://deno.land/x/denoql/serve.ts

# direct run server with custom port
$ deno run -A --unstable https://deno.land/x/denoql/serve.ts --port=3000
```

Tested out on Deno `v1.16.x`