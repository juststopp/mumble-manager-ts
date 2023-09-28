import { Client, LimitedCollection, IntentsBitField, Partials, Collection } from "discord.js";
import CommandsManager from "./src/utils/managers/CommandsManager";
import EventsManager from "./src/utils/managers/EventsManager";
import ModalsManager from "./src/utils/managers/ModalsManager";
import SelectMenusManager from "./src/utils/managers/SelectMenusManager";
import ButtonsManager from "./src/utils/managers/ButtonsManager";
import SubCommandsManager from "./src/utils/managers/SubCommandsManager";
import DatabaseManager from "./src/utils/database/DatabaseManager";
import API from './src/api/index';
import Logger from "./src/utils/Logger";
import Utils from './src/utils/Utils';
import * as config from "./config";

class Bot extends Client {
    config: any;
    logger: Logger;
    events: EventsManager;
    modals: ModalsManager;
    selectMenus: SelectMenusManager;
    buttons: ButtonsManager;
    subcommands: SubCommandsManager;
    commands: CommandsManager;
    db: DatabaseManager;
    utils: Utils;
    api: API;

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds, 
                IntentsBitField.Flags.MessageContent, 
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions, 
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildInvites,
                IntentsBitField.Flags.GuildBans,
                IntentsBitField.Flags.GuildEmojisAndStickers,
                IntentsBitField.Flags.GuildWebhooks,
                IntentsBitField.Flags.GuildIntegrations,
                IntentsBitField.Flags.GuildScheduledEvents
            ],
            partials: [
                Partials.Message,
                Partials.GuildMember,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
                Partials.Channel,
                Partials.GuildScheduledEvent
            ]
        });

        this.config = config.default;
        this.logger = new Logger(`Shard#${this.shard?.ids?.toString() ?? "0"}`);
        this.events = new EventsManager(this);
        this.modals = new ModalsManager();
        this.selectMenus = new SelectMenusManager();
        this.buttons = new ButtonsManager();
        this.subcommands = new SubCommandsManager();
        this.db = new DatabaseManager();
        this.utils = new Utils(this);
        this.api = new API(this);

        this.launch();
    }

    async launch() {
        await this.events.loadEvents();
        await this.modals.loadModals();
        await this.selectMenus.loadSelectMenus();
        await this.buttons.loadButtons();
        await this.subcommands.loadSubCommands();
        await this.db.start(this.config.db);
        this.api.start();

        this.logger.success(`[Events] ${this.events?.events.size} évènements ont été chargés.`);
        this.logger.success(`[Modals] ${this.modals?.modals.size} modals ont été chargés.`);
        this.logger.success(`[SelectMenus] ${this.selectMenus?.selectmenus.size} selectMenus ont été chargés.`);
        this.logger.success(`[Buttons] ${this.buttons?.buttons.size} buttons ont été chargés.`);
        this.logger.success(`[SubCommands] ${this.subcommands?.subcommands.size} sous-commandes ont été chargés.`);

        try { 
            this.login(this.config.bot.token);
            this.logger.success(`Le WebSocket a correctement été établie avec Discord.`);
        } catch(err) {
            this.logger.error(`Une erreur est apparue lors du lancement du bot: ${err}`);
            return process.exit(1);
        }
    }
}

export default new Bot();