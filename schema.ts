import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  Element,
  PQueue,
  GRAPHQL_TYPE
} from "./deps.ts";

import type {
  GraphQLFieldConfigMap,
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
  ExecutionResult
} from "./deps.ts"

import State from "./utils/state.ts"
import * as Resolvers from "./resolvers.ts"

type TContext = {
  state: State
}

const selector = {
  type: GRAPHQL_TYPE.STRING,
  description:
    'A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).',
}

function sharedFields(): GraphQLFieldConfigMap<Element, TContext> {
  return {
    index: {
      type: GRAPHQL_TYPE.INT,
      description: 'Node index from parent element',
      args: { parent: selector },
      resolve: Resolvers.fieldIndexResolver,
    },
    content: {
      type: GRAPHQL_TYPE.STRING,
      description: 'The HTML content of the subnodes',
      args: { selector },
      resolve: Resolvers.fieldContentResolver,
    },
    html: {
      type: GRAPHQL_TYPE.STRING,
      description: 'The HTML content of the selected DOM node',
      args: { selector },
      resolve: Resolvers.fieldHtmlResolver,
    },
    text: {
      type: GRAPHQL_TYPE.STRING,
      description: 'The text content of the selected DOM node',
      args: {
        selector,
        trim: {
          type: GRAPHQL_TYPE.BOOLEAN,
          description: "Optional text trim. default: false",
          defaultValue: false
        }
      },
      resolve: Resolvers.fieldTextResolver,
    },
    table: {
      type: new GRAPHQL_TYPE.LIST(new GRAPHQL_TYPE.LIST(GRAPHQL_TYPE.STRING)),
      description: 'Get value from table rows',
      args: {
        selector
      },
      resolve: Resolvers.fieldTableResolver,
    },
    tag: {
      type: GRAPHQL_TYPE.STRING,
      description: 'The tag name of the selected DOM node',
      args: { selector },
      resolve: Resolvers.fieldTagResolver,
    },
    attr: {
      type: GRAPHQL_TYPE.STRING,
      description:
        'An attribute of the selected node (eg. `href`, `src`, etc.).',
      args: {
        selector,
        name: {
          type: new GRAPHQL_TYPE.NOT_NULL(GRAPHQL_TYPE.STRING),
          description: 'The name of the attribute',
        },
      },
      resolve: Resolvers.fieldAttrResolver,
    },
    href: {
      type: GRAPHQL_TYPE.STRING,
      description:
        'An href attribute of the selected node.',
      args: {
        selector
      },
      resolve: Resolvers.fieldHrefResolver,
    },
    src: {
      type: GRAPHQL_TYPE.STRING,
      description:
        'An src attribute of the selected node.',
      args: {
        selector
      },
      resolve: Resolvers.fieldSrcResolver,
    },
    class: {
      type: GRAPHQL_TYPE.STRING,
      description:
        'An class attribute of the selected node.',
      args: {
        selector
      },
      resolve: Resolvers.fieldClassResolver
    },
    classList: {
      type: new GRAPHQL_TYPE.LIST(GRAPHQL_TYPE.STRING),
      description:
        'An array of class from the selected node class attribute.',
      args: {
        selector
      },
      resolve: Resolvers.fieldClassListResolver,
    },
    has: {
      type: GRAPHQL_TYPE.BOOLEAN,
      description: 'Returns true if an element with the given selector exists.',
      args: { selector },
      resolve: Resolvers.fieldHasResolver,
    },
    count: {
      type: GRAPHQL_TYPE.INT,
      description: 'The count of the selected DOM node',
      args: { selector },
      resolve: Resolvers.fieldCountResolver,
    },
    query: {
      type: TElement,
      description:
        'Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.',
      args: { selector },
      resolve: Resolvers.fieldQueryResolver,
    },
    queryAll: {
      type: new GRAPHQL_TYPE.LIST(TElement),
      description:
        'Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.',
      args: { selector },
      resolve: Resolvers.fieldQueryAllResolver,
    },
    children: {
      type: new GRAPHQL_TYPE.LIST(TElement),
      description: "An element's child elements.",
      resolve: Resolvers.fieldChildrenResolver,
    },
    childNodes: {
      type: new GRAPHQL_TYPE.LIST(TElement),
      description: "An element's child nodes. Includes text nodes.",
      resolve: Resolvers.fieldChildrenNodesResolver,
    },
    parent: {
      type: TElement,
      description: "An element's parent element.",
      resolve: Resolvers.fieldParentResolver,
    },
    siblings: {
      type: new GRAPHQL_TYPE.LIST(TElement),
      description:
        "All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.",
      resolve: Resolvers.fieldSiblingsResolver,
    },
    next: {
      type: TElement,
      description:
        "The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
      resolve: Resolvers.fieldNextSiblingResolver,
    },
    nextAll: {
      type: new GRAPHQL_TYPE.LIST(TElement),
      description: "All of the current element's next siblings",
      resolve: Resolvers.fieldNextAllResolver,
    },
    previous: {
      type: TElement,
      description:
        "The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
      resolve: Resolvers.fieldPreviousResolver,
    },
    previousAll: {
      type: new GRAPHQL_TYPE.LIST(TElement),
      description: "All of the current element's previous siblings",
      resolve: Resolvers.fieldPreviousAllResolver,
    },
  }
}

