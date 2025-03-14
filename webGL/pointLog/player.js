import { WebSocketServer } from 'ws';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

// 设置帧率，单位为毫秒
const intervalNum = 100;

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块的目录路径
const __dirname = dirname(__filename);

// 使用 __dirname 获取当前脚本文件所在的目录
const logFilePath = join(__dirname, 'blenderSim.log');

// 创建WebSocket服务器
const wss = new WebSocketServer({ port: 8080 });

// 存储每帧的数据
const frames = {};

// 配置变量，控制是否重复播放
const repeat = true; // 设置为 true 以启用重复播放，设置为 false 以禁用重复播放

// 创建可读流
const stream = createReadStream(logFilePath, { encoding: 'utf-8' });

let buffer = '';

stream.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    lines.slice(0, -1).forEach((line) => {
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
    buffer = lines[lines.length - 1]; // 保留最后一行以防不完整
});

stream.on('end', () => {
    if (buffer.trim() !== '') { // 处理最后一行
        const parts = buffer.split(',');
        const FrameNo = parseInt(parts[0], 10);
        const positions = parts.slice(1).map(Number);

        if (!frames[FrameNo]) {
            frames[FrameNo] = [];
        }

        frames[FrameNo].push(...positions);
    }

    console.log('File reading completed.');

    // 处理WebSocket连接
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
                frameIndex++;
            } else {
                console.log('All frames sent');
                if (repeat) {
                    frameIndex = 0; // 重新开始播放
                } else {
                    ws.close();
                }
            }
        };

        // 使用 setInterval 来确保帧率一致
        const intervalId = setInterval(() => {
            if (frameIndex >= frameNumbers.length && !repeat) {
                clearInterval(intervalId);
                ws.close();
            } else {
                sendFrame();
            }
        }, intervalNum); // 每100毫秒发送一帧
    });

    wss.on('close', () => {
        console.log('Client disconnected');
    });

    console.log('WebSocket server started on ws://localhost:8080');
});

stream.on('error', (err) => {
    console.error('Error reading file:', err);
});