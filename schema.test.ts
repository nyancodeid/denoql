import { assertEquals } from "./deps.ts";

import { graphql } from "./deps.ts";
import { schema } from "./schema.ts"

Deno.test({
  name: "no args throws errors #1",
  fn: async () => {
    const query = `{ page { title } }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(
      response && response.errors && response.errors[0].message,
      'You need to provide either a URL or a HTML source string.'
    );
  }
});

Deno.test({
  name: "title #2",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body></body></html>`
    const query = `{ page(source: "${html}") { title } }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(response.data && response.data.page.title, 'some title')
  },
  sanitizeOps: false,
  sanitizeResources: false
});

Deno.test({
  name: "fetch from URL #3",
  fn: async () => {
    const query = `{ 
      page(url: "https://nyancodeid.github.io/tests/test-3-via-url.html") {
        title
      }
    }`
    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(response.data && response.data.page.title, 'some title');
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "content #4",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body>some body</body></html>`
    const query = `{ page(source: "${html}") { content } }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.content,
      '<head><title>some title</title></head><body>some body</body>'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "content with selector #5",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        content(selector: ".selectme")
      }
    }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.content,
      '<strong>bad</strong>'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "not existing selector #6",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        content(selector: ".selectmenot")
      }
    }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.content,
      null
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "HTML content #6",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body>some body</body></html>`
    const query = `{ page(source: "${html}") { html } }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.html,
      html
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "HTML content with selector #7",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        html(selector: ".selectme")
      }
    }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.html,
      '<div class="selectme"><strong>bad</strong></div>'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "text #8",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        text
      }
    }`

    const response = await graphql({
      schema,
      source: query
    })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.text, 'some titlebad'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "text with selector #9",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        text(selector: ".selectme")
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.text, 'bad'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "tag #10",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        tag
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.tag, 'HTML'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "tag with selector #11",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        tag(selector: ".selectme")
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.tag, 'DIV'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "attr #12",
  fn: async () => {
    const html = `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        attr(name: "style")
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.attr, 'background: red;'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "non existing attribute #13",
  fn: async () => {
    const html = `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        attr(name: "asdf")
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.attr, null
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "attribute with selector #14",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        attr(selector: ".selectme", name: "class")
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.attr, 'selectme'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "has #15",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        firstDiv: query(selector: "div") {
          isStrong: has(selector: "strong")
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.firstDiv.isStrong,
      true
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "has not #16",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        firstDiv: query(selector: "div") {
          isWeak: has(selector: "weak")
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && !response.data.page.firstDiv.isWeak,
      true
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "query #17",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        firstDiv: query(selector: "div") {
          text
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.firstDiv, { text: 'one' }
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "queryAll #18",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        divs: queryAll(selector: "div") {
          text
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.divs,
      [
        { text: 'one' },
        { text: 'two' },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "children #19",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong><strong>two</strong></div><div class=\\"two\\"><strong>two</strong><strong>three</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        kids: queryAll(selector: "div") {
          children {
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.kids,
      [
        {
          children: [{ text: 'one' }, { text: 'two' }],
        },
        {
          children: [{ text: 'two' }, { text: 'three' }],
        },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "childNodes #20",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\">one<strong>two</strong></div><div class=\\"two\\"><strong>two</strong>amazing<strong>three</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        kids: queryAll(selector: "div") {
          childNodes {
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.kids,
      [
        {
          childNodes: [{ text: 'one' }, { text: 'two' }],
        },
        {
          childNodes: [{ text: 'two' }, { text: 'amazing' }, { text: 'three' }],
        },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "parent #21",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          parent {
            attr(name: "class")
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.parent.attr, 'selectme'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "siblings #22",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          siblings {
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.siblings,
      [
        { text: 'bad' },
        { text: 'boom' },
        { text: 'bap' },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "siblings of root is only html #23",
  fn: async () => {
    const html = `<!doctype html><html><head></head><body>nothing to see here</body></html>`
    const query = `{
      page(source: "${html}") {
        siblings {
          tag
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.siblings, [{ tag: 'HTML' }]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "next #24",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          next {
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.next.text, 'boom'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "next - bare text #25",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          next {
            tag
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.next.tag, null
    )
    assertEquals(
      response.data && response.data.page.query.next.text, 'bare text'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "nextAll #26",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "strong") {
          nextAll {
            tag
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.nextAll,
      [
        { tag: null, text: 'bare text' },
        { tag: 'SPAN', text: 'bap' },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "previous #27",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "span") {
          previous {
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.previous.text, 'boom'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "previousAll #28",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "span") {
          previousAll {
            tag
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.previousAll,
      [
        { tag: 'STRONG', text: 'bad' },
        { tag: null, text: 'bare text' },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "previousAll #29",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "span") {
          previousAll {
            tag
            text
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.previousAll,
      [
        { tag: 'STRONG', text: 'bad' },
        { tag: null, text: 'bare text' },
      ]
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "visit #30",
  fn: async () => {
    const query = `{
      page(url: "https://nyancodeid.github.io/tests/test-3-via-url.html") {
        link: query(selector: "a") {
          visit {
            text(selector: "strong")
          }
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.link.visit.text,
      'we managed to visit the link!'
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})

Deno.test({
  name: "count #31",
  fn: async () => {
    const html = `<html><head><title>some title</title></head><body><ul><li>Item 1</li><li>Item 2</li></ul></body></html>`
    const query = `{
      page(source: "${html}") {
        query(selector: "ul") {
          count(selector: "li")
        }
      }
    }`

    const response = await graphql({ schema, source: query })

    assertEquals(('error' in response), false);
    assertEquals(
      response.data && response.data.page.query.count, 2
    )
  },
  sanitizeOps: false,
  sanitizeResources: false
})