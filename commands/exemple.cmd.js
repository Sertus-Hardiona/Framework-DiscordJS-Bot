exports.name = "example";
exports.description = "An example command";
exports.options = [
	{
		name: "option1",
		description: "option1 description",
		type = 3,
		// 1 - Sub Command
		// 2 - Sub Command Group
		// 3 - String
		// 4 - Integer
		// 5 - Boolean
		// 6 - User
		// 7 - Channel
		// 8 - Role
		// 9 - Mentionable
		// 10 - Number (float)
		// c.f. https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type

	}
];
exports.defaultPermissions = false; // false : no one can access this command by default
exports.permissions = [
	{
        type: 2, // 1 - Role; 2 - User
        id: "0123456789876543210",
        permission: true
    }
];

exports.init = async () =>
{
	// Init the example command
}

exports.handle = async (client, interaction) =>
{
	interaction.reply("Example");
}