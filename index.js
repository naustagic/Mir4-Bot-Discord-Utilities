const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, clientId, guildId, channelId, presence } = require('./config/config.json'); // Inclua o guildId
const fs = require('fs');
const path = require('path');

// Inicialize o cliente
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences] });
client.commands = new Collection();
client.locales = {};

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands.d');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.json'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

// Carregar traduções
const localesPath = path.join(__dirname, 'locales');
const localeFiles = fs.readdirSync(localesPath).filter(file => file.endsWith('.json'));

for (const file of localeFiles) {
    const locale = require(path.join(localesPath, file));
    client.locales[file.split('.')[0]] = locale;
}

// Importar e configurar o bot
require('./bot')(client);

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setPresence(presence);
    
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
});


client.login(token);
