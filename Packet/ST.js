// 定义数据包结构
class DataPacket {
    constructor(header) {
        if (header.length !== 2) {
            throw new Error("Header must be 2 bytes long.");
        }
        this.header = header;  // 2 bytes
        this.checksum = this.calculateChecksum();  // 2 bytes
    }

    calculateChecksum() {
        let sum = 0;
        // 将头部的两个字节相加
        for (let byte of this.header) {
            sum += byte;
        }
        return sum & 0xFFFF;  // Ensure checksum is 2 bytes
    }

    toBuffer() {
        const buffer = Buffer.alloc(4);  // 2 + 2 bytes
        buffer.writeUInt8(this.header[0], 0);
        buffer.writeUInt8(this.header[1], 1);
        buffer.writeUInt16LE(this.checksum, 2);
        return buffer;
    }
}

// 生成数据包的函数
function STGenerateDataPacket(header) {
    // 如果 header 是字符串，转换为 ASCII 数组
    if (typeof header === 'string' && header.length === 2) {
        header = header.split('').map(char => char.charCodeAt(0));
    }

    return new DataPacket(header);
}

// 数据解析器函数
function STParseDataPacket(buffer) {
    if (buffer.length !== 4) {
        throw new Error("Buffer must be 4 bytes long.");
    }

    const header = [buffer.readUInt8(0), buffer.readUInt8(1)];
    const checksum = buffer.readUInt16LE(2);

    const dataPacket = new DataPacket(header);

    // 验证校验和
    if (dataPacket.checksum !== checksum) {
        throw new Error("Checksum mismatch.");
    }

    return dataPacket;
}

export { DataPacket, STGenerateDataPacket, STParseDataPacket };

// 示例用法

/* const header = "ST";  // 字母字符串

const packet = STGenerateDataPacket(header).toBuffer();

console.log(packet);  // 输出 Buffer 对象


// 解析数据包
const parsedPacket = STParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象 */