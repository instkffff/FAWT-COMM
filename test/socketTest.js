// socketServer.js
import { createServer } from 'net';

const PORT = 1000; // TCP 端口
const IP_ADDRESS = '192.168.1.100'; // 指定IP地址

const server = createServer((socket) => {
    // 获取客户端的 IP 地址
    const clientAddress = socket.remoteAddress;
    console.log(`Client ${clientAddress} connected`);

    socket.on('end', () => {
        console.log(`Client ${clientAddress} disconnected`);
    });

    socket.on('error', (err) => {
        console.error(`Socket error for client ${clientAddress}: ${err.message}`);
    });
});

server.listen(PORT, IP_ADDRESS, () => {
    console.log(`TCP Server running on ${IP_ADDRESS}:${PORT}`);
});