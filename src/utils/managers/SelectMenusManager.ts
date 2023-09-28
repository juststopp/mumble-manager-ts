import { resolve } from "path";
import { Collection } from "discord.js";
import { access, readdir, stat } from "fs/promises";
import SelectMenu from "../SelectMenu";

class SelectMenusManager {
    private _selectmenus: Collection<string, SelectMenu>;
    private _path: string;

    constructor() {
        this._selectmenus = new Collection();
        this._path = resolve(__dirname, "..", "..", "components", "selectMenus");
    }

    get selectmenus(): Collection<string, SelectMenu> {
        return this._selectmenus;
    }

    addSelectMenu(menu: SelectMenu): void {
        this._selectmenus.set(menu.name.toLowerCase(), menu);
    }

    findSelectMenu(name: string): SelectMenu | undefined {
        if(!name || typeof name !== "string") return undefined;
        return this._selectmenus.find((menu) => {
            return menu.name.toLowerCase() === name.toLowerCase();
        });
    }

    async loadSelectMenus(): Promise<void> {
        try {
            await access(this._path);
        } catch (error) { return; }

        const menus = await readdir(this._path);

        if (menus && menus.length > 0) {
            for (const menu of menus) {
                const menuPath = resolve(this._path, menu);
                const menuStats = await stat(menuPath);

                if (menuStats.isFile() && menu.endsWith(".js")) {
                    this.addSelectMenu(new (require(menuPath).default));
                }
            }
        }

    }
}

export default SelectMenusManager;