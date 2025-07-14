import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, extname } from 'path';

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取当前脚本所在目录
const currentDir = resolve(__dirname);

// 输入文件名列表（可动态替换）
const inputFilenames = ['TurbSim.u', 'TurbSim.v', 'TurbSim.w'];

// 遍历每个文件进行处理
inputFilenames.forEach((inputFileName) => {
    const inputFilePath = resolve(currentDir, inputFileName);

    // 构建输出文件路径
    const inputExt = extname(inputFilePath).toLowerCase().slice(1); // 去除点号
    const outputFilePath = resolve(currentDir, `${inputExt}.json`);

    try {
        // 同步读取文件内容
        const data = readFileSync(inputFilePath, 'utf8');

        // 解析数据为矩阵
        const result = parseMatrices(data);

        // 同步写入 JSON 文件
        writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf8');

        console.log(`✅ 数据解析完成，已写入: ${outputFilePath}`);
    } catch (err) {
        console.error(`❌ 处理文件失败 ${inputFileName}:`, err);
    }
});

/**
 * 解析文本数据为多个 N x M 矩阵（自动识别）
 */
function parseMatrices(data) {
    const lines = data
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(8);

    const matrices = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // 判断是否为帧头（只包含两个数字）
        const nums = line.split(/\s+/).map(Number);
        if (nums.length === 2 && nums.every(n => !isNaN(n))) {
            i++; // 跳过帧头
            continue;
        }

        // 开始读取矩阵数据
        const matrix = [];
        let expectedColumns = null; // 第一行决定列数

        while (i < lines.length) {
            const row = lines[i].split(/\s+/).map(Number);

            if (row.every(n => !isNaN(n)) && row.length > 0) {
                if (expectedColumns === null) {
                    expectedColumns = row.length; // 根据第一行确定列数
                }

                if (row.length >= expectedColumns) {
                    matrix.push(row.slice(0, expectedColumns)); // 取前 expectedColumns 个数
                }
            }

            i++;

            // 如果当前行又出现帧头，说明当前矩阵结束
            if (i < lines.length) {
                const nextLine = lines[i];
                const nextNums = nextLine.split(/\s+/).map(Number);
                if (nextNums.length === 2 && nextNums.every(n => !isNaN(n))) {
                    break;
                }
            }
        }

        if (matrix.length > 0) {
            matrices.push(matrix);
        }
    }

    return { matrices };
}