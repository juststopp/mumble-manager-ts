import type Client from "../../main";
import SelectMenuContext from '../utils/SelectMenuContext';
import { SelectMenuInteraction, Guild } from "discord.js";
import SelectMenu from "../utils/SelectMenu";

class SelectMenusHandler {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle(interaction: SelectMenuInteraction) {
        if(interaction.user.bot || !interaction.inGuild()) return;

        const menu: SelectMenu = await this.client.selectMenus.findSelectMenu(interaction.customId);
        const ctx: SelectMenuContext = new SelectMenuContext(this.client, interaction);
        
        await menu.execute(ctx);
    }
}

export default SelectMenusHandler;