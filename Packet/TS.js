// 定义数据包结构
class DataPacket {
    constructor(header, data) {
        if (header.length !== 2) {
            throw new Error("Header must be 2 bytes long.");
        }
        if (data.length !== 4) {
            throw new Error("Data must be 4 bytes long.");
        }
        this.header = header;  // 2 bytes
        this.data = data;      // 4 bytes
        this.checksum = this.calculateChecksum();  // 2 bytes
    }

    calculateChecksum() {
        let sum = 0;
        // 将头部的两个字节相加
        for (let byte of this.header) {
            sum += byte;
        }
        // 将数据数组中的每个字节相加
        for (let byte of this.data) {
            sum += byte;
        }
        return sum & 0xFFFF;  // Ensure checksum is 2 bytes
    }

    toBuffer() {
        const buffer = Buffer.alloc(8);  // 2 + 4 + 2 bytes
        buffer.writeUInt8(this.header[0], 0);
        buffer.writeUInt8(this.header[1], 1);
        for (let i = 0; i < 4; i++) {
            buffer.writeUInt8(this.data[i], 2 + i);
        }
        buffer.writeUInt16LE(this.checksum, 6);
        return buffer;
    }
}

// 生成数据包的函数
function TSGenerateDataPacket(header, data) {
    // 如果 header 是字符串，转换为 ASCII 数组
    if (typeof header === 'string' && header.length === 2) {
        header = header.split('').map(char => char.charCodeAt(0));
    }

    // 如果 data 是字符串，转换为 ASCII 数组
    if (typeof data === 'string' && data.length === 4) {
        data = data.split('').map(char => char.charCodeAt(0));
    }

    return new DataPacket(header, data);
}

// 数据解析器函数
function TSParseDataPacket(buffer) {
    if (buffer.length !== 8) {
        throw new Error("Buffer must be 8 bytes long.");
    }

    const header = [buffer.readUInt8(0), buffer.readUInt8(1)];
    const data = [];
    for (let i = 0; i < 4; i++) {
        data.push(buffer.readUInt8(2 + i));
    }
    const checksum = buffer.readUInt16LE(6);

    const dataPacket = new DataPacket(header, data);

    // 验证校验和
    if (dataPacket.checksum !== checksum) {
        throw new Error("Checksum mismatch.");
    }

    return dataPacket;
}

export { DataPacket, TSGenerateDataPacket, TSParseDataPacket };

// 示例用法

/* const header = "TS";  // 字母字符串
const data = "TEST";  // 字符串 "TEST"

const packet = TSGenerateDataPacket(header, data).toBuffer();

console.log(packet);  // 输出 Buffer 对象

// 解析数据包
const parsedPacket = TSParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象 */
