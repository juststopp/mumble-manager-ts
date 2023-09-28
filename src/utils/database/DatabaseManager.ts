import { connect } from "mongoose";
import { IUser, UserModel } from './models/User.model';
import moment from 'moment';

class DatabaseManager {

    constructor() {
    }

    async start(URL: string): Promise<void> {
        await connect(URL);
    }

    async createMumble(billing_datas: { url: string, token: string }, author_id: string, mumble_datas: { name: string, slots: number, password: string, server_password: string }): Promise<IUser> {
        const user = await UserModel.create({ id: author_id, billing: { url: billing_datas.url, token: billing_datas.token }, dates: { start: moment().format('YYYY-MM-DD'), end: moment().add(1, 'M').format('YYYY-MM-DD') }, mumble: mumble_datas });
        return user;
    }
}

export default DatabaseManager;