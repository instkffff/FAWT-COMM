import { WebSocketServer } from 'ws';
import { simulateFrames, generateFrameData } from '../camera/simulated/cameraSim.js';

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ port: 8080 });

// 配置 markerSetConfigs
const markerSetConfigs = [
    { name: 'MarkerSet1', numMarkers: 5 },
    { name: 'MarkerSet2', numMarkers: 3 }
];

// 发送帧数据，每隔 50 毫秒发送一条
function sendFrameData(ws) {
    let frameCounter = 0; // 定义计数器

    function sendNextFrame() {
        const frameData = generateFrameData(frameCounter, Date.now(), markerSetConfigs); // 使用计数器作为第一个参数
        ws.send(JSON.stringify(frameData));
        frameCounter++; // 每次发送后计数器加1
        setTimeout(sendNextFrame, 50);
    }

    sendNextFrame();
}

// 当有新的客户端连接时
wss.on('connection', (ws) => {
    console.log('New client connected');

    // 发送帧数据
    sendFrameData(ws);

    // 处理客户端消息
    ws.on('message', (message) => {
        console.log('Received message from client:', message);
    });

    // 处理客户端断开连接
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');