const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

exports.registerCommands = async client =>
{
    commands = [];
    exports.handlers = [];

    for(const file of fs.readdirSync("./commands"))
    {
        if(file.endsWith(".cmd.js"))
        {
            delete require.cache[require.resolve("./commands/" + file)];
            let cmd = require("./commands/" + file);

            if(cmd.init != undefined)
            {
                await cmd.init();
            }

            slashCmd = new SlashCommandBuilder().setName(cmd.name).setDescription(cmd.description);
            if(cmd.options != undefined)
            {
                slashCmd.options = cmd.options;
            }

            if(cmd.defaultPermissions != undefined)
            {
                slashCmd.setDefaultPermission(cmd.defaultPermissions);
            }

            commands.push(slashCmd);
            exports.handlers.push(cmd);
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env['TOKEN']);

    try
    {
        for(const [id, guild] of client.guilds.cache)
        {
            console.log(`[COMMANDS] Registering commands for guild ${guild.name}`);

            com = await rest.put(
                Routes.applicationGuildCommands(process.env['CLIENT_ID'], id),
                { body: commands },
            );

            for(const command of com)
            {
                r = [];
                for(const cmd of exports.handlers)
                {
                    if(cmd.name == command.name && cmd.permissions != undefined)
                    {
                        for(const perm of cmd.permissions)
                        {
                            if(perm.guild_id == undefined || perm.guild_id == id)
                            {
                                r.push({type: perm.type, id: perm.id, permission: perm.permission});
                            }
                        }
                    }
                }

                await rest.put(
                    Routes.applicationCommandPermissions(process.env['CLIENT_ID'], id, command.id),
                    { body:  {permissions: r}}
                );
            }

            console.log(`[COMMANDS] Successfully registered commands for ${guild.name}`);
        }
    }
    catch (error)
    {
        console.error(error);
    }
}

exports.getOptions = (optionDescriptors, options) =>
{
    cfg = {};

    optionDescriptors.forEach(desc => {
        opt = options.get(desc.name);
        if(opt.type != "SUB_COMMAND" && opt.type != "SUB_COMMAND_GROUP")
        {
            if(opt.type == "USER")
                cfg[desc.name] = opt.member;
            else if(opt.type == "CHANNEL")
                cfg[desc.name] = opt.channel;
            else if(opt.type == "Role")
                cfg[desc.name] = opt.role;
            else
                cfg[desc.name] = opt.value;
        }
    });

    return cfg;
}