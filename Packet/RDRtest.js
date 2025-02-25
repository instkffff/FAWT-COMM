import { RDRGenerateDataPacket, RDRParseDataPacket } from "./RDR.js";

// 示例用法

const header = "RD";  // 字母字符串
const data = Array.from({ length: 18 }, () => Math.floor(Math.random() * 65536));  // 18 random uint16_t values

const packet = RDRGenerateDataPacket(header, data).toBuffer();

console.log(packet);  // 输出 Buffer 对象

// 解析数据包
const parsedPacket = RDRParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象