const TNode = new GraphQLInterfaceType(<GraphQLInterfaceTypeConfig<
  Element,
  TContext
>>{
    name: 'Node',
    description: 'A DOM node (either an Element or a Document).',
    fields: sharedFields,
  })

const TDocument = new GraphQLObjectType(<GraphQLObjectTypeConfig<
  Element,
  TContext
>>{
    name: 'Document',
    description: 'A DOM document.',
    interfaces: [TNode],
    fields: () => ({
      ...sharedFields(),
      title: {
        type: GRAPHQL_TYPE.STRING,
        description: 'The page title',
        resolve: Resolvers.fieldTitleResolver,
      },
      meta: {
        type: GRAPHQL_TYPE.STRING,
        description: 'The meta content',
        args: {
          name: {
            type: GRAPHQL_TYPE.STRING,
            description: 'meta name or property',
          }
        },
        resolve: Resolvers.fieldMetaResolver,
      },
    }),
  })

const TElement = new GraphQLObjectType(<GraphQLObjectTypeConfig<
  Element,
  TContext
>>{
    name: 'Element',
    description: 'A DOM element.',
    interfaces: [TNode],
    fields: () => ({
      ...sharedFields(),
      visit: {
        type: TDocument,
        description:
          'If the element is a link, visit the page linked to in the href attribute.',
        resolve: Resolvers.fieldVisitResolver,
      },
      visit_custom: {
        type: TDocument,
        description:
          'If the element is a link, visit the page linked to in the href attribute.',
        args: {
          selector,
          attr: {
            type: GRAPHQL_TYPE.STRING,
            description: 'attribute name'
          }
        },
        resolve: Resolvers.fieldVisitCustomResolver,
      },
    }),
  })

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType(<GraphQLObjectTypeConfig<Element, TContext>>{
    name: 'Query',
    fields: () => ({
      page: {
        type: TDocument,
        args: {
          url: {
            type: GRAPHQL_TYPE.STRING,
            description: 'A URL to fetch the HTML source from.',
          },
          source: {
            type: GRAPHQL_TYPE.STRING,
            description:
              'A string containing HTML to be used as the source document.',
          },
        },
        resolve: Resolvers.fieldPageResolver
      },
    }),
  }),
})

type QueryOptions = {
  concurrency?: number,
  fetch_options?: RequestInit
}

/**
 * Run scrapper base on graphql query
 * @param query GraphQL Query
 * @param options Query Options
 * @returns 
 */
export const useQuery = (query: string, options?: Partial<QueryOptions>): Promise<ExecutionResult> => {
  const final_options = Object.assign({
    concurrency: navigator.hardwareConcurrency * 2,
    fetch_options: {}
  }, options);

  const state = new State();
  const queue = new PQueue({
    concurrency: final_options.concurrency
  })

  state.set("queue", queue);
  state.set("fetch_options", final_options.fetch_options);

  for (const [key, value] of Object.entries(final_options)) {
    state.set(key, value);
  }

  return graphql(schema, query, {}, {
    state
  })
}
