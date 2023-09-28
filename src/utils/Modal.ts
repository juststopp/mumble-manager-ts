import type ModalContext from "./ModalContext";

interface ModalInfo {
    name: string;
    description: string;
    category: string;
    ownerOnly?: boolean;
}

export default abstract class Modal {
    name: string;
    description: string;
    category: string;
    ownerOnly?: boolean;

    constructor(info: ModalInfo) {
        this.name = info.name;
        this.description = info.description;
        this.category = info.category;
        this.ownerOnly = info.ownerOnly || false;
    }

    abstract execute(ctx: ModalContext): void;
}