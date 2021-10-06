require('dotenv').config();

const { Client, Intents } = require("discord.js");
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]});
const commandsManager = require("./commands.js");
const rl = require('readline').createInterface({input: process.stdin, output: process.stdout, prompt: " > "});


client.once('ready', async () =>
{
    console.log(`Connecté en tant que ${client.user.tag}`);

    await commandsManager.registerCommands(client);
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    commandsManager.handlers.forEach(async cmd => {
        if(cmd.name === interaction.commandName)
        {
            cmd.handle(interaction, client).catch(console.error);
            return;
        }
    });
});

client.login(process.env['TOKEN']);

rl.on('line', async line =>
{
    try
    {
        switch(line.trim())
        {
        case "reloadCommands":
            await commandsManager.registerCommands(client);
            break;
        
        case "listCommands":
            console.log("Commandes : ");
            commandsManager.handlers.forEach(v => {
                console.log(" - " + v.name);
            });
            break;
        
        case "exit":
            client.destroy();
            process.exit(0);
        
        default:
            console.log("Commande non reconnue");
        }
    }
    catch(error)
    {
        console.error(error);
    }
    rl.prompt();
});
