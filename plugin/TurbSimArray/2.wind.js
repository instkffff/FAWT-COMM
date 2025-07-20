import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取当前脚本所在目录
const currentDir = resolve(__dirname);

// 检查文件路径
const uPath = `${currentDir}\\u.json`;
const vPath = `${currentDir}\\v.json`;
const wPath = `${currentDir}\\w.json`;
const outPath = `${currentDir}\\wind.json`;

try {
    // 读取 JSON 文件
    const u = JSON.parse(readFileSync(uPath, 'utf8')).matrices;
    const v = JSON.parse(readFileSync(vPath, 'utf8')).matrices;
    const w = JSON.parse(readFileSync(wPath, 'utf8')).matrices;

    // 检查矩阵列表是否具有相同的长度
    if (u.length !== v.length || u.length !== w.length) {
        throw new Error("矩阵列表长度不一致");
    }

    // 初始化结果矩阵列表
    const result = [];

    // 遍历每个矩阵
    for (let i = 0; i < u.length; i++) {
        const matrixU = u[i];
        const matrixV = v[i];
        const matrixW = w[i];

        // 检查矩阵行数是否一致
        if (matrixU.length !== matrixV.length || matrixU.length !== matrixW.length) {
            throw new Error(`第 ${i} 个矩阵行数不一致`);
        }

        const resultMatrix = [];

        // 遍历每一行
        for (let j = 0; j < matrixU.length; j++) {
            const rowU = matrixU[j];
            const rowV = matrixV[j];
            const rowW = matrixW[j];

            // 检查每行的列数是否一致
            if (rowU.length !== rowV.length || rowU.length !== rowW.length) {
                throw new Error(`第 ${i} 个矩阵第 ${j} 行列数不一致`);
            }

            // 计算平方和的根
            const resultRow = rowU.map((val, k) =>
                Number(Math.sqrt(val ** 2 + rowV[k] ** 2 + rowW[k] ** 2).toFixed(2))
            );
            resultMatrix.push(resultRow);
        }

        result.push(resultMatrix);
    }

    // 写入结果到 JSON 文件
    writeFileSync(outPath, JSON.stringify(result, null, 4), 'utf8');
    console.log(`✅ 数据已写入: ${outPath}，共写入 ${result.length} 个矩阵`);

} catch (err) {
    console.error('❌ 出现错误:', err);
}