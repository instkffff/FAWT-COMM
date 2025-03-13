import WebSocket from 'ws';
import { createWriteStream } from 'fs';
import { format } from 'date-fns';

// 生成唯一的文件名
const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
const fileName = `marker_data_${timestamp}.log`;

// 创建文件流以写入数据
const fileStream = createWriteStream(fileName, { flags: 'w' }); // 使用 'w' 标志创建新文件

// 帧计数器
let frameCounter = 0;

// 创建WebSocket客户端连接到服务器
const ws = new WebSocket('ws://localhost:8080');

// 当WebSocket连接打开时
ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

// 当接收到消息时
ws.on('message', (data) => {
    frameCounter++; // 增加帧计数器
    const frameData = JSON.parse(data);
    const markerSets = frameData.MarkerSets;

    markerSets.forEach(markerSet => {
        markerSet.Markers.forEach(marker => {
            const logEntry = `${frameCounter}, ${marker.Position[0]}, ${marker.Position[1]}, ${marker.Position[2]}\n`;
            fileStream.write(logEntry);
        });
    });
});

// 当WebSocket连接发生错误时
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// 当WebSocket连接关闭时
ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
    fileStream.end();
});

// 处理文件流关闭事件
fileStream.on('finish', () => {
    console.log(`File ${fileName} has been saved.`);
});

// 处理文件流错误事件
fileStream.on('error', (error) => {
    console.error('File stream error:', error);
});