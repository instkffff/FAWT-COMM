// pwm.js
import { calculateX } from './math.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取当前脚本所在目录
const currentDir = __dirname;

// 构建 wind.json 和 pwm.json 的相对路径
const windFilePath = path.resolve(currentDir, 'wind.json');
const pwmFilePath = path.resolve(currentDir, 'pwm.json');

// 读取 wind.json 文件
const windData = JSON.parse(fs.readFileSync(windFilePath, 'utf8'));

// 递归处理数组，计算 PWM 值并原地替换
function calculateAndReplacePWM(data, m) {
    for (let i = 0; i < data.length; i++) {
        if (Array.isArray(data[i])) {
            calculateAndReplacePWM(data[i], m); // 递归处理子数组
        } else {
            // 计算 PWM 值并替换原值
            data[i] = calculateX(data[i], m);
        }
    }
}

// 假设 m = 1
const m = 1;
calculateAndReplacePWM(windData, m);

// 将结果写入 pwm.json 文件
fs.writeFileSync(pwmFilePath, JSON.stringify(windData, null, 2), 'utf8');

console.log('PWM 值已成功写入 pwm.json 文件');