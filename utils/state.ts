import { Element, PQueue } from "../deps.ts";

type TStateValue = RequestInit | PQueue | Element | number | boolean | string | null | undefined;

export default class State {
  private states = <{
    [key: string]: TStateValue
  }>{};

  public set(key: string, value: TStateValue): void {
    this.states[key] = value;
  }

  public get(key: string): TStateValue {
    return this.states[key];
  }
}