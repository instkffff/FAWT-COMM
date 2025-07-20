import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 framelog.json 文件
const filePath = resolve(__dirname, 'framelog.json');
const rawData = readFileSync(filePath, 'utf8');
const data = JSON.parse(rawData);

// 帧范围配置（根据需要调整）
const START_FRAME = 0;     // 起始帧索引
const END_FRAME = 50;      // 截止帧索引（包含）

// 控制并发数量（可选）
const MAX_CONCURRENT_REQUESTS = 70;

// 包计数器
let totalPacketsSent = 0;
let packetsInCurrentFrame = 0;

// 发送数据的函数：每帧中每个 id 并行发送
async function sendEachIdInParallel(frame) {
  const url = 'http://localhost:3003/send';

  // 统计当前帧的包数量
  const packetCount = frame.data.reduce((sum, group) => sum + group.length, 0);
  packetsInCurrentFrame = packetCount;
  totalPacketsSent += packetCount;

  console.log(`Frame ${frame.frameIndex}: 发送 ${packetCount} 个包`);

  // 收集所有发送任务
  const sendTasks = frame.data.flatMap(itemGroup =>
    itemGroup.map(item => async () => {
      const payload = {
        id: '185',
        msg: {
          header: 'DT',
          type: 'DT',
          data: [...item.values, ...item.values] // 9 + 9 = 18 位数据
        }
      };

      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(`Sent id:${item.id} frame:${frame.frameIndex}`, 'Response:', result);
      } catch (error) {
        console.error(`Error sending id:${item.id} frame:${frame.frameIndex}`, 'Error:', error);
      }
    })
  );

  // 并发控制函数
  const runInParallel = async (tasks, maxConcurrency) => {
    const executing = [];
    for (const task of tasks) {
      const p = task();
      executing.push(p);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing); // 等待任意一个完成
        executing.splice(executing.indexOf(p), 1); // 移除已完成
      }
    }
    await Promise.all(executing); // 等待剩余任务
  };

  await runInParallel(sendTasks, MAX_CONCURRENT_REQUESTS);
}

// 每 0.1 秒发送一帧数据（每帧中每个 id 并行发送）
let currentIndex = 0;
const intervalId = setInterval(async () => {
  // 检查是否超出指定的帧范围
  if (currentIndex > END_FRAME) {
    clearInterval(intervalId);
    console.log('✅ 达到截止帧，停止发送');
    console.log(`📊 总共发送包数: ${totalPacketsSent}`);
    return;
  }
  
  if (currentIndex < data.length && currentIndex >= START_FRAME) {
    const frame = data[currentIndex];
    await sendEachIdInParallel(frame); // 并行发送当前帧中所有 id
    console.log(`📊 当前进度: 帧 ${currentIndex}/${END_FRAME}`);
  } else if (currentIndex >= data.length) {
    clearInterval(intervalId);
    console.log('✅ 数据集结束，停止发送');
    console.log(`📊 总共发送包数: ${totalPacketsSent}`);
  }
  
  currentIndex++;
}, 100); // 0.1 秒 = 100 毫秒