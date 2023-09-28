import type Client from "../../main";
import ButtonContext from '../utils/ButtonContext';
import { ButtonInteraction, Guild, TextChannel } from "discord.js";
import Button from "../utils/Button";

class ButtonHandler {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle(interaction: ButtonInteraction) {
        if(interaction.user.bot || !interaction.inGuild()) return;
        
        const guild: Guild = interaction.guild;

        const button: Button = await this.client.buttons.findButton(interaction.customId.split('/')[0]);
        if(!button) {
            this.client.logger.error(`[ButtonHandler] Button ${interaction.customId.split('/')[0]} not found.`);
            ((await this.client.channels.fetch('973301115758211113')) as TextChannel).send(`🚨・Button with id \`${interaction.customId.split('/')[0]}\` not found.`);
            return interaction.reply({ content: '🚨・It seems that an internal error occured. This bug has been reported to our devs.', ephemeral: true})
        }

        const args: string[] = interaction.customId.split('/');
        const ctx: ButtonContext = new ButtonContext(this.client, interaction, args);
        
        if(button.ownerOnly === true && !this.client.config.bot.owners.includes(interaction.user.id)) return interaction.reply({content: "`❌` - Vous n'avez pas la permission requise pour cette action.", ephemeral: true});;

        await button.execute(ctx);
    }
}

export default ButtonHandler;