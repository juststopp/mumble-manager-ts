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

# Usage

Feel free to use this code as you wish. If you use it in a comercial way, please don't forget to mention me as the original author.