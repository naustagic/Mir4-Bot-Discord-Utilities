const amqp = require('amqplib');

const rabbitMQConfig = {
    protocol: 'amqp',
    hostname: '132.226.253.4',
    port: 5672,
    username: 'guest',
    password: 'rNB8yknDTrAn7H4'
};

let connection = null;
let channel = null;

async function connect() {
    if (!connection || !channel) {
        try {
            connection = await amqp.connect(rabbitMQConfig);
            channel = await connection.createChannel();
            console.log('Canal criado com sucesso');
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }
    return channel;
}

async function getChannel() {
    if (!channel) {
        channel = await connect();
    }
    return channel;
}

module.exports = { getChannel };
