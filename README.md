# Mumble Manager

This program is an old version of the [mumble-manager](https://github.com/malobgdre/mumble-manager) that I made recently, using Typescript.

## How it works

First, this program in linked to a Discord bot. The bot is used to run the [create](./src/commands/main/Create.ts) command, which is used to create a mumble server.

### Create command

This command will ask the users for a few arguments:
* `name`: The name that will be shown at the top of the mumble server.
* `slots`: The maximum number of users that the mumble server will handle.
* `mdp_superuser`: The SuperUser password of the mumble server. *Not implemented*
* `mdp_server`: The password used to access to the mumble server. *Optinal argument*

The command will then create a **PayPal** billing agreement and send you the link to accept the agreement. Once accepted, your mumble server will be created automatically, and all the informations will be send to you in your Discord private messages.

### Payment

For the mumble server to be on 24/7, we ask you for 1$ each month. Originally, when you accept the agreement, you will be automatically charged each month. If you disbale the automatic payment, you'll receive a message from the bot 3 days before the mumble is deleted to warn you. If you don't pay, the mumble server will be automatically deleted, and all informations will be lost.

## Developers

If you are a developer, follow the next few steps to start the app.

## Create a Discord application

The Discord application, also known as bot, will be used for the create command to create a mumble server.

To create a discord bot, go to the [Discord Applications](https://discord.com/developers/applications) and save the token, you will need it in the next step.

When the bot is created, go to the **Bot**, and check/uncheck the following options:
* [ 𐄂 ] - Public bot
* [ 𐄂 ] - Requires OAuth2 code grant
* [ 𐄂 ] - Presence intent
* [ ✔ ] - Server member intent
* [ 𐄂 ] - Message content intent

## Create a MongoDB Database

To create a MongoDB Database, go to the MongoDB [website](https://mongodb.com), register yourself and then create a free database.

You will then be able to grab the connection URL.

**Don't forget to add your IP/VPS IP address to the network authorized addresses!**

## Create a config file

Then, you will need a config file. You can copy the following example, and edit it with your informations.

```js
// config.ts

export default {
    "bot": {
        "token": "", // The token of your Discord bot
        "shards": 'auto', // Don't touch that ! As a private bot, shards are not needed.
        "support": "", // The ID of your guild
        "owners": [""] // The list of the IDs of the owners of the bot
    },
    "paypal": {
        "mode": "", // The PayPal API mode. Choose between LIVE: using real money, for production; SANDBOX: using fake money, used for tests
        "client_id": "", // Your PayPal API clientId
        "client_secret": "", // Your PayPal API clientSecret

        "cancel_url": "", // The URL in case of the payment is cancelled (User clicked on Cancel)
        "return_url": "", // The URL when the payment has been processed (Accepted OR Declined)

        "price": "" // Price of the mumble server (Price per month in EUR)
    },
    "db": "" // Your MongoDB URL
}
```

## Start the bot

To start the bot, you only have two commands to run:

```sh
npm install
```

and then

```sh
npm run start
```

# Usage

Feel free to use this code as you wish. If you use it in a comercial way, please don't forget to mention me as the original author.