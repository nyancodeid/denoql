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
  Element
} from "./deps.ts";

import { Url } from "./deps.ts"

type TParams = {
  selector?: string
  name?: string
  url?: string
  source?: string
}

function getAttributeOfElement(element: Element, name: string) {
  const attribute = element.getAttribute(name)
  if (attribute == null) return null

  return attribute
}

function sharedFields() {
  const selector = {
    type: GraphQLString,
    description:
      'A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).',
  }
  return {
    content: {
      type: GraphQLString,
      description: 'The HTML content of the subnodes',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
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
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element

        return element && element.textContent
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
        'An src attribute of the selected node.',
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
        'An src attribute of the selected node.',
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
    index: {
      type: GraphQLInt,
      description: 'The index of the selected DOM node from parent selector',
      args: { selector },
      resolve(element: Element, { selector }: TParams) {
        element = selector ? element.querySelector(selector)! : element
        if (element == null) return null

        return Array.prototype.indexOf.call(
          element.parentElement?.children,
          element
        );
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

const TNode = new GraphQLInterfaceType({
  name: 'Node',
  description: 'A DOM node (either an Element or a Document).',
  fields: sharedFields,
})

const TDocument = new GraphQLObjectType({
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
  }),
})

const TElement = new GraphQLObjectType({
  name: 'Element',
  description: 'A DOM element.',
  interfaces: [TNode],
  fields: () => ({
    ...sharedFields(),
    visit: {
      type: TDocument,
      description:
        'If the element is a link, visit the page linked to in the href attribute.',
      async resolve(element: Element) {
        const href = element.getAttribute('href')
        const baseUrl = element.getAttribute('data-baseurl');

        if (href == null) return null

        let url = href;

        if (baseUrl) {
          const base = new Url(href);
          const uri = base.resolve(baseUrl);

          url = uri.toString();
        }

        const html = await fetch(url).then(res => res.text());
        const dom = new DOMParser().parseFromString(html, 'text/html')

        return dom?.documentElement;
      },
    },
  }),
})

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
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
        async resolve(_: any, { url, source }: TParams) {
          if (!url && !source) {
            throw new Error(
              'You need to provide either a URL or a HTML source string.'
            )
          }

          if (url) {
            source = await fetch(url).then(res => res.text());
          }

          if (source && url) {
            source = source.replaceAll('href=', `data-baseurl='${url}' href=`)
          }

          const dom = new DOMParser().parseFromString(source!, 'text/html')!

          return dom.documentElement;
        },
      },
    }),
  }),
})

export const useQuery = (query: string) => {
  return graphql({
    schema,
    source: query
  })
}
