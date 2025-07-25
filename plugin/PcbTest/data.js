import { SerialPort } from 'serialport';

// ===== 协议定义部分（你的 data.js 内容）=====
const FRAME_HEADER_0 = 0x55;
const FRAME_HEADER_1 = 0xAA;
const FRAME_RESERVED = 0x00;                                                                                

function computeChecksum(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }
    return sum & 0xFF; // 取低 8 位
}

function sendDataFrame(cmd, pData, dataLen) {
    const totalLength = dataLen + 6; // 帧头(2) + Cmd(1) + Len(1) + CRC(1) + Reserved(1) + Data(dataLen)
    
    // 创建 Buffer 来保存数据帧
    const buffer = Buffer.alloc(totalLength);

    // 设置帧头
    buffer[0] = FRAME_HEADER_0;
    buffer[1] = FRAME_HEADER_1;

    // 设置命令和长度
    buffer[2] = cmd;
    buffer[3] = dataLen;

    // 设置保留字段
    buffer[5] = FRAME_RESERVED;

    // 拷贝数据部分
    for (let i = 0; i < dataLen; i++) {
        buffer[6 + i] = pData[i];
    }

    // 设置 CRC 字段为 0 后重新计算
    buffer[4] = 0;

    // 计算 CRC 校验码
    const crc = computeChecksum(buffer.slice(0, totalLength));
    buffer[4] = crc;

    return buffer;
}
// =============================================

// ===== 串口配置与发送逻辑 =====
const portName = 'COM14'; // 你要使用的串口号5
const baudRate = 115200; // 波特率，根据你的 STM32 配置设置
                                                                                                                
// 创建串口实例
const port = new SerialPort({
    path: portName,
    baudRate: baudRate,
});

// 打开串口后发送数据
port.on('open', () => {
    console.log(`串口 ${portName} 已打开`);

    // 构造数据帧
    const pwmPercentage1 = [64, 64, 64, 64, 64, 64 ]; // 示例数据
    const frame = sendDataFrame(1, pwmPercentage1, 6); // 构造帧

    // 发送数据到串口
    port.write(frame, (err) => {
        if (err) {
            console.error('发送失败:', err.message);
        } else {
            console.log('数据已发送:', frame);
            console.log('Hex: ', frame.toString('hex'));
        }
    });
});

port.on('error', (err) => {
    console.error('串口错误:', err.message);
});