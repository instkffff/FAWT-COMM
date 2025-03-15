// httpServer.js
import { createServer as _createServer } from 'http';
import { clients, rpmMatrixCsv, TSOKMatrixCSV } from './shared.js';
import { parsePacket } from '../Packet/PacketParse.js';
import { generatorPacket } from '../Packet/PacketGenerator.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { RDR2Matrix, RDR2MatrixCSV, writeToRDRHTML } from './dataHandler/RDR2Matrix.js';
import { TSOK2Matrix, writeToTSOKHTML } from './dataHandler/TSOK2Matrix.js';
import { createMatrix, fill36x36MatrixWith3x3Matrices, matrixToCSV, fill12x12MatrixWithNumbers  } from '../matrixFill/matrixFill.js';

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块的目录路径
const __dirname = dirname(__filename);

const httpServer = _createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send') {
        handlePostSend(req, res);
    } else if (req.method === 'GET' && req.url === '/RDR') {
        handleGetRDR(req, res);
    } else if (req.method === 'GET' && req.url === '/RDRL') {
        handleGetRDRL(req, res);
    } else if (req.method === 'GET' && req.url === '/RDRF') {
        handleGetRDRF(req, res);
    } else if (req.method === 'GET' && req.url === '/TSOK') {
        handleGetTSOK(req, res);
    } else if (req.method === 'GET' && req.url === '/TSRST') { // 新增的路由
        handleGetTSRST(req, res);
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
            sendResponse(res, 500, { id, msg, status: 'failed', error: error.message });
        }
    });
}

async function handleGetRDR(req, res) {
    await writeToRDRHTML(rpmMatrixCsv);
    await writeToTSOKHTML(TSOKMatrixCSV);
    try {
        const filePath = join(__dirname, '/html/RDR.html');
        const fileContent = readFileSync(filePath, 'utf8');
        sendResponse(res, 200, fileContent);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error');
    }
}

async function handleGetRDRL(req, res) {
    try {
        const filePath = join(__dirname, '/html/RDRL.html');
        const fileContent = readFileSync(filePath, 'utf8');
        sendResponse(res, 200, fileContent);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error');
    }
}

async function handleGetRDRF(req, res) {
    try {
        const filePath = join(__dirname, '/html/RDRF.html');
        const fileContent = readFileSync(filePath, 'utf8');
        sendResponse(res, 200, fileContent);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error');
    }
}

async function handleGetTSOK(req, res) {
    try {
        const filePath = join(__dirname, '/html/TSOK.html');
        const fileContent = readFileSync(filePath, 'utf8');
        sendResponse(res, 200, fileContent);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error');
    }
}

// 新增的处理函数
async function handleGetTSRST(req, res) {
    try {
        // 这里可以添加具体的逻辑，比如读取文件、处理数据等
        TSOKMatrixCSV[0] = matrixToCSV(createMatrix(12, 12))
        TSOKMatrixCSV[1] = createMatrix(12, 12)
        const message = 'Reset TSRST';
        sendResponse(res, 200, message);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error');
    }
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