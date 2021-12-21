import {
  assertEquals
} from "./deps.ts";

import State from "../utils/state.ts"
import { resolveURL } from "../utils/helpers.ts"

Deno.test("resolve url #1", () => {
  const base = "https://nyan.web.id";

  const url = resolveURL(base, "screenshot.png");

  assertEquals(url, "https://nyan.web.id/screenshot.png");
})

Deno.test("resolve url with domain #2", () => {
  const base = "https://nyan.web.id";

  const url = resolveURL(base, "https://nyan.web.id/screenshot.png");

  assertEquals(url, "https://nyan.web.id/screenshot.png");
})

Deno.test("resolve different url domain #3", () => {
  const base = "https://nyan.web.id";

  const url = resolveURL(base, "https://cdn.nyan.web.id/screenshot.png");

  assertEquals(url, "https://cdn.nyan.web.id/screenshot.png");
})

Deno.test("state #4", () => {
  const state = new State();

  state.set("test-state", true);
  state.set("test-state", false);
  state.set("test-state", true);

  assertEquals(state.get("test-state"), true);
})

Deno.test("state null and undefined #5", () => {
  const state = new State();

  state.set("test-state-1", null);
  state.set("test-state-2", undefined);

  assertEquals(state.get("test-state-1"), null);
  assertEquals(state.get("test-state-2"), undefined);
})