import { createSocketClient } from './socketClient.js';
import fs from 'fs';
import { handleMessage } from './messageHandlers.js';
import path from 'path';


const configFilePath = path.join('socketClient', 'config.json');

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