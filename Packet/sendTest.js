import { generatorPacket } from './PacketGenerator.js'
function createPacket(header, type, data = null) {
    return {
        header,
        type,
        data
    };
}

function createRandomData(length, maxValue = 255) {
    return Array.from({ length }, () => Math.floor(Math.random() * (maxValue + 1)));
}

// DT
const DT = createPacket('DT', 'DT', createRandomData(18));

// RD
const RD = createPacket('RD', 'RD');

// RDR
const RDR = createPacket('RD', 'RDR', createRandomData(18, 65535));

// ST
const ST = createPacket('ST', 'ST');

// TSOK
const TSOK = createPacket('TS', 'TSOK', 'OK');

// TS
const TS = createPacket('TS', 'TS', 'TEST');

console.log(generatorPacket(DT))
console.log(generatorPacket(RD))
console.log(generatorPacket(RDR))
console.log(generatorPacket(ST))
console.log(generatorPacket(TSOK))
console.log(generatorPacket(TS))
