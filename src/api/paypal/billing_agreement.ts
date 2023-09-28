import moment from "moment";
import { IUser, UserModel } from "../../utils/database/models/User.model";
import Client from '../../../main';
import { GuildMember, User } from "discord.js";
import config from "../../../config";

const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': config.paypal.mode,
    'client_id': config.paypal.client_id,
    'client_secret': config.paypal.client_secret
});

var url = require('url');

var isoDate = new Date();
isoDate.setSeconds(isoDate.getSeconds() + 4);
isoDate.toISOString().slice(0, 19) + 'Z';

var billingPlanAttributes = {
    "description": "Création d'un plan d'achat pour un serveur mumble.",
    "merchant_preferences": {
        "auto_bill_amount": "yes",
        "cancel_url": config.paypal.cancel_url,
        "initial_fail_amount_action": "continue",
        "max_fail_attempts": "1",
        "return_url": config.paypal.return_url
    },
    "name": "Serveur Mumble",
    "payment_definitions": [
        {
            "amount": {
                "currency": "EUR",
                "value": config.paypal.price
            },
            "cycles": "0",
            "frequency": "MONTH",
            "frequency_interval": "1",
            "name": "Serveur Mumble",
            "type": "REGULAR"
        }
    ],
    "type": "INFINITE"
};

var billingPlanUpdateAttributes = [
    {
        "op": "replace",
        "path": "/",
        "value": {
            "state": "ACTIVE"
        }
    }
];

var billingAgreementAttributes = {
    "name": "Serveur Mumble",
    "description": "Agreement for Mumble Server Plan",
    "plan": {
        "id": "P-0NJ10521L3680291SOAQIVTQ"
    },
    "start_date": isoDate,
    "payer": {
        "payment_method": "paypal"
    },
    "shipping_address": {
        "line1": "StayBr111idge Suites",
        "line2": "Cro12ok Street",
        "city": "San Jose",
        "state": "CA",
        "postal_code": "95112",
        "country_code": "US"
    }
};

export default function create(): Promise<{} | string> {
    return new Promise<{} | string>((resolve, reject) => {
        paypal.billingPlan.create(billingPlanAttributes, function (error: any, billingPlan: any) {
            if (error) {
                reject(error);
                throw error;
            } else {
                isoDate = new Date();
                isoDate.setSeconds(isoDate.getSeconds() + 4);
                isoDate.toISOString().slice(0, 19) + 'Z';

                billingAgreementAttributes.start_date = isoDate;

                paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error: any, response: any) {
                    if (error) {
                        resolve(error);
                        throw error;
                    } else {
                        billingAgreementAttributes.plan.id = billingPlan.id;

                        paypal.billingAgreement.create(billingAgreementAttributes, function (error: any, billingAgreement: any) {
                            if (error) {
                                resolve(error);
                                throw error;
                            } else {
                                for (var index = 0; index < billingAgreement.links.length; index++) {
                                    if (billingAgreement.links[index].rel === 'approval_url') {
                                        var approval_url = billingAgreement.links[index].href;

                                        resolve({ url: approval_url, token: url.parse(approval_url, true).query.token });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    })    
}

export function execute(token: string): Promise<{approved: Boolean, id: string}> {
    return new Promise<{approved: Boolean, id: string}>((resolve, reject) => {
        paypal.billingAgreement.execute(token, {}, function (error: any, billingAgreement: any) {
            if (error) {
                resolve({approved: false, id: '' });
            } else {
                resolve({approved: true, id: billingAgreement.id})
            }
        });
    })
}

export function cancel(id: string, reason: string): Promise<string> {
    var cancel_note = {
        "note": reason
    };

    return new Promise<string>((resolve, reject) => {
        paypal.billingAgreement.cancel(id, cancel_note, function (error: any, response: any) {
            if (error) {
                resolve(error);
                throw error;
            } else {
        
                paypal.billingAgreement.get(id, function (error: any, billingAgreement: any) {
                    if (error) {
                        resolve(error);
                        throw error;
                    } else {
                        resolve(billingAgreement.state);
                    }
                });
            }
        });
    })
}

export function search(id: string, date: { start: string, end: string }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        paypal.billingAgreement.searchTransactions(id, date.start, date.end, function (error: any, results: any) {
            if (error) {
                resolve(error);
                throw error;
            } else {
                resolve(results);
            }
        });
    })
}

export function timer(client: typeof Client): void {
    setInterval(async () => {
        const serveurs: IUser[] = await UserModel.find({});
        serveurs.forEach(async(serveur: IUser) => {
            let transaction = await search(serveur.billing.id, serveur.dates);
            let user: User = await client.users.fetch(serveur.id);

            if(transaction.agreement_transaction_list[0].status !== "Completed") {
                if(moment().format('YYYY-MM-DD') === moment(serveur.dates.end).add(1, 'day').format('YYYY-MM-DD')) {
                    await UserModel.deleteOne({ billing: { token: serveur.billing.token, id: serveur.billing.id } });
                    
                    if(user) user.send("`❌` - Votre serveur a été supprimé car vous n'avez pas payé.")
                } else if(moment().add(3, 'days').format('YYYY-MM-DD') === moment(serveur.dates.end).add(1, 'day').format('YYYY-MM-DD')) {
                    if(user) user.send("`⚠️` - Votre serveur arrive a échéance dans 3 jours. Si d'ici là le payement n'est pas effectué, votre serveur sera supprimé.")
                }
            } else {
                if(serveur.billing.last_transaction_id === transaction.agreement_transaction_list[0].transaction_id) return;
                else {
                    serveur.set('billing.last_transaction_id', transaction.agreement_transaction_list[0].transaction_id);
                    serveur.set('dates.start', moment().format('YYYY-MM-DD'));
                    serveur.set('dates.end', moment().add(1, 'month').format('YYYY-MM-DD'));

                    serveur.save();
                }
            }
        })
    }, 1000 * 60 * 60 * 24)
}