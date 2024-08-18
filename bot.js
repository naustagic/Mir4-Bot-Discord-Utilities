const { InteractionType, fetchCharacter, fetchServerRanking, fetchClanRanking } = require('./api');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { channelId } = require('./config/config.json');
const serverData = require('./data/servers.json');

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
        // Verifique se a interação é no canal correto
        if (interaction.channel.id !== channelId) {
            console.log(`Comando enviado em um canal incorreto: ${interaction.channel.id}`);
            // Construa o link do canal usando o ID
            const channelLink = `<#${channelId}>`;
            return interaction.reply({ content: `This command cannot be used in this channel. Use in this channel ${channelLink}`, ephemeral: true });
        }

        const { commandName } = interaction;
        const locale = client.locales[interaction.locale] || client.locales['en']; // Definir idioma padrão para inglês

        console.log(`Comando recebido: ${commandName}`);

        if (commandName === 'search_character') {
            const name = interaction.options.getString('name');
            console.log(`Buscando personagem: ${name}`);

            // Mensagem de espera traduzida
            const searchingMessage = locale.searching_character || 'Searching for character, please wait...';
            const replyMessage = await interaction.reply({ content: searchingMessage, ephemeral: true, fetchReply: true });

            try {
                const data = await fetchCharacter(name);
                console.log('Dados recebidos:', data);
                
                const player = data.player;

                if (player) {
                    const classImages = {
                        1: { banner: 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-warrior5.webp', icon: 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_warrior.webp' },
                        2: { banner: 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-sorcerer5.webp', icon: 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_sorcerer.webp' },
                        3: { banner: 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-taoist5.webp', icon: 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_taoist.webp' },
                        4: { banner: 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-arbalist5.webp', icon: 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_arbalist.webp' },
                        5: { banner: 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-lancer5.webp', icon: 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_lancer.webp' },
                        6: { banner: 'https://file.mir4global.com/xdraco/img/common/nft-detail/nft-detail-darkist5.webp', icon: 'https://file.mir4global.com/xdraco/img/common/ranking/ico_klass_darkist.webp' }
                    };

                    const classNames = {
                        1: 'Warrior',
                        2: 'Sorcerer',
                        3: 'Taoist',
                        4: 'Arbalist',
                        5: 'Lancer',
                        6: 'Darkist'
                    };

                    // Função para formatar o número com separadores de milhar
                    const formatNumber = (number) => {
                        return new Intl.NumberFormat('pt-BR').format(number);
                    };

                    // Determinar o texto do ranking baseado no valor
                    const rankingText = player.ranking === 1 ? '🥇'
                        : player.ranking === 2 ? '🥈'
                        : player.ranking === 3 ? '🥉'
                        : player.ranking.toString();

                    const now = new Date();
                    const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                    const embed = new EmbedBuilder()
                        .setTitle(player.name)
                        .setThumbnail(classImages[player.charIndex]?.icon || '')
                        .setImage(classImages[player.charIndex]?.banner || '')
                        .addFields([
                            { name: locale.buscar_personagem.options.name.description, value: `\`\`\`${player.name}\`\`\``, inline: false },
                            { name: 'Class', value: `\`\`\`${classNames[player.charIndex] || 'Unknown'}\`\`\``, inline: false },
                            { name: 'Power', value: `\`\`\`${formatNumber(player.powerScore)}\`\`\``, inline: true },
                            { name: 'Level', value: player.characterLevel ? `\`\`\`${player.characterLevel.toString()}\`\`\`` : '```N/A```', inline: true },
                            { name: 'Clan', value: `\`\`\`${player.clan}\`\`\``, inline: false },
                            { name: 'Continent', value: `\`\`\`${player.serverCategory}\`\`\``, inline: true },
                            { name: 'Server', value: `\`\`\`${player.serverName}\`\`\``, inline: true },
                            { name: 'Server Ranking', value: `\`\`\`${rankingText}\`\`\``, inline: false } // Adiciona o ranking ao embed com emoji ou número
                        ])
                        .setColor('#0099ff')
                        .setFooter({ text: `by SaraLapia | ${timestamp}` });

                    console.log('Enviando resposta para o usuário');
                    // Envia uma nova mensagem com o embed e o texto "Done!"
                    await interaction.followUp({ content: `Done! ${interaction.user}`, embeds: [embed], ephemeral: false });
                } else {
                    console.log(`Personagem não encontrado: ${name}`);
                    await interaction.editReply({ content: locale.character_not_found.replace('{name}', `\`${name}\``), ephemeral: true });
                }
            } catch (error) {
                console.error('Erro ao processar o comando:', error);
                await interaction.editReply({ content: locale.error, ephemeral: true });
            }
        }
        
        if (commandName === 'server_ranking') {
            const region = interaction.options.getString('region');
            const server = interaction.options.getString('server');
            console.log(`Buscando ranking do servidor para ${server} na região ${region}`);

            const searchingMessage = locale.searching_server_ranking || 'Searching for server ranking, please wait...';
            let replyMessage;
            try {
                replyMessage = await interaction.reply({ content: searchingMessage, ephemeral: true, fetchReply: true });

                const data = await fetchServerRanking(server);
                console.log('Dados recebidos:', data);

                const clans = data.clans; // Ajuste o campo conforme a estrutura de resposta da API
  
                function formatNumber(number) {
                    return number.toLocaleString();
                }                
                if (clans && clans.length) {
                    const embed = new EmbedBuilder()
                        .setTitle(`Ranking do Servidor: ${server}`)
                        .addFields(clans.map(clan => ({
                            name: clan.name,
                            value: `**Leader**: ${clan.leaderName}\n**Power**: ${formatNumber(clan.powerScore)}\n**Total Members**: ${clan.membersCount}`,
                            inline: true
                        })))
                        .setColor('#0099ff')
                        .setFooter({ text: `by Sara Lapia | ${new Date().toLocaleString()}` });

                    await interaction.followUp({ content: '', embeds: [embed], ephemeral: false });
                } else {
                    await interaction.reply({ content: locale.no_clans_found || 'No clans found.', ephemeral: true });
                }
            } catch (error) {
                console.error('Erro ao buscar ranking do servidor:', error);
                if (replyMessage) {
                    await interaction.reply({ content: locale.error_message || 'An error occurred while fetching server ranking.', ephemeral: true });
                } else {
                    await interaction.reply({ content: locale.error_message || 'An error occurred while fetching server ranking.', ephemeral: true });
                }
            }
        }

        const classNames = {
            1: 'Warrior',
            2: 'Sorcerer',
            3: 'Taoist',
            4: 'Arbalist',
            5: 'Lancer',
            6: 'Darkist'
        };
        const now = new Date();
        const timestamp = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (commandName === 'clan_ranking') {
            const serverName = interaction.options.getString('server_name');
            const clanName = interaction.options.getString('clan_name');
            console.log(`Buscando ${serverName} na região ${clanName}`);
        
            const searchingMessage = locale.searching_clan_details || 'Searching for clan details, please wait.';
            let replyMessage;
            try {
                replyMessage = await interaction.reply({ content: searchingMessage, ephemeral: true, fetchReply: true });
        
                const data = await fetchClanRanking(serverName, clanName);
                console.log('Dados recebidos:', data);
        
                const clan = data.clan;
                if (clan) {
                    const membersList = clan.members.map((member, index) => {
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
                        const displayIndex = index < 3 ? medal : `${index + 1}.`;
                        return `\`\`\`${displayIndex} ${member.name} - ${classNames[member.charIndex] || 'Unknown'} - ${Math.floor(member.powerScore / 1000)}.${member.powerScore % 1000} PP\`\`\``;
                    });
        
                    const embeds = [];
                    const itemsPerPage = 20;
                    for (let i = 0; i < membersList.length; i += itemsPerPage) {
                        const embed = new EmbedBuilder()
                            .setTitle(clan.name)
                            .setColor('#0099ff')
                            .addFields([
                                { name: 'Clan Name', value: `\`\`\`${clan.name}\`\`\``, inline: false },
                                { name: 'Clan Power', value: `\`\`\`${clan.powerScore}\`\`\``, inline: true },
                                { name: 'Clan Members', value: `\`\`\`${clan.membersCount}\`\`\``, inline: true },
                                { name: 'Members List', value: membersList.slice(i, i + itemsPerPage).join('\n'), inline: false },
                            ])
                            .setTimestamp(new Date())
                            .setFooter({ text: `Last updated: ${timestamp}` });
                        embeds.push(embed);
                    }
        
                    let currentPage = 0;
        
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === embeds.length - 1)
                        );
        
                    const message = await interaction.editReply({ embeds: [embeds[currentPage]], components: [row] });
        
                    const filter = i => i.customId === 'previous' || i.customId === 'next';
                    const collector = message.createMessageComponentCollector({ filter, time: 600000 }); // 10 minutos
        
                    collector.on('collect', async i => {
                        if (i.customId === 'previous') {
                            currentPage--;
                        } else if (i.customId === 'next') {
                            currentPage++;
                        }
        
                        await i.update({
                            embeds: [embeds[currentPage]],
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('previous')
                                            .setLabel('Previous')
                                            .setStyle(ButtonStyle.Primary)
                                            .setDisabled(currentPage === 0),
                                        new ButtonBuilder()
                                            .setCustomId('next')
                                            .setLabel('Next')
                                            .setStyle(ButtonStyle.Primary)
                                            .setDisabled(currentPage === embeds.length - 1)
                                    )
                            ]
                        });
                    });
        
                    collector.on('end', async collected => {
                        try {
                            const fetchedMessage = await message.fetch();
                            await fetchedMessage.edit({ components: [] });
                        } catch (error) {
                            if (error.code !== 10008) {
                                console.error('Failed to remove components:', error);
                            }
                        }
                    });
                } else {
                    await interaction.editReply({ content: 'Clan not found.' });
                }
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'An error occurred while fetching clan details.' });
            }
        }
    });
};