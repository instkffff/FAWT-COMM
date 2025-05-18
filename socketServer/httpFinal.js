// httpServer.js
import { createServer as _createServer } from 'http';
import { clients } from './shared.js';
import { generatorPacket } from '../Packet/PacketGenerator.js';

const httpServer = _createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send') {
        handlePostSend(req, res);
    } else {
        sendResponse(res, 404, 'Not Found');
    }
});

function handlePostSend(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const { id, msg } = JSON.parse(body);
            const result = sendMessageToClient(id, msg);
            sendResponse(res, 200, { id, msg, status: result ? 'succeed' : 'failed' });
        } catch (error) {
            const { id, msg } = JSON.parse(body);
            sendResponse(res, 500, { id, msg, status: 'failed', error: error.message });
        }
    });
}

function sendMessageToClient(clientId, msg) {
    const client = clients[clientId];
    if (client && !client.destroyed) {
        client.write(generatorPacket(msg));
        return true;
    } else {
        console.error(`Client ${clientId} not found or not ready`);
        return false;
    }
}

function sendResponse(res, statusCode, message) {
    if (typeof message === 'string') {
        res.writeHead(statusCode, { 'Content-Type': 'text/html' });
        res.end(message);
    } else {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message));
    }
}

export { httpServer, sendMessageToClient };