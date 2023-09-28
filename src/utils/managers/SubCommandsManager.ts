import { resolve } from "path";
import { Collection } from "discord.js";
import { access, readdir, stat } from "fs/promises";
import Command from "../Command";

class SubCommandsManager {
    private sub_commands: Collection<string, Command>;
    private _path: string;

    constructor() {
        this.sub_commands = new Collection<string, Command>();
        this._path = resolve(__dirname, "..", "..", "components", "subcommands");
    }

    get subcommands(): Collection<string, Command> {
        return this.sub_commands;
    }

    addSubCommand(category: string, command_group: string, command: Command, name: string): void {
        this.sub_commands.set(category.toLowerCase()+'.'+command_group.toLowerCase()+'.'+name, command);
    }

    findSubCommand(name: string, category: string, command_group: string = 'undefined'): Command | undefined {
        if(!name || typeof name !== "string") return undefined;
        return this.subcommands.get(category.toLowerCase()+'.'+(command_group ? command_group.toLowerCase() : 'undefined')+'.'+name.toLowerCase());
    }

    async loadSubCommands(): Promise<void> {
        try {
            await access(this._path);
        } catch (error) { return console.log(error); }

        const categorys = await readdir(this._path);

        if (!categorys || categorys.length > 0) {

            for (const category of categorys) {
                const path = resolve(this._path, category);
                const stats = await stat(path);

                if (stats.isDirectory()) {
                    const subcommand_cates = await readdir(path);

                    if (!subcommand_cates || subcommand_cates.length > 0) {

                        for (const subcommand_cate of subcommand_cates) {
                            const subcommand_cate_path = resolve(path, subcommand_cate);
                            const subcommand_cate_stats = await stat(subcommand_cate_path);

                            if (subcommand_cate_stats.isDirectory()) {
                                const commands = await readdir(subcommand_cate_path);

                                if (commands && commands.length > 0) {
                                    for (const command of commands) {
                                        const cmdPath = resolve(subcommand_cate_path, command);
                                        const cmdStats = await stat(cmdPath);

                                        if (cmdStats.isFile() && command.endsWith(".js")) {
                                            const cmd: Command = new (require(cmdPath).default);
                                            this.addSubCommand(category, subcommand_cate, cmd, cmd.name);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}

export default SubCommandsManager;