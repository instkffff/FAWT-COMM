// socketServer.js
import { createServer } from 'net';
import { httpServer } from './httpServer.js';
import { parsePacket } from '../Packet/PacketParse.js';
import { generatorPacket } from '../Packet/PacketGenerator.js';
import { clients, rpmMatrixCsv, TSOKMatrixCSV } from './shared.js';

import { RDR2Matrix, RDR2MatrixCSV, writeToRDRHTML } from './dataHandler/RDR2Matrix.js';
import { TSOK2Matrix, writeToTSOKHTML, matrix12x12 } from './dataHandler/TSOK2Matrix.js';

const PORT = 1000; // TCP 端口
const HTTP_PORT = 3001; // HTTP 端口

const test = false;

const server = createServer((socket) => {
    let clientId = null;

    // 获取客户端的 IP 地址最后一位
    const clientAddress = socket.remoteAddress;
    clientId = clientAddress.split('.').pop();
    clients[clientId] = socket;
    console.log(`Client ${clientId} connected`);

    if(test === false){
        
    }

    

    socket.on('data', (data) => {

        const Data = data 

        if (Data.length < 4) {

            if(test === true) {
                clientId = Data.toString().trim();
                clients[clientId] = socket;
                console.log(`Client ${clientId} connected`);
            }

            /* clientId = Data.toString().trim();
            clients[clientId] = socket;
            console.log(`Client ${clientId} connected`); */

        } else {
            const packet = parsePacket(Data);
            console.log(clientId, packet)
            if (packet.header === 'RDR') {
                const matrix36CSV = RDR2MatrixCSV(packet, clientId, rpmMatrixCsv[3], rpmMatrixCsv[2]); 
                rpmMatrixCsv[0] = matrix36CSV.rpmMatrixF;
                rpmMatrixCsv[1] = matrix36CSV.rpmMatrixL;
            } else if (packet.header === 'TSOK') {
                TSOKMatrixCSV[0] = TSOK2Matrix(clientId, TSOKMatrixCSV[1])
            }
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
