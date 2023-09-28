import { resolve } from "path";
import { Collection } from "discord.js";
import { access, readdir, stat } from "fs/promises";
import Modal from "../Modal";

class ModalManager {
    private _modals: Collection<string, Modal>;
    private _path: string;

    constructor() {
        this._modals = new Collection();
        this._path = resolve(__dirname, "..", "..", "components", "modals");
    }

    get modals(): Collection<string, Modal> {
        return this._modals;
    }

    addModal(modal: Modal): void {
        this._modals.set(modal.name.toLowerCase(), modal);
    }

    findModal(name: string): Modal | undefined {
        if(!name || typeof name !== "string") return undefined;
        return this._modals.find((modal) => {
            return modal.name.toLowerCase() === name.toLowerCase();
        });
    }

    async loadModals(): Promise<void> {
        try {
            await access(this._path);
        } catch (error) { return; }

        const modals = await readdir(this._path);

        if (modals && modals.length > 0) {
            for (const command of modals) {
                const modalPath = resolve(this._path, command);
                const modalStats = await stat(modalPath);

                if (modalStats.isFile() && command.endsWith(".js")) {
                    this.addModal(new (require(modalPath).default));
                }
            }
        }

    }
}

export default ModalManager;