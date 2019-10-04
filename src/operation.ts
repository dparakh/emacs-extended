import {Editor} from "./editor";

export class Operation {
  public editor: Editor;
  private commandList: { [key: string]: (...args: any[]) => any, thisArgs?: any } = {};

  constructor() {
    this.editor = new Editor();
    this.commandList = {
      "undo": () => {
        this.editor.undo();
      },
      "C-M-Space": () => {
        this.editor.goToNextSexp(true);
      },
      "C-M-b": () => {
        this.editor.goToPrevSexp();
      },
      "C-M-f": () => {
        this.editor.goToNextSexp();
      },
      "abortCommand": () => {
        this.editor.abort();
      },
      "kill": () => {
        this.editor.kill();
      },
      "killRegion": () => {
        this.editor.killRegion();
      },
      "C-x_C-o": () => {
        this.editor.deleteBlankLines();
      },
      "listenForRegisterCmds": () => {
        this.editor.setRMode();
      },
      "yank": () => {
        this.editor.yank();
      },
      "yankPop": () => {
        this.editor.yankPop();
      },
      "killRingSave": () => {
        this.editor.copy();
      },

      // cua mode
      "toggleCuaMode": () => {
        this.editor.toggleCuaMode();
      },
      "cuaCut": () => {
        this.editor.kill();
      },
      "cuaPaste": () => {
        this.editor.yank();
      },
      "cuaCopy": () => {
        this.editor.copy();
      },

      // case-switching
      "uppercaseRegion": () => {
        this.editor.changeCase("upper", "region");
      },
      "lowercaseRegion": () => {
        this.editor.changeCase("lower", "region");
      },
      "uppercaseWord": () => {
        this.editor.changeCase("upper", "position");
      },
      "lowercaseWord": () => {
        this.editor.changeCase("lower", "position");
      },
      "capitaliseWord": () => {
        this.editor.changeCase("capitalise", "position");
      },

      "enterMarkMode": () => {
        this.editor.toggleMarkMode();
      },
      "exitMarkMode": () => {
        this.editor.toggleMarkMode();
      },
      "enterRectangleMarkMode": () => {
        this.editor.toggleRectangleMarkMode();
      },
      "exitRectangleMarkMode": () => {
        this.editor.toggleRectangleMarkMode();
      },
    };
  }

  public getCommand(commandName: string): (...args: any[]) => any {
    return this.commandList[commandName];
  }

  public onType(text: string): void {
    this.editor.onType(text);
  }
}
