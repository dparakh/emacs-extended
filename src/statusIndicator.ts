import { StatusBarAlignment, StatusBarItem, window } from "vscode";

export enum Mode {
  Mark,
  Cua,

  // Keybinding Progress Modes
  // - VSCode only supports 2-key chords
  // - These states are used to listen for additional keys
  Register,
  RegisterSave,
  RegisterInsert,
  RectangleMark,
  NoKeyBinding,
}

const IconMapper = {
  [Mode.Mark]: "markdown",
  [Mode.Cua]: "clippy",
  [Mode.Register]: "server",
  [Mode.RectangleMark]: "three-bars",
};
export default class StatusIndicator {
  private statusBarItem: StatusBarItem;
  private statusBarIcons: string[];
  private activeModes: Mode[];
  constructor() {
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    this.statusBarIcons = [];
    this.activeModes = [];
    this.statusBarItem.text = this.statusText();
    this.statusBarItem.tooltip = this.toolTipText();
    this.statusBarItem.show();
  }
  public deactivateTempModes = () => {
    this.activeModes = this.activeModes.filter(i => i === Mode.Cua);
    this.statusBarIcons = this.statusBarIcons.filter(i => i === IconMapper[Mode.Cua]);

    this.refreshStatusBar();
  }
  public deactivate = (mode: Mode) => {
    this.activeModes = this.activeModes.filter(i => i !== mode);
    this.statusBarIcons = this.statusBarIcons.filter(i => i !== IconMapper[mode]);

    this.refreshStatusBar();
  }
  public activate = (mode: Mode) => {
    if (!this.activeModes.some(i => i === mode)) {
      this.activeModes.push(mode);
    }

    this.refreshStatusBar();
  }
  public toggleMode(mode: Mode) {
    if (this.activeModes.some(i => i === mode)) {
      const index = this.activeModes.indexOf(mode);
      this.activeModes.splice(index, 1);
      this.statusBarIcons = this.statusBarIcons.filter(i => i !== IconMapper[mode]);
    } else {
      this.activeModes.push(mode);
      this.statusBarIcons.push(IconMapper[mode]);
    }

    this.refreshStatusBar();
  }
  public isModeActive(mode: Mode) {
    return this.activeModes.some(i => i === mode);
  }
  public setKeybindingProgress(mode: Mode.RegisterSave | Mode.RegisterInsert) {
    if (!this.isModeActive(Mode.Register)) {
      this.setStatusBarMessage("Operation failed: not in Register Mode", 2000);
    } else {
      this.activeModes.push(mode);
      this.activeModes = this.activeModes.filter(i => i !== Mode.Register);
      this.statusBarIcons = this.statusBarIcons.filter(i => i !== IconMapper[Mode.Register]);
    }
  }
  public keybindingProgressMode(): Mode {
    const value = this.activeModes.find(i =>
      i === Mode.Register ||
      i === Mode.RegisterSave ||
      i === Mode.RegisterInsert ||
      i === Mode.RectangleMark
    );
    return value ? value : Mode.NoKeyBinding;
  }
  public setStatusBarMessage = (text: string, duration: number = 1000) => {
    this.statusBarItem.text = this.tempMessage(text);

    // put the mode indicators back in
    setTimeout(
      () => {
        this.statusBarItem.text = this.statusText();
      },
      duration);
  }
  public setStatusBarPermanentMessage = (text: string) => {
    if (text === "") {
      this.statusBarItem.text = this.statusText();
    } else {
      this.statusBarItem.text = `EMACS: ${text}`;
    }
  }
  private refreshStatusBar = () => {
    this.statusBarIcons = this.activeModes.map(i => IconMapper[i]);
    this.statusBarItem.text = this.statusText();
    this.statusBarItem.tooltip = this.toolTipText();
  }
  private tempMessage = (msg: string) => `EMACS: ${msg}`;
  private statusText = () => `EMACS: ${this.statusBarIcons.map(i => `$(${i})`).join(" ")}`;
  private toolTipText = () => {
    let text = "";

    text = this.activeModes.map(i => `${Mode[i]} mode active`).join("\n");
    return text;
  }
}
