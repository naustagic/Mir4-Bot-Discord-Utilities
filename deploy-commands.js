const { Client, GatewayIntentBits } = require('discord.js');
const { token, clientId } = require('./config/config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    const guildId = '1076983550051627008'; // Substitua pelo ID do seu servidor
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
        console.error('Guild not found');
        return;
    }

    const commandsPath = path.join(__dirname, 'commands.d');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.json'));

    const commands = commandFiles.map(file => {
        const command = require(path.join(commandsPath, file));
        return {
            name: command.name,
            description: command.description,
            options: command.options
        };
    });

    try {
        await guild.commands.set(commands);
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }

    client.destroy(); // Desconectar após registrar os comandos
});

client.login(token);
