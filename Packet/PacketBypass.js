function packetBypass(buffer) {
    // 读取前两个字节
    const header = buffer.readUInt16BE(0);

    // 获取整个 buffer 的长度
    const packetLength = buffer.length;

    // 根据前两个字节的值进行分类
    switch (header) {
        case 0x4454: // 假设 DT 对应的值是 0x4454
            return 'DT';
        case 0x5244: // 假设 RD 对应的值是 0x5244
            if (packetLength === 4) {
                return 'RD';
            } else if (packetLength === 40) {
                return 'RDR';
            } else {
                return 'DROP';
            }
        case 0x5453: // 假设 TS 对应的值是 0x5453
            if (packetLength === 8) {
                return 'TS';
            } else if (packetLength === 6) { 
                return 'TSOK';
            } else {
                return 'DROP';
            }
        case 0x5354: // 假设 ST 对应的值是 0x5354
            return 'ST';
        default:
            return 'DROP';
    }
}

export { packetBypass }