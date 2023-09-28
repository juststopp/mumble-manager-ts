import type ButtonContext from "./ButtonContext";

interface ButtonInfo {
    name: string;
    description: string;
    category: string;
    ownerOnly?: boolean;
}

export default abstract class Button {
    name: string;
    description: string;
    category: string;
    ownerOnly?: boolean;

    constructor(info: ButtonInfo) {
        this.name = info.name;
        this.description = info.description;
        this.category = info.category;
        this.ownerOnly = info.ownerOnly || false;
    }

    abstract execute(ctx: ButtonContext): void;
}