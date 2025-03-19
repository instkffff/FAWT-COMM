import { createServer } from 'http';
import cluster from 'cluster';
import { cpus } from 'os';

// 获取系统CPU核心数
const numCPUs = cpus().length;

// 配置要使用的CPU核心数，默认为所有核心
const config = {
    //cpuUsage: 4 // 设置为需要使用的CPU核心数
};

const numWorkers = config.cpuUsage || numCPUs;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    const server = createServer((req, res) => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'helloworld' })); // 修改响应内容为 helloworld
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Worker ${process.pid} started`);
    });
}