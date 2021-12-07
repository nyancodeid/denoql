import { createServer } from './mod.ts'

let port: number = 8080;

Deno.args.forEach(element => {
  if (element.includes('--port')) {
    const _port = element.split('=');

    port = Number(_port[1].trim());
  }
});

createServer(port)