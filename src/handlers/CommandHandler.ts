import type Client from "../../main";
import { CommandInteraction, GuildChannel, ThreadChannel, Guild, PermissionsBitField, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import Context from "../utils/Context";

class CommandHandler {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle(interaction: CommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) {
        if(interaction.user.bot || !interaction.inGuild()) return;
        
        const guild: Guild = interaction.guild;

        if(!(interaction.channel instanceof GuildChannel) && !(interaction.channel instanceof ThreadChannel)) throw new Error("Salon introuvable.");
        const channelBotPerms = new PermissionsBitField(interaction.channel.permissionsFor(this.client.user));

        const command = this.client.commands.findCommand(interaction.commandName);
        if(!command) return;

        const ctx: Context = new Context(this.client, interaction);

        if(command.ownerOnly && !this.client.config.bot.owners.includes(interaction.user.id)) return interaction.reply({content: "`❌` - Vous n'avez pas la permission requise pour cette action.", ephemeral: true });

        try {
            await command.run(ctx);
            this.client.logger.info(`La commande ${command.name} a été effectuée par ${ctx.member.user.username} sur le serveur ${ctx.guild.name}`);
        } catch(err) {
            interaction.reply({content: "`❌` - Oops, une erreur est survenue lors de l'utilisation de la commande. Veuillez ré-essayer plus tard.", ephemeral: true})
            this.client.logger.error(err);
        }
    }
}

export default CommandHandler;