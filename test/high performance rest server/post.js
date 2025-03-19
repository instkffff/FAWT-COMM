import { request } from 'http';
import { cpus } from 'os';
import { writeFileSync } from 'fs';
import { join } from 'path';
import cluster from 'cluster';
import { randomInt } from 'crypto';

const numCPUs = cpus().length;
const requestsPerSecond = 2000;
const requestsPerWorker = Math.ceil(requestsPerSecond / numCPUs);
const requestsPerInterval = 50; // 每10毫秒发送100个请求
const intervalTime = 10; // 10毫秒
const url = 'http://localhost:3000';
const responseTimes = [];

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log(`Worker ${process.pid} started`);

    const sendRequests = () => {
        const interval = setInterval(() => {
            for (let i = 0; i < requestsPerInterval; i++) {
                const randomArray = Array.from({ length: 30 }, () => randomInt(0, 100)); // 生成包含30个随机数的数组
                const postData = JSON.stringify({ data: randomArray });
                const startTime = Date.now();

                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const req = request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        const endTime = Date.now();
                        const responseTime = endTime - startTime;
                        responseTimes.push(responseTime);

                        // 打印返回内容和响应时间
                        console.log(`Response from server: ${data} ${responseTime}ms`);
                    });
                });

                req.on('error', (error) => {
                    console.error(`Problem with request: ${error.message}`);
                    responseTimes.push('-');
                });

                // Write data to request body
                req.write(postData);
                req.end();
            }
        }, intervalTime); // Send requests every 10 milliseconds

        // Write response times to file every second
        setInterval(() => {
            const logFilePath = join(`response_times_${process.pid}.log`);
            const logData = responseTimes.join('\n') + '\n';
            writeFileSync(logFilePath, logData, { flag: 'a' });
            responseTimes.length = 0; // Clear the array after writing
        }, 1000);
    };

    sendRequests();
}