import { serve } from "./deps.ts";
import { useQuery } from './schema.ts'

import { prismqlPlayground } from "./web.ts"

interface IOptional {
  endpoint?: string
}

export function createServer(port: string | number = 8080, option?: IOptional) {
  const endpoint = (option?.endpoint) ? option.endpoint : `http://localhost:${port}`;

  async function handler(req: Request): Promise<Response> {
    switch (req.method) {
      case "GET": {
        return new Response(prismqlPlayground(port, endpoint), {
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

  console.log(`GraphQL Server running on ${endpoint}`);

  serve(handler, {
    addr: `0.0.0.0:${port}`
  });
}
