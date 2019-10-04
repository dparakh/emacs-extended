import * as vscode from "vscode";

export enum RegisterKind {
    KText = 1,
    KPoint = 2,
    KRectangle = 3,
}

export class RectangleContent { // TODO: move it to rectangle.ts eventually.
    // TBD
}

export class RegisterContent {
    public static fromRegion(registerContent: string) {
        return new this(RegisterKind.KText, registerContent);
    }

    public static fromPoint(registerContent: vscode.Position) {
        return new this(RegisterKind.KPoint, registerContent);
    }

    public static fromRectangle(registerContent: RectangleContent) {
        return new this(RegisterKind.KRectangle, registerContent);
    }

    private kind: RegisterKind;
    private content: string             // stores region/text
                    | vscode.Position   // stores position
                    | RectangleContent; // stores rectangle

    constructor(registerKind: RegisterKind, registerContent: string | vscode.Position | RectangleContent) {
        this.kind = registerKind;
        this.content = registerContent;
    }

    public getRegisterKind(): RegisterKind {
        return this.kind;
    }

    public getRegisterContent(): string | vscode.Position | RectangleContent {
        return this.content;
    }
}

export default class Register {
    private storage: { [key: string]: RegisterContent; };

    constructor() {
        this.storage = {};
    }

    public saveTextToRegister(registerName: string, text: string): void {
        if (registerName === null) {
            return;
        }

        this.storage[registerName] = RegisterContent.fromRegion(text);
    }

    public getTextFromRegister(registerName: string): string | null {
        const obj: RegisterContent = this.storage[registerName];
        if (!obj) {
            return null;
        }

        if (obj.getRegisterKind() !== RegisterKind.KText) {
            return null;
        } else {
            return obj.getRegisterContent() as string;
        }
    }
}
