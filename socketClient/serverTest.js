import { parsePacket } from '../Packet/PacketParse.js';
import { generatorPacket } from '../Packet/PacketGenerator.js';

function createPacket(header, type, data = null) {
    return {
        header,
        type,
        data
    };
}

function createRandomData(length, maxValue = 255) {
    return Array.from({ length }, () => Math.floor(Math.random() * (maxValue + 1)));
}

// DT
const DT = createPacket('DT', 'DT', createRandomData(18));
const TS = createPacket('TS', 'TS', 'TEST');
const RD = createPacket('RD', 'RD');
const ST = createPacket('ST', 'ST');

const DTPacket = generatorPacket(DT);
const TSPacket = generatorPacket(TS);
const RDPacket = generatorPacket(RD);
const STPacket = generatorPacket(ST);

console.log('TSOKPacket:', TSPacket);

import net from 'net';

const server = net.createServer((socket) => {
    console.log('Client connected');

    let firstMessageReceived = false;

    socket.on('data', (data) => {
        if (!firstMessageReceived) {
            console.log('First message received:', data.toString());
            // 处理第一个消息的逻辑
            firstMessageReceived = true;
        } else {
            console.log('Received from client:', parsePacket(data));
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // 示例消息数组
    const messages = [TSPacket, DTPacket, RDPacket, STPacket, RDPacket];
    sendMessagesWithDelay(messages, socket);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// 封装的发送消息函数
function sendMessagesWithDelay(messages, socket, delay = 1000) {
    messages.forEach((message, index) => {
        setTimeout(() => {
            socket.write(message);
            console.log(`Sent message ${index + 1}:`, message);
        }, index * delay);
    });
}