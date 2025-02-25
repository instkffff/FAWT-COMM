import { Socket } from 'net';

const SERVER_IP = '127.0.0.1'; // 服务器 IP 地址
const SERVER_PORT = 3000; // 服务器端口

// 客户端 1
const client1 = new Socket();

// 连接到服务器
client1.connect(SERVER_PORT, SERVER_IP, () => {
    console.log('Client 1 Connected to server');

    // 发送客户端 ID
    const clientId1 = '1';
    client1.write(clientId1);
});

// 处理服务器发送的数据
client1.on('data', (data) => {
    console.log(`Client 1 Received from server: ${data}`);
});

// 处理连接关闭事件
client1.on('close', () => {
    console.log('Client 1 Connection closed');
});

// 处理错误事件
client1.on('error', (err) => {
    console.error(`Client 1 Socket error: ${err.message}`);
});

// 客户端 2
const client2 = new Socket();

// 连接到服务器
client2.connect(SERVER_PORT, SERVER_IP, () => {
    console.log('Client 2 Connected to server');

    // 发送客户端 ID
    const clientId2 = '2';
    client2.write(clientId2);
});

// 处理服务器发送的数据
client2.on('data', (data) => {
    console.log(`Client 2 Received from server: ${data}`);
});

// 处理连接关闭事件
client2.on('close', () => {
    console.log('Client 2 Connection closed');
});

// 处理错误事件
client2.on('error', (err) => {
    console.error(`Client 2 Socket error: ${err.message}`);
});