// PacketParse.js
import { DTGenerateDataPacket, DTParseDataPacket } from "./DT.js";
import { RDGenerateDataPacket, RDParseDataPacket } from "./RD.js";
import { RDRGenerateDataPacket, RDRParseDataPacket } from "./RDR.js";
import { STGenerateDataPacket, STParseDataPacket } from "./ST.js";
import { TSOKGenerateDataPacket, TSOKParseDataPacket } from "./TSOK.js";
import { TSGenerateDataPacket, TSParseDataPacket } from './TS.js';

import { packetBypass } from "./PacketBypass.js";

// packetBypass return and Parse use list
// DT DTParseDataPacket
// RD RDParseDataPacket
// RDR RDRParseDataPacket
// ST STParseDataPacket
// TS TSParseDataPacket
// TSOK TSOKParseDataPacket

// 新增方法：parsePacket
function parsePacket(rawPacket) {
    const packetType = packetBypass(rawPacket);

    let parsedData;

    switch (packetType) {
        case 'DT':
            parsedData = DTParseDataPacket(rawPacket);
            break;
        case 'RD':
            parsedData = RDParseDataPacket(rawPacket);
            break;
        case 'RDR':
            parsedData = RDRParseDataPacket(rawPacket);
            break;
        case 'ST':
            parsedData = STParseDataPacket(rawPacket);
            break;
        case 'TS':
            parsedData = TSParseDataPacket(rawPacket);
            // 将 TS 的 data 字段从字节数组转换为 ASCII 字符串
            if (parsedData.data && Array.isArray(parsedData.data)) {
                parsedData.data = Buffer.from(parsedData.data).toString('ascii');
            }
            break;
        case 'TSOK':
            parsedData = TSOKParseDataPacket(rawPacket);
            // 将 TSOK 的 data 字段从字节数组转换为 ASCII 字符串
            if (parsedData.data && Array.isArray(parsedData.data)) {
                parsedData.data = Buffer.from(parsedData.data).toString('ascii');
            }
            break;
        default:
            throw new Error('Unknown packet type');
    }

    // 替换 header 为 packetType
    parsedData.header = packetType;
    
    return parsedData;
}

export { parsePacket };