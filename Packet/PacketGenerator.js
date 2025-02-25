import { DTGenerateDataPacket, DTParseDataPacket } from "./DT.js";
import { RDGenerateDataPacket, RDParseDataPacket } from "./RD.js";
import { RDRGenerateDataPacket, RDRParseDataPacket } from "./RDR.js";
import { STGenerateDataPacket, STParseDataPacket } from "./ST.js";
import { TSOKGenerateDataPacket, TSOKParseDataPacket } from "./TSOK.js";
import { TSGenerateDataPacket, TSParseDataPacket } from './TS.js';

// 新增方法：generatorPacket
function generatorPacket(data) {
    const packetType = data.type

    let rawPacket;

    switch (packetType) {
        case 'DT':
            rawPacket = DTGenerateDataPacket(data.header, data.data).toBuffer();
            break;
        case 'RD':
            rawPacket = RDGenerateDataPacket(data.header).toBuffer();
            break;
        case 'RDR':
            rawPacket = RDRGenerateDataPacket(data.header, data.data).toBuffer();
            break;
        case 'ST':
            rawPacket = STGenerateDataPacket(data.header).toBuffer();
            break;
        case 'TS':
            rawPacket = TSGenerateDataPacket(data.header, data.data).toBuffer();
            break;
        case 'TSOK':
            rawPacket = TSOKGenerateDataPacket(data.header, data.data).toBuffer();
            break;
        default:
            throw new Error('Unknown packet type');
    }


    return rawPacket
}

export { generatorPacket }