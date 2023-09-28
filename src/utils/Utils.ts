import type Client from '../.././main';
import { resolve } from 'path';
import { Collection, Guild, Message, NewsChannel, TextChannel } from 'discord.js';

class Utils {
    private _client: typeof Client;
    constructor(client: typeof Client) {
        this._client = client;
    }

    lang(lang: string): JSON {
        const path = resolve(__dirname, "..", "..", "..", "lang");
        const langPath = resolve(path, `${lang}.json`)
        return require(langPath);
    }

    async awaitMessages(channel: TextChannel | NewsChannel, author_id: string, time: number, max: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            channel.awaitMessages({ filter: message => message.author.id === author_id && message.channel.id === channel.id, time, errors: ['time'], max }).then((collected: Collection<string, Message<boolean>>) => {
                resolve(collected.first().content);
            }).catch(err => reject("Time exceeded."));
        })
    }

    truncateString(str: string, endIndex: number): string {
        if(endIndex >= str.length) return str;
        return str.slice(0, endIndex) + '...';
    }
    
}

export default Utils;