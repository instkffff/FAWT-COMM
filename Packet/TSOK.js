// 定义数据包结构
class DataPacket {
    constructor(header, data) {
        if (header.length !== 2) {
            throw new Error("Header must be 2 bytes long.");
        }
        if (data.length !== 2) {
            throw new Error("Data must be 2 bytes long.");
        }
        this.header = header;  // 2 bytes
        this.data = data;      // 2 bytes
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
        const buffer = Buffer.alloc(6);  // 2 + 2 + 2 bytes
        buffer.writeUInt8(this.header[0], 0);
        buffer.writeUInt8(this.header[1], 1);
        buffer.writeUInt8(this.data[0], 2);
        buffer.writeUInt8(this.data[1], 3);
        buffer.writeUInt16LE(this.checksum, 4);
        return buffer;
    }
}

// 生成数据包的函数
function TSOKGenerateDataPacket(header, data) {
    // 如果 header 是字符串，转换为 ASCII 数组
    if (typeof header === 'string' && header.length === 2) {
        header = header.split('').map(char => char.charCodeAt(0));
    }

    // 如果 data 是字符串，转换为 ASCII 数组
    if (typeof data === 'string' && data.length === 2) {
        data = data.split('').map(char => char.charCodeAt(0));
    }

    return new DataPacket(header, data);
}

// 数据解析器函数
function TSOKParseDataPacket(buffer) {
    if (buffer.length !== 6) {
        throw new Error("Buffer must be 6 bytes long.");
    }

    const header = [buffer.readUInt8(0), buffer.readUInt8(1)];
    const data = [buffer.readUInt8(2), buffer.readUInt8(3)];
    const checksum = buffer.readUInt16LE(4);

    const dataPacket = new DataPacket(header, data);

    // 验证校验和
    if (dataPacket.checksum !== checksum) {
        throw new Error("Checksum mismatch.");
    }

    return dataPacket;
}

export { DataPacket, TSOKGenerateDataPacket, TSOKParseDataPacket };

// 示例用法

/* const header = "TS";  // 字母字符串
const data = "OK";  // 字符串 "OK"

const packet = TSOKGenerateDataPacket(header, data).toBuffer();

console.log(packet);  // 输出 Buffer 对象

// 解析数据包
const parsedPacket = TSOKParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象 */
