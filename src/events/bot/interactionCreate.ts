import type { ButtonInteraction, CommandInteraction, Interaction, SelectMenuInteraction } from "discord.js";
import type Client from "../../../main";
import CommandHandler from "../../handlers/CommandHandler";
import ModalHandler from "../../handlers/ModalHandler";
import SelectMenuHandler from "../../handlers/SelectMenuHandler";
import ButtonHandler from "../../handlers/ButtonHandler";
import DiscordEvent from "../../utils/DiscordEvent";

class InteractionCreate extends DiscordEvent {
    commands: CommandHandler;
    modals: ModalHandler;
    menus: SelectMenuHandler;
    buttons: ButtonHandler;
    constructor(client: typeof Client) {
        super(client, "interactionCreate");
        this._client = client;
        this.commands = new CommandHandler(this._client);
        this.modals = new ModalHandler(this._client);
        this.menus = new SelectMenuHandler(this._client);
        this.buttons = new ButtonHandler(this._client);
    }

    async run(interaction: Interaction) {
        if(interaction.isButton() || interaction.isSelectMenu()) {
            if((interaction as (SelectMenuInteraction | ButtonInteraction)).customId.includes('-collector')) return;
        }

        if(interaction.isChatInputCommand() || interaction.isContextMenuCommand()) return await this.commands.handle(interaction);
        if(interaction.isModalSubmit()) return await this.modals.handle(interaction);
        if(interaction.isSelectMenu()) return await this.menus.handle(interaction);
        if(interaction.isButton()) return await this.buttons.handle(interaction);
    }
}

module.exports = InteractionCreate;