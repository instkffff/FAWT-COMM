// 定义数据包结构
class DataPacket {
    constructor(header, data) {
        if (header.length !== 2) {
            throw new Error("Header must be 2 bytes long.");
        }
        if (data.length !== 18) {
            throw new Error("Data must be 18 uint16_t values long.");
        }
        this.header = header;  // 2 bytes
        this.data = data;      // 18 uint16_t values
        this.checksum = this.calculateChecksum();  // 2 bytes
    }

    calculateChecksum() {
        let sum = 0;
        // 将头部的两个字节相加
        for (let byte of this.header) {
            sum += byte;
        }
        // 将数据数组中的每个16位无符号整数拆分为两个8位字节并相加
        for (let value of this.data) {
            sum += (value & 0xFF) + ((value >> 8) & 0xFF);
        }
        return sum & 0xFFFF;  // Ensure checksum is 2 bytes
    }

    toBuffer() {
        const buffer = Buffer.alloc(40);  // 2 + 36 + 2 bytes
        buffer.writeUInt8(this.header[0], 0);
        buffer.writeUInt8(this.header[1], 1);
        for (let i = 0; i < 18; i++) {
            buffer.writeUInt16LE(this.data[i], 2 + i * 2);
        }
        buffer.writeUInt16LE(this.checksum, 38);
        return buffer;
    }
}

// 生成数据包的函数
function RDRGenerateDataPacket(header, data) {
    // 如果 header 是字符串，转换为 ASCII 数组
    if (typeof header === 'string' && header.length === 2) {
        header = header.split('').map(char => char.charCodeAt(0));
    }

    return new DataPacket(header, data);
}

// 数据解析器函数
function RDRParseDataPacket(buffer) {
    if (buffer.length !== 40) {
        throw new Error("Buffer must be 40 bytes long.");
    }

    const header = [buffer.readUInt8(0), buffer.readUInt8(1)];
    const data = [];
    for (let i = 0; i < 18; i++) {
        data.push(buffer.readUInt16LE(2 + i * 2));
    }
    const checksum = buffer.readUInt16LE(38);

    const dataPacket = new DataPacket(header, data);

    // 验证校验和
    if (dataPacket.checksum !== checksum) {
        throw new Error("Checksum mismatch.");
    }

    return dataPacket;
}

export { DataPacket, RDRGenerateDataPacket, RDRParseDataPacket };

// 示例用法

/* const header = "RD";  // 字母字符串
const data = Array.from({ length: 18 }, () => Math.floor(Math.random() * 65536));  // 18 random uint16_t values

const packet = RDRGenerateDataPacket(header, data).toBuffer();

console.log(packet);  // 输出 Buffer 对象

// 解析数据包
const parsedPacket = RDRParseDataPacket(packet);
console.log(parsedPacket);  // 输出解析后的 DataPacket 对象 */