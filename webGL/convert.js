const fs = require('fs');

// 设置输入文件路径和输出文件路径
const inputFilePath = "h:\\项目1\\风洞软件系统\\blender sim\\object_coordinates.txt";
const outputFilePath = "h:\\项目1\\风洞软件系统\\blender sim\\output_coordinates_mm.json";

// 读取输入文件
const data = fs.readFileSync(inputFilePath, 'utf8');
const lines = data.split('\n');

// 解析数据并转换单位
const frames = [];
let currentFrame = null;
let frameData = {};

for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("Frame")) {
        if (currentFrame !== null) {
            frames.push(frameData);
        }
        currentFrame = parseInt(trimmedLine.split()[1]);
        frameData = {
            position: [],
            Marker1: [],
            Marker2: [],
            Marker3: [],
            Marker4: []
        };
    } else if (trimmedLine.startsWith("drone:")) {
        const position = trimmedLine.split(":")[1].trim().split(", ");
        frameData.position = position.map(p => parseFloat((parseFloat(p.split("=")[1]) * 1000).toFixed(2)));
    } else if (trimmedLine.startsWith("1:")) {
        const marker1 = trimmedLine.split(":")[1].trim().split(", ");
        frameData.Marker1 = marker1.map(p => parseFloat((parseFloat(p.split("=")[1]) * 1000).toFixed(2)));
    } else if (trimmedLine.startsWith("2:")) {
        const marker2 = trimmedLine.split(":")[1].trim().split(", ");
        frameData.Marker2 = marker2.map(p => parseFloat((parseFloat(p.split("=")[1]) * 1000).toFixed(2)));
    } else if (trimmedLine.startsWith("3:")) {
        const marker3 = trimmedLine.split(":")[1].trim().split(", ");
        frameData.Marker3 = marker3.map(p => parseFloat((parseFloat(p.split("=")[1]) * 1000).toFixed(2)));
    } else if (trimmedLine.startsWith("4:")) {
        const marker4 = trimmedLine.split(":")[1].trim().split(", ");
        frameData.Marker4 = marker4.map(p => parseFloat((parseFloat(p.split("=")[1]) * 1000).toFixed(2)));
    }
}

// 添加最后一帧数据
if (currentFrame !== null) {
    frames.push(frameData);
}

// 写入输出文件
fs.writeFileSync(outputFilePath, JSON.stringify(frames, null, 4));

console.log(`坐标已导出到 ${outputFilePath}`);