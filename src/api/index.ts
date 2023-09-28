import Server from "./api";
import express from 'express';
import Client from '../../main';
import create, { cancel, execute, timer } from "./paypal/billing_agreement";
import { IUser } from "../utils/database/models/User.model";
import { exec } from "child_process";
import fs from 'fs';

export default class API {
    private server: Server;
    private client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
        this.server = new Server(8080, express(), this.client);
    };

    start() { 
        this.server.get(); 
        this.server.listen();
        timer(this.client);
    };
    async createBillingAgreement() { return await create() };
    async executeBillingAgreement(token: string) { return await execute(token) };
    async cancelBillingAgreement(id: string, reason: string) { return await cancel(id, reason); };

    async createMumble(datas: IUser): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            fs.writeFile(`server/mumble-${datas.mumble.port}.ini`, '', (err) => {
                if(err) reject(false);
            });

            fs.appendFile(`server/mumble-${datas.mumble.port}.ini`, `database=murmur-${datas.mumble.port}.sqlite\nice="tcp -h 127.0.0.1 -p 6502"\nicesecretwrite=\nlogfile=murmur-${datas.mumble.port}.log\nwelcometext="<br />Bienvenue sur le Mumble.<br />Bonne game!<br />"\nport=${datas.mumble.port}\nserverpassword=${datas.mumble.server_password}\nbandwidth=72000\nusers=${datas.mumble.slots}\nmessageburst=5\nmessagelimit=1\nallowping=true\nregisterName=${datas.mumble.name}\n[Ice]\nIce.Warn.UnknownProperties=1\nIce.MessageSizeMax=65536`, (err) => {
                if(err) reject(false);
            });

            exec(`./server/murmur.x86 -ini ./server/mumble-${datas.mumble.port}.ini`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                resolve(true);
            });
        })
    }
}