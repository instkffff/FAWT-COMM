import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { join } from 'path';

// 日志文件路径
const logFilePath = join('marker_data_2025-03-13_23-55-36.log');

// 读取日志文件内容
const logData = readFileSync(logFilePath, 'utf-8').split('\n');

// 创建WebSocket服务器
const wss = new WebSocketServer({ port: 8080 });

// 存储每帧的数据
const frames = {};

logData.forEach(line => {
    if (line.trim() !== '') { // 确保不是空行
        const parts = line.split(',');
        const FrameNo = parseInt(parts[0], 10);
        const positions = parts.slice(1).map(Number);

        if (!frames[FrameNo]) {
            frames[FrameNo] = [];
        }

        frames[FrameNo].push(...positions);
    }
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    let frameNumbers = Object.keys(frames).map(Number).sort((a, b) => a - b);
    let frameIndex = 0;

    // 发送日志数据
    const sendFrame = () => {
        if (frameIndex < frameNumbers.length) {
            const FrameNo = frameNumbers[frameIndex];
            const positions = frames[FrameNo];

            // 将所有点放在一个Markers数组中
            const Markers = [];
            for (let i = 0; i < positions.length; i += 3) {
                Markers.push({
                    MarkerIndex: i / 3,
                    Position: positions.slice(i, i + 3)
                });
            }

            const frameObject = {
                FrameNo: FrameNo,
                TimeStamp: Date.now(), // 使用当前时间戳作为示例
                nMarkerset: 1,
                MarkerSets: [
                    {
                        Name: "object",
                        nMarkers: Markers.length,
                        Markers: Markers
                    }
                ]
            };

            ws.send(JSON.stringify(frameObject));
        } else {
            console.log('All frames sent');
            ws.close();
        }
        frameIndex++;
        setTimeout(sendFrame, 100); // 每100毫秒发送一帧
    };

    sendFrame();
});

wss.on('close', () => {
    console.log('Client disconnected');
});

console.log('WebSocket server started on ws://localhost:8080');