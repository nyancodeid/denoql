import {
  graphql,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLList,
  DOMParser,
  Element,
  PQueue
} from "./deps.ts";

import type {
  GraphQLFieldConfigMap,
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig
} from "./deps.ts"

import State from "./utils/state.ts"
import { resolveURL, getAttributeOfElement } from "./utils/helpers.ts"

type TParams = {
  parent?: string
  selector?: string
  name?: string
  attr?: string
  url?: string
  source?: string
  trim?: boolean
}

type TContext = {
  state: State
}

const selector = {
  type: GraphQLString,
  description:
    'A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).',
}

function sharedFields(): GraphQLFieldConfigMap<Element, any> {
  return {
    index: {
      type: GraphQLInt,
      description: 'Node index from parent element',
      args: { parent: selector },
      resolve(element: Element, { parent }: TParams, context: TContext) {
        if (parent) {
          const document: Element = context.state.get('document');
          const nodes = Array.from(document.querySelectorAll(parent) ?? []);

          let index = -1;

          for (const node of nodes) {
            let elementParent = element.parentNode;

            while (elementParent && node.compareDocumentPosition(elementParent) != 0) {
              if (!elementParent) break;

              elementParent = elementParent.parentNode!;
            }

            if (!elementParent) continue;
            if (index != -1) return index;

            index = nodes.indexOf(elementParent);
          }

          return index;
        } else {
          let nodes = Array.from(element.parentElement?.childNodes ?? []);

          return nodes.indexOf(element);
        }

        return -1;
      }
    },
    content: {
      type: GraphQLString,
      description: 'The HTML content of the subnodes',
      args: { selector },
      resolve(element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element

        return element && element.innerHTML
      },
    },
    html: {
      type: GraphQLString,
      description: 'The HTML content of the selected DOM node',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element

        return element && element.outerHTML
      },
    },
    text: {
      type: GraphQLString,
      description: 'The text content of the selected DOM node',
      args: {
        selector,
        trim: {
          type: GraphQLBoolean,
          description: "Optional text trim. default: false",
          defaultValue: false
        }
      },
      resolve(element: Element, { selector, trim }: TParams) {
        element = selector ? element.querySelector(selector)! : element

        const result = element && element.textContent

        return (trim) ? result.trim() : result;
      },
    },
    table: {
      type: new GraphQLList(new GraphQLList(GraphQLString)),
      description: 'Get value from table rows',
      args: {
        selector
      },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element

        const result = element && Array.from(
          element.querySelectorAll('tr')
        ).map(row => Array.from((row as Element).querySelectorAll('td')).map(td => td.textContent.trim()));

        return result.filter(row => row.length > 0);
      },
    },
    tag: {
      type: GraphQLString,
      description: 'The tag name of the selected DOM node',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element

        return element && element.tagName
      },
    },
    attr: {
      type: GraphQLString,
      description:
        'An attribute of the selected node (eg. `href`, `src`, etc.).',
      args: {
        selector,
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The name of the attribute',
        },
      },
      resolve(element: Element, { selector, name }: TParams) {
        element = selector ? element.querySelector(selector)! : element
        if (element == null || name == null) return null

        const attribute = element.getAttribute(name)
        if (attribute == null) return null

        return attribute
      },
    },
    href: {
      type: GraphQLString,
      description:
        'An href attribute of the selected node.',
      args: {
        selector
      },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element
        if (element == null) return null

        return getAttributeOfElement(element, "href")
      },
    },
    src: {
      type: GraphQLString,
      description:
        'An src attribute of the selected node.',
      args: {
        selector
      },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element
        if (element == null) return null

        return getAttributeOfElement(element, "src")
      },
    },
    class: {
      type: GraphQLString,
      description:
        'An class attribute of the selected node.',
      args: {
        selector
      },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element
        if (element == null) return null

        return getAttributeOfElement(element, "class")
      },
    },
    classList: {
      type: new GraphQLList(GraphQLString),
      description:
        'An array of class from the selected node class attribute.',
      args: {
        selector
      },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element
        if (element == null) return null

        const attribute = getAttributeOfElement(element, "class")
        if (attribute == null) return null

        return attribute.split(" ")
      },
    },
    has: {
      type: GraphQLBoolean,
      description: 'Returns true if an element with the given selector exists.',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        return !!element.querySelector(selector!)
      },
    },
    count: {
      type: GraphQLInt,
      description: 'The count of the selected DOM node',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        if (!selector) return 0;

        return Array.from(element.querySelectorAll(selector)).length
      },
    },
    query: {
      type: TElement,
      description:
        'Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        return element.querySelector(selector!)
      },
    },
    queryAll: {
      type: new GraphQLList(TElement),
      description:
        'Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        return Array.from(element.querySelectorAll(selector!))
      },
    },
    children: {
      type: new GraphQLList(TElement),
      description: "An element's child elements.",
      resolve(element: Element) {
        return Array.from(element.children)
      },
    },
    childNodes: {
      type: new GraphQLList(TElement),
      description: "An element's child nodes. Includes text nodes.",
      resolve(element: Element) {
        return Array.from(element.childNodes)
      },
    },
    parent: {
      type: TElement,
      description: "An element's parent element.",
      resolve(element: Element) {
        return element.parentElement
      },
    },
    siblings: {
      type: new GraphQLList(TElement),
      description:
        "All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.",
      resolve(element: Element) {
        const parent = element.parentElement
        if (parent == null) return [element]

        return Array.from(parent.children)
      },
    },
    next: {
      type: TElement,
      description:
        "The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
      resolve(element: Element) {
        return element.nextSibling
      },
    },
    nextAll: {
      type: new GraphQLList(TElement),
      description: "All of the current element's next siblings",
      resolve(element: Element, { selector }: TParams) {
        const siblings = []
        for (
          let next = element.nextSibling;
          next != null;
          next = next.nextSibling
        ) {
          siblings.push(next)
        }
        return siblings
      },
    },
    previous: {
      type: TElement,
      description:
        "The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
      resolve(element: Element) {
        return element.previousSibling
      },
    },
    previousAll: {
      type: new GraphQLList(TElement),
      description: "All of the current element's previous siblings",
      resolve(element: Element) {
        const siblings = []
        for (
          let previous = element.previousSibling;
          previous != null;
          previous = previous.previousSibling
        ) {
          siblings.push(previous)
        }
        siblings.reverse()
        return siblings
      },
    },
  }
}

