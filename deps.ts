export {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
} from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";

import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
} from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";

export const GRAPHQL_TYPE = {
  INT: GraphQLInt,
  STRING: GraphQLString,
  BOOLEAN: GraphQLBoolean,
  NOT_NULL: GraphQLNonNull,
  LIST: GraphQLList,
}

export type {
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLFieldConfigMap,
  ExecutionResult
} from "https://deno.land/x/graphql_deno@v15.0.0/mod.ts";

export { default as PQueue } from "https://deno.land/x/p_queue@1.0.1/mod.ts"

export { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.31-alpha/deno-dom-wasm.ts";

export { serve } from "https://deno.land/std@0.117.0/http/server.ts"