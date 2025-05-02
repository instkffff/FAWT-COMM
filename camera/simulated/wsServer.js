import { markerSetGenerator } from './wsSim.js';
import { WebSocketServer } from 'ws';

// 创建 WebSocket 服务器，监听端口 8080
const wss = new WebSocketServer({ port: 8765 });

// 示例用法
const generator = markerSetGenerator([
  { MarkerSetName: "abc", pointNumber: 4 },
  { MarkerSetName: "def", pointNumber: 3 }
]);

// 发送数据的函数
function sendData() {
  const data = generator.next().value;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// 每 0.01 秒发送一次数据
const intervalId = setInterval(sendData, 10);

// 处理客户端连接
wss.on('connection', (ws) => {
  console.log('New client connected');

  // 处理客户端断开连接
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on ws://localhost:8765`);