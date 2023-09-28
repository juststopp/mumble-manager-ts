import type Client from '../../../main';
import { resolve } from "path";
import { Collection, ApplicationCommandManager, ApplicationCommandType } from "discord.js";
import { access, readdir, stat } from "fs/promises";
import Command from "../Command";

class CommandManager {
    private _client: typeof Client;
    private _commands: Collection<string, Command>;
    private _path: string;
    private _slashCommands: ApplicationCommandManager;

    constructor(client: typeof Client) {
        this._client = client;
        this._commands = new Collection();
        this._path = resolve(__dirname, "..", "..", "commands");
        if(!this._client.application) throw new Error("Appication is null.");
        this._slashCommands = this._client.application.commands;
    }

    get commands(): Collection<string, Command> {
        return this._commands;
    }

    addCommand(command: Command): void {
        this._commands.set(command.name.toLowerCase(), command);
    }

    findCommand(name: string): Command | undefined {
        if(!name || typeof name !== "string") return undefined;
        return this._commands.find((cmd) => {
            return cmd.name.toLowerCase() === name.toLowerCase();
        });
    }

    async loadCommands(): Promise<void> {
        try {
            await access(this._path);
        } catch (error) { return; }

        await this._slashCommands.fetch();
        const categorys = await readdir(this._path);

        if (!categorys || categorys.length > 0) {

            for (const category of categorys) {
                const path = resolve(this._path, category);
                const stats = await stat(path);

                if (stats.isDirectory()) {
                    const commands = await readdir(path);

                    if (commands && commands.length > 0) {
                        for (const command of commands) {
                            const cmdPath = resolve(path, command);
                            const cmdStats = await stat(cmdPath);

                            if (cmdStats.isFile() && command.endsWith(".js")) {
                                this.addCommand(new (require(cmdPath).default));
                            }
                        }
                    }
                }
            }
        }

        await this._slashCommands.set(this._commands.map((cmd: Command) => {
            switch (cmd.type) {
                case ApplicationCommandType.ChatInput: {
                    return {
                        name: cmd.name,
                        type: ApplicationCommandType.ChatInput,
                        description: cmd.description,
                        options: cmd.options
                    }
                }
                case ApplicationCommandType.Message: {
                    return {
                        name: cmd.name,
                        type: cmd.type
                    }
                }
                case ApplicationCommandType.User: {
                    return {
                        name: cmd.name,
                        type: cmd.type
                    }
                }
            }
        }), this._client.config.bot.support);

    }
}

export default CommandManager;