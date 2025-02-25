import { DTParseDataPacket, DTGenerateDataPacket } from "./DT.js";

// 示例用法

const header = "DT";  // 字母字符串
const data = [0, 254, 242, 128, 235, 121, 95, 20, 36, 0, 254, 242, 128, 235, 121, 95, 20, 36];
const packet = DTGenerateDataPacket(header, data).toBuffer();

console.log(packet);

const parsedPacket = DTParseDataPacket(packet);

console.log(parsedPacket);