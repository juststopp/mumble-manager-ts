import Command from "../../utils/Command";
import Context from "../../utils/Context";
import { PermissionsBitField, ApplicationCommandOptionType, ApplicationCommandType} from 'discord.js';
import { IUser } from '../../utils/database/models/User.model';

export default class extends Command {
    constructor() {
        super({
            name: "create",
            category: "main",
            description: "Create your own mumble server.",
            type: ApplicationCommandType.ChatInput,
            botPerms: [PermissionsBitField.Flags.Administrator],
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "nom",
                    description: "Nom du serveur mumble.",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "slots",
                    description: "Nombre de slots disponnibles.",
                    required: true,
                    choices: [
                        {
                            name: '10 Slots',
                            value: 10
                        },
                        {
                            name: '25 Slots',
                            value: 25
                        },
                        {
                            name: '40 Slots',
                            value: 10
                        },
                        {
                            name: '70 Slots',
                            value: 70
                        },
                        {
                            name: '100 Slots',
                            value: 100
                        },
                        {
                            name: '150 Slots',
                            value: 150
                        },
                        {
                            name: '200 Slots',
                            value: 200
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'mdp_superuser',
                    description: 'Mot de passe du SuperUser.',
                    required: true
                },
                {                    
                    type: ApplicationCommandOptionType.String,
                    name: 'mdp_server',
                    description: 'Mot de passe du serveur.',
                    required: false
                }
            ]
        });
    }

    async run(ctx: Context) {
        const name: string = ctx.args.getString('nom');
        const slots: number = ctx.args.getInteger('slots');
        const password: string = ctx.args.getString('mdp_superuser');
        const server_password: string = ctx.args.getString('server_password');

        ctx.reply({ content: "Création du plan de paiement...", ephemeral: true });

        const billing_datas: { url: string, token: string } = (await ctx.client.api.createBillingAgreement()) as { url: string, token: string, id: string };
        ctx.editReply({ content: `Plan de paiement créé, voici le lien: ${(billing_datas)?.url.toString() }` });

        const user: IUser = await ctx.client.db.createMumble(billing_datas, ctx.author.id, { name, slots, password, server_password });
        user.save();
    }

}