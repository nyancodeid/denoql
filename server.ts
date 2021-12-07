import { opine, json } from "https://deno.land/x/opine@2.0.0/mod.ts";
import * as GraphQL from "https://cdn.pika.dev/graphql@^16.0.0";

import { prismqlPlayground } from "./web.ts"
import { schema } from "./schema.ts"

const { graphql } = GraphQL;

export function createServer(port: string | number = "8080"): void {
  const app = opine();

  app.use(json());

  app.get('/graphql', (req, res) => {
    // Return the static HTML for the GraphiQL IDE
    res.send(prismqlPlayground(port));
  });

  app.post('/graphql', async (req, res) => {
    const query = req.body.query

    graphql({ schema, source: query }).then((response => {
      res.json(response)
    }))
  });

  app.listen(Number(port), () => {
    console.log(`GraphQL Server running on http://localhost:${port}/graphql`);
  });
}
