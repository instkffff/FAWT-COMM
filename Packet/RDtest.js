import { RDGenerateDataPacket, RDParseDataPacket } from "./RD.js";

// 示例用法

const header = "RD";  // 字母字符串
const packet = RDGenerateDataPacket(header).toBuffer();

console.log(packet);  // 输出 Buffer 对象


// 解析数据包
const parsedPacket = RDParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象