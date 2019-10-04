import { Range } from "vscode";

export default class KillRing {
  private readonly MAX_LENGTH = 60;
  private items: string[];
  private pointer: number;

  private oldRange: Range | null;

  constructor() {
    this.oldRange = null;
    this.pointer = 0;
    this.items = new Array<string>(this.MAX_LENGTH);
  }

  public save = (text: string) => {
    this.items[this.pointer] = text;
    this.pointer = (this.pointer + 1) % this.MAX_LENGTH;
  }

  public top = () => {
    return this.items[(this.pointer - 1) % this.MAX_LENGTH];
  }

  public append = (str: string) => {
    if (this.pointer > 0) {
      this.items[this.pointer - 1] += str;
    }
  }

  public forward = () => {
    if (this.items[(this.pointer + 1) % this.MAX_LENGTH] === undefined) {
      this.pointer = 0;
    } else {
      this.pointer = (this.pointer + 1) % this.MAX_LENGTH;
    }
  }

  public backward = () => {
    if (this.pointer === 1) {
      const firstEmpty = this.items.findIndex(i => i === undefined);
      this.pointer = firstEmpty !== -1 ? firstEmpty : this.MAX_LENGTH - 1;
    } else {
      this.pointer = (this.pointer - 1) % this.MAX_LENGTH;
    }
  }

  public setLastInsertedRange = (r: Range) => {
    this.oldRange = r;
  }

  public getLastRange = () => this.oldRange;

  public getLastInsertionPoint = () => {
    if (this.oldRange) {
      return this.oldRange.start;
    }
  }

  public isEmpty = (): boolean => {
    return !this.items.some(i => i !== undefined);
  }
}
