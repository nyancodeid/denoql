export {
  graphql,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLList,
} from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";

export type {
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLFieldConfigMap
} from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";

export { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export { serve } from "https://deno.land/std@0.117.0/http/server.ts"