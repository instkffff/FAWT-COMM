// messageHandlers.js
import { parsePacket } from '../Packet/PacketParse.js';
import { generatorPacket } from '../Packet/PacketGenerator.js';

function createPacket(header, type, data = null) {
    return {
        header,
        type,
        data
    };
}

function handleMessage(client, message) {
    // 每个客户端有自己的 FansPWM 状态
    if (!client.state) {
        client.state = {
            FansPWM: new Array(18).fill(0)
        };
    }

    // 解析消息
    const packet = parsePacket(message);

    // 根据 packet 的 header 进行分类处理
    switch (packet.header) {
        case 'DT':
            handleDT(client, packet);
            break;
        case 'RD':
            handleRD(client, packet);
            break;
        case 'ST':
            handleST(client, packet);
            break;
        case 'TS':
            handleTS(client, packet);
            break;
        default:
            console.log(`Unknown packet header: ${packet.header}`);
            break;
    }
}

function handleDT(client, packet) {
    console.log('Handling DT packet:', packet);
    // 处理 DT 数据包的逻辑
    const Data = packet.data;
    // 将 Data 存储到客户端的 FansPWM
    client.state.FansPWM = Data;
}

function handleRD(client, packet) {
    console.log('Handling RD packet:', packet);
    // 处理 RD 数据包的逻辑

    const FansPWM = client.state.FansPWM;

    if (Array.isArray(FansPWM)) {
        // 计算转速数组
        const maxRPM = 12000;
        const maxPWM = 255;
        const rpmArray = FansPWM.map(pwm => Math.round((pwm / maxPWM) * maxRPM));

        console.log('Calculated RPM Array:', rpmArray);

        const RDR = createPacket('RD', 'RDR', rpmArray);

        const RDRPacket = generatorPacket(RDR);

        // 发送转速数组
        client.send(RDRPacket);
    } else {
        console.log('FansPWM is not set or not an array');
    }
}

function handleST(client, packet) {
    console.log('Handling ST packet:', packet);
    // 重置客户端的 FansPWM
    client.state.FansPWM = new Array(18).fill(0);
}

function handleTS(client, packet) {
    console.log('Handling TS packet:', packet);
    // 处理 TS 数据包的逻辑

    const TSOK = createPacket('TS', 'TSOK', 'OK');
    const TSOKPacket = generatorPacket(TSOK);

    client.send(TSOKPacket);
}

export { handleMessage }