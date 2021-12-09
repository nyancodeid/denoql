import { createServer } from './mod.ts'
import { parse } from "https://deno.land/std@0.117.0/flags/mod.ts";

const DEFAULT_PORT = 8080;

const { port } = parse(Deno.args)

createServer((port) ? port : DEFAULT_PORT)