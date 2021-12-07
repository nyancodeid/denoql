import { opine, json } from "./deps.ts";
import { graphql } from "./deps.ts";

import { prismqlPlayground } from "./web.ts"
import { schema } from "./schema.ts"

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
