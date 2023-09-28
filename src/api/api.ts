import EventEmitter from 'node:events';
import express from 'express';
import Client from '../../main';
import { IUser, UserModel } from '../utils/database/models/User.model';
import fs from 'fs';
import path from 'path';
import { GuildMember } from 'discord.js';

export default class Server extends EventEmitter {
    private port: number;
    private app: express.Application;
    private client: typeof Client;

    constructor(port: number, app: express.Application, client: typeof Client) {
        super({ captureRejections: true });        
        this.port = port;
        this.app = app;
        this.client = client;
    }

    get() {
        this.app.get('/', (req: any, res: any) => res.send('Useless page.'));
        this.app.get('/billing/return', async (req: express.Request, res: express.Response) => {
            if(!(req.query.token as string)) return res.send('Invalid token.');
            const response: {approved: Boolean, id: string} = await this.client.api.executeBillingAgreement(req.query.token as string);
            this.emit('payement', req.query.token as string, response);

            res.send('Paiement accepté.')
        })
        this.app.get('/billing/cancel', (req: express.Request, res: express.Response) => res.send('Paiement annulé.'))
    }

    listen() {
        this.app.listen(this.port, () => console.log(`Server Started on ${this.port}`));

        const getMostRecentFile = (dir: string) => {
            const files = orderReccentFiles(dir);
            return files.length ? files[0] : undefined;
        };
          
        const orderReccentFiles = (dir: string) => {
            return fs.readdirSync(dir)
              .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
              .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
              .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
        };

        this.on('payement', async (token: string, response: {approved: Boolean, id: string}) => {
            const mumbles_datas: IUser[] = await UserModel.find({});
            if(!mumbles_datas) return;

            const mumble_datas: IUser = mumbles_datas.find((u: IUser) => u.billing.token === token);
            if(!mumble_datas || mumble_datas.paid === true) return;

            const member = await this.client.users.fetch(mumble_datas.id);
            if(!member || !response.approved) {
                await UserModel.deleteOne({ id: mumble_datas.id });
                return;
            }

            var port: number = Number(getMostRecentFile('server').file?.split('-')[1]?.split('.')[0]);
            if(!port) port = 10000;

            port = port+1;

            mumble_datas.paid = true;
            mumble_datas.mumble.port = port;
            mumble_datas.billing.id = response.id;
            mumble_datas.save();

            member.send({ content: "`✅` - Votre paiement a été accepté. Création du serveur mumble en cours..." });
            const created: Boolean = await this.client.api.createMumble(mumble_datas);

            if(!created) {
                member.send("`❌` - Une erreur est apparue lors de la création de votre serveur mumble. Veuillez contacter le support en donnant le port de votre serveur: **" + port + "**.");
                return;
            }

            member.send("`✅` - Votre serveur mumble a correctement été créé. Voici les informations de connexion.\n**EN TANT QUE JOUEUR**:\n- Addresse: `mumble.juststop.dev` ;\n- Port: `"+port+"` ;\n- Mot de passe: "+(mumble_datas.mumble.server_password == '' ? 'Aucun mot de passe' : `\`${mumble_datas.mumble.server_password}\``)+".\n\n**EN TANT QUE SuperUser**\n- Utilisateur: `SuperUser` ;\nMot de passe: `"+mumble_datas.mumble.password+"`.\n\n**Merci pour votre achat.**");
            const guildMember: GuildMember = await this.client.guilds.cache.get('991033671416963196').members.fetch(mumble_datas.id);
            guildMember.roles.add('991034623272288296');
        })
    }
}