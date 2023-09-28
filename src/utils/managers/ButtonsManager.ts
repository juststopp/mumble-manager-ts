import { resolve } from "path";
import { Collection } from "discord.js";
import { access, readdir, stat } from "fs/promises";
import Button from "../Button";

class ButtonsManager {
    private _buttons: Collection<string, Button>;
    private _path: string;

    constructor() {
        this._buttons = new Collection();
        this._path = resolve(__dirname, "..", "..", "components", "buttons");
    }

    get buttons(): Collection<string, Button> {
        return this._buttons;
    }

    addButton(button: Button): void {
        this._buttons.set(button.name.toLowerCase(), button);
    }

    findButton(name: string): Button | undefined {
        if(!name || typeof name !== "string") return undefined;
        return this._buttons.find((button) => {
            return button.name.toLowerCase() === name.toLowerCase();
        });
    }

    async loadButtons(): Promise<void> {
        try {
            await access(this._path);
        } catch (error) { return; }

        const buttons = await readdir(this._path);

        if (buttons && buttons.length > 0) {
            for (const button of buttons) {
                const buttonPath = resolve(this._path, button);
                const buttonStats = await stat(buttonPath);

                if (buttonStats.isFile() && button.endsWith(".js")) {
                    this.addButton(new (require(buttonPath).default));
                }
            }
        }

    }
}

export default ButtonsManager;