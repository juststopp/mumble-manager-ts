import type Client from "../../main";
import ModalContext from '../utils/ModalContext';
import { ModalSubmitInteraction, Guild } from "discord.js";
import Modal from "../utils/Modal";

class ModalHandler {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle(interaction: ModalSubmitInteraction) {
        if(interaction.user.bot || !interaction.inGuild()) return;
        
        const guild: Guild = interaction.guild;

        const modal: Modal = await this.client.modals.findModal(interaction.customId);
        const ctx: ModalContext = new ModalContext(this.client, interaction);
        
        if(modal.ownerOnly === true && !this.client.config.bot.owners.includes(interaction.user.id)) return interaction.reply({content: "`❌` - Vous n'avez pas la permission requise pour cette action.", ephemeral: true});;

        await modal.execute(ctx);
    }
}

export default ModalHandler;