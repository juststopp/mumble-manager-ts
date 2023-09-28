import type SelectMenuContext from "./SelectMenuContext";

interface SelectMenuInfo {
    name: string;
    description: string;
    category: string;
    ownerOnly?: boolean;
}

export default abstract class SelectMenu {
    name: string;
    description: string;
    category: string;
    ownerOnly?: boolean;

    constructor(info: SelectMenuInfo) {
        this.name = info.name;
        this.description = info.description;
        this.category = info.category;
        this.ownerOnly = info.ownerOnly || false;
    }

    abstract execute(ctx: SelectMenuContext): void;
}