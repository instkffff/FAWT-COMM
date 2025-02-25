import { writeFile } from 'fs';

// 定义生成配置文件的函数
function generateConfig(numClients) {
    const config = [];

    for (let i = 1; i <= numClients; i++) {
        config.push({
            serverIP: "127.0.0.1",
            serverPort: 3000,
            clientID: i,
            reconnectInterval: 5000
        });
    }

    return config;
}

// 生成配置文件
const numClients = 144; // 你可以根据需要调整客户端的数量
const config = generateConfig(numClients);

// 将配置写入文件
writeFile('config.json', JSON.stringify(config, null, 4), (err) => {
    if (err) {
        console.error('Error writing to file', err);
    } else {
        console.log('Config file has been saved!');
    }
});