import { parsePacket } from './PacketParse.js'

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


const PacketDT = generatorPacket(DT)
const PacketRD = generatorPacket(RD)
const PacketRDR = generatorPacket(RDR)
const PacketST = generatorPacket(ST)
const PacketTSOK = generatorPacket(TSOK)
const PacketTS = generatorPacket(TS)

console.log(JSON.stringify(DT));
console.log(JSON.stringify(RD));
console.log(JSON.stringify(RDR));
console.log(JSON.stringify(ST));
console.log(JSON.stringify(TSOK));
console.log(JSON.stringify(TS));


console.log("PacketDT:", PacketDT);
console.log("PacketRD:", PacketRD);
console.log("PacketRDR:", PacketRDR);
console.log("PacketST:", PacketST);
console.log("PacketTSOK:", PacketTSOK);
console.log("PacketTS:", PacketTS);


console.log("DT:", parsePacket(PacketDT));
console.log("RD:", parsePacket(PacketRD));
console.log("RDR:", parsePacket(PacketRDR));
console.log("ST:", parsePacket(PacketST));
console.log("TSOK:", parsePacket(PacketTSOK));
console.log("TS:", parsePacket(PacketTS));
