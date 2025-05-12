import { createServer } from 'net';
import { httpServer } from './httpFinal.js';
import { parsePacket } from '../Packet/PacketParse.js';
import { clients } from './shared.js';
import { WebSocketServer } from 'ws'; // 确保 ws 模块正确导入

const PORT = 1000; // TCP 端口
const HTTP_PORT = 3003; // HTTP 端口
const WS_PORT = 1234; // WebSocket 端口

console.log(process.argv[4]);

const TEST = process.argv[4] === 'true';

const server = createServer((socket) => {
    let clientId = null;

    // 获取客户端的 IP 地址最后一位
    if (TEST === false) {
        const clientAddress = socket.remoteAddress;
        clientId = clientAddress.split('.').pop();
        clients[clientId] = socket;
        console.log(`Client ${clientId} connected`);
    }

    socket.on('data', (data) => {
        const Data = data;

        if (Data.length < 4) {
            if (TEST === true) {
                clientId = Data.toString().trim();
                clients[clientId] = socket;
                console.log(`Client ${clientId} connected`);
            }
        } else {
            const packet = parsePacket(Data);
            console.log(clientId, packet);
            packet.clientId = clientId;
            delete packet.checksum;
            // Send the parsed packet via WebSocket
            sendPacketToWebSocket(packet);
        }
    });

    socket.on('end', () => {
        if (clientId) {
            delete clients[clientId];
            console.log(`Client ${clientId} disconnected`);
        }
    });

    socket.on('error', (err) => {
        if (clientId) {
            console.error(`Socket error for client ${clientId}: ${err.message}`);
        } else {
            console.error(`Socket error: ${err.message}`);
        }
    });
});

server.listen(PORT, () => {
    console.log(`TCP Server running on port ${PORT}`);
});

httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: WS_PORT });

// Store connected WebSocket clients
const wsClients = new Set();

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    wsClients.add(ws);

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        wsClients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        wsClients.delete(ws);
    });
});

// Function to send packet to all connected WebSocket clients
function sendPacketToWebSocket(packet) {
    if (wsClients.size === 0) {
        console.log('No WebSocket clients connected.');
        return;
    }

    const message = JSON.stringify(packet); // Convert packet to JSON string

    wsClients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        } else {
            console.log('WebSocket client not open. Removing from list.');
            wsClients.delete(client);
        }
    });
}
