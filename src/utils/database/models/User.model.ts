import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
    id: string;
    billing: {
        url: string;
        token: string;
        id: string;
        last_transaction_id: string;
    },
    dates: {
        start: string;
        end: string;
    },
    mumble: {
        name: string;
        slots: number;
        password: string;
        port: number;
        server_password: string;
    },
    paid: boolean;
}

const UserSchema = new Schema<IUser>({
    id: { type: String, required: true },
    billing: {
        url: { type: String, required: true },
        token: { type: String, required: true },
        id: { type: String, required: false, default: '0'},
        last_transaction_id: { type: String, required: false, default: '0'}
    },
    dates: {
        start: { type: String, required: true},
        end: { type: String, required: true }
    },
    mumble: {
        name: { type: String, required: true },
        slots: { type: Number, required: true },
        password: { type: String, required: true },
        port: { type: Number, required: false, default: 0 },
        server_password: { type: String, required: false, default: '' }
    },
    paid: { type: Boolean, required: false, default: false }
})

export const UserModel = model<IUser>('User', UserSchema);