import { Socket } from 'net';

function createSocketClient(config) {
    const host = config.serverIP;
    const port = config.serverPort;
    const clientID = config.clientID;
    const reconnectInterval = config.reconnectInterval || 5000; // 5 seconds by default
    let client = null;

    function connect() {
        client = new Socket();

        client.connect(port, host, () => {
            console.log(`Connected to server at ${host}:${port}`);
            // Send clientID to the server as a string
            send(clientID.toString());
        });

        client.on('data', (data) => {
            console.log(`Received data from server at ${host}:${port}:`, data);
            // Handle incoming data here and send a response
            handleMessage(data);
        });

        client.on('close', () => {
            console.log(`Connection closed. Reconnecting to ${host}:${port}...`);
            setTimeout(connect, reconnectInterval);
        });

        client.on('error', (error) => {
            console.error(`Socket error at ${host}:${port}:`, error);
            client.destroy();
        });
    }

    function send(message) {
        if (client && client.readyState === 'open') {
            client.write(message);
        } else {
            console.error(`Socket is not open. Ready state: ${client.readyState}`);
        }
    }

    function handleMessage(message) {
        // Default handling, can be overridden by external logic
        console.log(`Handling message: ${message}`);
        const response = `Received: ${message}`;
        console.log('Sending response:', response);
        send(response);
    }

    function setHandleMessage(handler) {
        handleMessage = handler;
    }

    return {
        connect,
        send,
        setHandleMessage
    };
}

export { createSocketClient };