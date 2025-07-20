// 定义数据包结构
class DataPacket {
    constructor(header, data) {
        if (header.length !== 2) {
            throw new Error("Header must be 2 bytes long.");
        }
        if (data.length !== 18) {
            throw new Error("Data must be 18 bytes long.");
        }
        this.header = header;  // 2 bytes
        this.data = data;      // 18 bytes
        this.checksum = this.calculateChecksum();  // 2 bytes
    }

    calculateChecksum() {
        let sum = 0;
        for (let byte of this.header) {
            sum += byte;
        }
        for (let byte of this.data) {
            sum += byte;
        }
        return sum & 0xFFFF;  // Ensure checksum is 2 bytes
    }

    toBuffer() {
        const buffer = Buffer.alloc(22);  // 2 + 18 + 2 bytes
        buffer.writeUInt8(this.header[0], 0);
        buffer.writeUInt8(this.header[1], 1);
        for (let i = 0; i < 18; i++) {
            buffer.writeUInt8(this.data[i], 2 + i);
        }
        buffer.writeUInt16LE(this.checksum, 20);
        return buffer;
    }
}

// 生成数据包的函数
function DTGenerateDataPacket(header, data) {
    // 如果 header 是字符串，转换为 ASCII 数组
    if (typeof header === 'string' && header.length === 2) {
        header = header.split('').map(char => char.charCodeAt(0));
    }

    return new DataPacket(header, data);
}

// 数据解析器函数
function DTParseDataPacket(buffer) {
    if (buffer.length !== 22) {
//        throw new Error("Buffer must be 22 bytes long.");
    }

    const header = [buffer.readUInt8(0), buffer.readUInt8(1)];
    const data = [];
    for (let i = 0; i < 18; i++) {
        data.push(buffer.readUInt8(2 + i));
    }
    const checksum = buffer.readUInt16LE(20);

    const dataPacket = new DataPacket(header, data);

    // 验证校验和
    if (dataPacket.checksum !== checksum) {
        throw new Error("Checksum mismatch.");
    }

    return dataPacket;
}

export { DataPacket, DTGenerateDataPacket, DTParseDataPacket };

// 示例用法

/* const header = "DT";  // 字母字符串
const data = [0, 254, 242, 128, 235, 121, 95, 20, 36, 0, 254, 242, 128, 235, 121, 95, 20, 36];
const packet = DTGenerateDataPacket(header, data).toBuffer();

console.log(packet);

const parsedPacket = DTParseDataPacket(packet);

console.log(parsedPacket); */