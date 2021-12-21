export default class State {
  private states = <{
    [key: string]: any
  }>{};

  public set(key: string, value: any): void {
    this.states[key] = value;
  }

  public get(key: string): any {
    return this.states[key];
  }
}