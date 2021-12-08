import { serve } from "./deps.ts";
import { useQuery } from './schema.ts'

import { prismqlPlayground } from "./web.ts"

export function createServer(port: string | number) {
  async function handler(req: Request): Promise<Response> {
    switch (req.method) {
      case "GET": {
        return new Response(prismqlPlayground(port), {
          headers: { "content-type": "text/html" },
        })
      }
      case "POST": {
        const body = await req.json();
        const query = body.query;

        const response = await useQuery(query);

        return new Response(JSON.stringify(response, null, 2), {
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      }
      default:
        return new Response("Invalid Method", {
          headers: { "content-type": "text/html" },
        })
    }
  }

  console.log(`GraphQL Server running on http://localhost:${port}/graphql`);

  serve(handler, {
    addr: `0.0.0.0:${port}`
  });
}
