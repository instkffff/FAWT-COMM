import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取当前脚本所在目录
const currentDir = resolve(__dirname);

// 构建文件路径
const mappingPath = resolve(currentDir, 'mapping.json');
const pwmPath = resolve(currentDir, 'pwm.json');
const outputPath = resolve(currentDir, 'framelog.json');

// 同步读取 JSON 文件
const mapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
const pwmList = JSON.parse(readFileSync(pwmPath, 'utf8'));

function splitPWMMatrix(mapping, pwmMatrix) {
    const result = [];

    for (let row = 0; row < mapping.length; row++) {
        const frame = [];
        for (let col = 0; col < mapping[row].length; col++) {
            const id = mapping[row][col];
            const startRow = row * 3;
            const startCol = col * 3;

            // 检查是否越界
            if (startRow >= pwmMatrix.length || startCol >= pwmMatrix[0]?.length) {
                console.warn(`⚠️ 跳过越界的风机 ID: ${id}`);
                continue;
            }

            // 提取 3x3 子矩阵并转换为一维数组
            const flatArray = [];
            for (let r = 0; r < 3; r++) {
                const currentRow = startRow + r;
                if (currentRow >= pwmMatrix.length) break;

                const rowArray = pwmMatrix[currentRow];
                for (let c = 0; c < 3; c++) {
                    const currentCol = startCol + c;
                    if (currentCol >= rowArray.length) break;

                    flatArray.push(rowArray[currentCol]);
                }
            }

            frame.push({ id, values: flatArray });
        }
        result.push(frame);
    }

    return result;
}

// 构建帧集（每帧作为一个对象）
const frameLog = pwmList.map((pwmMatrix, index) => ({
    frameIndex: index,
    data: splitPWMMatrix(mapping, pwmMatrix)
}));

// 写入帧集文件
writeFileSync(outputPath, JSON.stringify(frameLog, null, 2), 'utf8');

console.log(`✅ 帧集已写入: ${outputPath}`);