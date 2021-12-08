import { DOMParser } from "./deps.ts"

export class ParseDOM {
  public url: string = ''
  public source: string = ''

  async useUrl(url: string) {
    this.url = url;
    this.source = await fetch(url).then(res => res.text())
  }

  async useSource(source: string) {
    this.source = source
  }

  getElement() {
    return new DOMParser().parseFromString(this.source, 'text/html')!;
  }
}