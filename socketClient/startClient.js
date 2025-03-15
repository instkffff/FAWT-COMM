import { createSocketClient } from './socketClient.js';
import fs from 'fs';
import { handleMessage } from './messageHandlers.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块的目录路径
const __dirname = dirname(__filename);

const configFilePath = join(__dirname,'config.json');

// Read configuration from file
// const configFilePath = 'config.json';
const configData = fs.readFileSync(configFilePath, 'utf8');
const configs = JSON.parse(configData);

// Create and start clients based on configuration
configs.forEach(config => {
    const client = createSocketClient(config);
    client.connect();

    // Set custom handleMessage logic
    client.setHandleMessage((message) => {
        handleMessage(client, message);
    });
});