const TNode = new GraphQLInterfaceType(<GraphQLInterfaceTypeConfig<
  Element,
  any
>>{
    name: 'Node',
    description: 'A DOM node (either an Element or a Document).',
    fields: sharedFields,
  })

const TDocument = new GraphQLObjectType(<GraphQLObjectTypeConfig<
  Element,
  any
>>{
    name: 'Document',
    description: 'A DOM document.',
    interfaces: [TNode],
    fields: () => ({
      ...sharedFields(),
      title: {
        type: GraphQLString,
        description: 'The page title',
        resolve(element: Element) {
          return element?.ownerDocument?.title
        },
      },
      meta: {
        type: GraphQLString,
        description: 'The meta content',
        args: {
          name: {
            type: GraphQLString,
            description: 'meta name or property',
          }
        },
        resolve(element: Element, { name }) {
          let meta = element?.querySelector(`meta[name='${name}']`)

          if (!meta) {
            meta = element?.querySelector(`meta[property='${name}']`)
          }

          if (!meta) return null;

          return getAttributeOfElement(meta, "content")
        },
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
        async resolve(element: Element, _, context) {
          const href = element.getAttribute('href')
          const base_url: string = context.state.get('base');

          if (href == null) return null

          let url = href;

          if (base_url) {
            url = resolveURL(base_url, href);

            context.state.set('url', url)
          }

          const options: RequestInit = context.state.get('fetch_options')
          const html = await (context.state.get('queue') as PQueue).add(() => fetch(url, options).then(res => res.text()));
          const dom = new DOMParser().parseFromString(html, 'text/html')

          return dom?.documentElement;
        },
      },
      visit_custom: {
        type: TDocument,
        description:
          'If the element is a link, visit the page linked to in the href attribute.',
        args: {
          selector,
          attr: {
            type: GraphQLString,
            description: 'attribute name'
          }
        },
        async resolve(element: Element, { selector, attr }: TParams, context) {
          const base_url: string = context.state.get('base');

          element = selector ? element.querySelector(selector)! : element

          if (element == null) return null
          if (attr == null) {
            attr = "href";
          }

          const href = getAttributeOfElement(element, attr)

          if (href == null) return null

          let url = href;

          if (base_url) {
            url = resolveURL(base_url, href)

            context.state.set('url', url)
          }

          const html = await (context.state.get('queue') as PQueue).add(() => fetch(url).then(res => res.text()));
          const dom = new DOMParser().parseFromString(html, 'text/html');

          context.state.set('document', dom?.documentElement);

          return dom?.documentElement;
        },
      },
    }),
  })

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType(<GraphQLObjectTypeConfig<{}, TContext>>{
    name: 'Query',
    fields: () => ({
      page: {
        type: TDocument,
        args: {
          url: {
            type: GraphQLString,
            description: 'A URL to fetch the HTML source from.',
          },
          source: {
            type: GraphQLString,
            description:
              'A string containing HTML to be used as the source document.',
          },
        },
        async resolve(_, { url, source }: TParams, context) {
          if (!url && !source) {
            throw new Error(
              'You need to provide either a URL or a HTML source string.'
            )
          }

          if (url) {
            const options: RequestInit = context.state.get('fetch_options')

            source = await fetch(url, options).then(res => res.text());

            context.state.set('base', url)
            context.state.set('url', url)
          } else {

            context.state.set('base', "")
          }

          const dom = new DOMParser().parseFromString(source!, 'text/html')!

          context.state.set('document', dom.documentElement);

          return dom.documentElement;
        },
      },
    }),
  }),
})

type QueryOptions = {
  concurrency?: number,
  fetch_options?: RequestInit
}

export const useQuery = (query: string, options?: Partial<QueryOptions>) => {
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
