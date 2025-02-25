import { TSGenerateDataPacket, TSParseDataPacket } from './TS.js';

const header = "TS";  // 字母字符串
const data = "TEST";  // 字符串 "TEST"

const packet = TSGenerateDataPacket(header, data).toBuffer();

console.log(packet);  // 输出 Buffer 对象

// 解析数据包
const parsedPacket = TSParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象