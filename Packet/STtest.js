import { STGenerateDataPacket, STParseDataPacket } from "./ST.js";

// 示例用法

const header = "ST";  // 字母字符串

const packet = STGenerateDataPacket(header).toBuffer();

console.log(packet);  // 输出 Buffer 对象


// 解析数据包
const parsedPacket = STParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象