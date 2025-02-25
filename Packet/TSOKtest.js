import { TSOKGenerateDataPacket, TSOKParseDataPacket } from "./TSOK.js"

const header = "TS";  // 字母字符串
const data = "OK";  // 字符串 "OK"

const packet = TSOKGenerateDataPacket(header, data).toBuffer();

console.log(packet);  // 输出 Buffer 对象

// 解析数据包
const parsedPacket = TSOKParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象