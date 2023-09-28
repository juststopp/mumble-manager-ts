require('./src/utils/console/ascii')

import { ShardingManager, Shard } from 'discord.js';
import config from './config';
import Logger from './src/utils/Logger';

const managerLogger: Logger = new Logger("ShardingManager");
const manager: ShardingManager = new ShardingManager('./dist/main.js', {
    respawn: true,
    token: config.bot.token,
    totalShards: config.bot.shards as number | "auto"
});

manager.on('shardCreate', (shard: Shard) => {
    managerLogger.info(`Création de la Shard#${shard.id}`);
})

manager.spawn().then(() => {
    managerLogger.success(`Toutes les shards ont été lancées.`);
}).catch(err => {
    managerLogger.error(`Une erreur est apparue lors du lancement des shards: ${err}`);
})