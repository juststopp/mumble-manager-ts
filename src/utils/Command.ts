import type { ApplicationCommandOptionData, ApplicationCommandType } from "discord.js";
import type Context from "./Context";

interface CommandInfo {
    name: string,
    description: string,
    category: string,
    type: ApplicationCommandType;
    options?: ApplicationCommandOptionData[],
    premium?: boolean,
    aliases?: string[],
    examples?: string[],
    userPerms?: bigint[],
    botPerms?: bigint[],
    disabled?: boolean,
    ownerOnly?: boolean,
    guildOnly?: boolean,
    testCmd?: boolean,
}

export default abstract class Command {
    name: string;
    description: string;
    category: string;
    options: ApplicationCommandOptionData[];
    examples: string[];
    userPerms: bigint[];
    botPerms: bigint[];
    disabled: boolean;
    type: ApplicationCommandType;
    ownerOnly: boolean;
    guildOnly: boolean;

    constructor(info: CommandInfo) {
        this.name = info.name;
        this.category = info.category;
        this.description = info.description;
        this.options = info.options || [];
        this.examples = info.examples || [];
        this.type = info.type;

        this.userPerms = info.userPerms || [];
        this.botPerms = info.botPerms || [];
        this.disabled = info.disabled || false;
        this.ownerOnly = info.ownerOnly || false;
        this.guildOnly = info.guildOnly || false;
    }

    abstract run(ctx: Context): void;
}