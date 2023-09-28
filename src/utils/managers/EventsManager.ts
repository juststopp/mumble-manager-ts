import type Client from '../../../main';
import { Collection } from 'discord.js';
import { resolve } from 'path';
import type DiscordEvent from '../DiscordEvent';
import { access, readdir, stat } from 'fs/promises';

class EventsManager {
    private _client: typeof Client;
    private _events: Collection<string, DiscordEvent>;
    private _path: string;

    constructor(client: typeof Client) {
        this._client = client;
        this._events = new Collection();
        this._path = resolve(__dirname, '..', '..', 'events');
    }

    get events(): Collection<string, DiscordEvent> { return this._events; }

    addEvent(event: DiscordEvent): void {
        this._events.set(event._name.toLowerCase(), event);
        this._client.on(event._name, event.run.bind(event));
    }

    async loadEvents(): Promise<void> {
        try {
            await access(this._path);
        } catch(error) { return console.log(error); }

        const categorys = await readdir(this._path);
        if (!categorys || categorys.length > 0) {

            for (const category of categorys) {
                const path = resolve(this._path, category);
                const stats = await stat(path);

                if (stats.isDirectory()) {
                    const events = await readdir(path);

                    if (events && events.length > 0) {
                        for (const event of events) {
                            const eventPath = resolve(path, event);
                            const eventStats = await stat(eventPath);

                            if (event !== 'Event.js' && eventStats.isFile() && eventPath.endsWith(".js")) {
                                this.addEvent(new(require(eventPath))(this._client));
                            }
                        }
                    }
                }
            }
        }
    }
}

export default EventsManager;