import { Element, DOMParser, PQueue } from "./deps.ts"

import State from "./utils/state.ts"
import { getAttributeOfElement, resolveURL } from "./utils/helpers.ts"

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

export const fieldTitleResolver = (element: Element) => {
  return element?.ownerDocument?.title
}

export const fieldMetaResolver = (element: Element, { name }: TParams) => {
  let meta = element?.querySelector(`meta[name='${name}']`)

  if (!meta) {
    meta = element?.querySelector(`meta[property='${name}']`)
  }

  if (!meta) return null;

  return getAttributeOfElement(meta, "content")
}

export const fieldVisitResolver = async (element: Element, _params: TParams, context: TContext) => {
  const href = element.getAttribute('href')
  const base_url = context.state.get('base') as string;

  if (href == null) return null

  let url = href;

  if (base_url) {
    url = resolveURL(base_url, href);

    context.state.set('url', url)
  }

  const options = context.state.get('fetch_options') as RequestInit;

  const queue = context.state.get('queue') as PQueue;
  const html = await queue.add(() => fetch(url, options)
    .then(res => res.text()));
  const dom = new DOMParser().parseFromString(html, 'text/html')

  return dom?.documentElement;
}

export const fieldVisitCustomResolver = async (element: Element, { selector, attr }: TParams, context: TContext) => {
  const base_url = context.state.get('base') as string;

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
}

export const fieldPageResolver = async (_element: Element, { url, source }: TParams, context: TContext) => {
  if (!url && !source) {
    throw new Error(
      'You need to provide either a URL or a HTML source string.'
    )
  }

  if (url) {
    const options = context.state.get('fetch_options') as RequestInit;

    source = await fetch(url, options).then(res => res.text());

    context.state.set('base', url)
    context.state.set('url', url)
  } else {

    context.state.set('base', "")
  }

  const dom = new DOMParser().parseFromString(source!, 'text/html')!

  context.state.set('document', dom.documentElement);

  return dom.documentElement;
}

export const fieldIndexResolver = (element: Element, { parent }: TParams, context: TContext) => {
  if (!parent) {
    const nodes = Array.from(element.parentElement?.childNodes ?? []);

    return nodes.indexOf(element);
  }

  const document = context.state.get('document') as Element;
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
}

export const fieldContentResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element

  return element && element.innerHTML
}

export const fieldHtmlResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element

  return element && element.outerHTML
}

export const fieldTextResolver = (element: Element, { selector, trim }: TParams) => {
  element = selector ? element.querySelector(selector)! : element

  const result = element && element.textContent

  return (trim) ? result.trim() : result;
}

export const fieldTableResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element

  const result = element && Array.from(
    element.querySelectorAll('tr')
  ).map(row => Array.from((row as Element).querySelectorAll('td')).map(td => td.textContent.trim()));

  return result.filter(row => row.length > 0);
}

export const fieldTagResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element

  return element && element.tagName
}

export const fieldHasResolver = (element: Element, { selector }: TParams) => {
  return !!element.querySelector(selector!)
}

export const fieldCountResolver = (element: Element, { selector }: TParams) => {
  if (!selector) return 0;

  return Array.from(element.querySelectorAll(selector)).length
}

export const fieldAttrResolver = (element: Element, { selector, name }: TParams) => {
  element = selector ? element.querySelector(selector)! : element
  if (element == null || name == null) return null

  const attribute = element.getAttribute(name)
  if (attribute == null) return null

  return attribute
}

export const fieldHrefResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element
  if (element == null) return null

  return getAttributeOfElement(element, "href")
}

export const fieldSrcResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element
  if (element == null) return null

  return getAttributeOfElement(element, "src")
}

export const fieldClassResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element
  if (element == null) return null

  return getAttributeOfElement(element, "class")
}

export const fieldClassListResolver = (element: Element, { selector }: TParams) => {
  element = selector ? element.querySelector(selector)! : element
  if (element == null) return null

  const attribute = getAttributeOfElement(element, "class")
  if (attribute == null) return null

  return attribute.split(" ")
}

export const fieldQueryResolver = (element: Element, { selector }: TParams) => {
  return element.querySelector(selector!)
}

export const fieldQueryAllResolver = (element: Element, { selector }: TParams) => {
  return Array.from(element.querySelectorAll(selector!))
}

export const fieldChildrenResolver = (element: Element) => {
  return Array.from(element.children)
}

export const fieldChildrenNodesResolver = (element: Element) => {
  return Array.from(element.childNodes)
}

export const fieldParentResolver = (element: Element) => {
  return element.parentElement
}

export const fieldNextSiblingResolver = (element: Element) => {
  return element.nextSibling
}

export const fieldSiblingsResolver = (element: Element) => {
  const parent = element.parentElement
  if (parent == null) return [element]

  return Array.from(parent.children)
}

export const fieldNextAllResolver = (element: Element) => {
  const siblings = []
  for (
    let next = element.nextSibling;
    next != null;
    next = next.nextSibling
  ) {
    siblings.push(next)
  }
  return siblings
}

export const fieldPreviousResolver = (element: Element) => {
  return element.previousSibling
}

export const fieldPreviousAllResolver = (element: Element) => {
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
}