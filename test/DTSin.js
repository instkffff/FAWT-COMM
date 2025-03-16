let executionCount = 0;

async function sendData() {
    try {
        const sineValues = getSineValue(executionCount);
        const response = await fetch('http://localhost:3001/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: "101",
                msg: {
                    header: "DT",
                    type: "DT",
                    data: sineValues
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(`Data sent successfully: ${JSON.stringify(responseData)}`);
    } catch (error) {
        console.error(`Error sending data: ${error.message}`);
    } finally {
        executionCount++;
        setTimeout(sendData, 1000); // 每秒发送一次
    }
}

function getSineValue(executionCount) {
    // 定义周期
    const period = 60;
    // 计算当前角度（弧度），并调整相位以使初始值为0
    const angle = (2 * Math.PI / period) * executionCount - Math.PI / 2;
    // 计算正弦值，并调整到0到240之间
    const sineValue = 120 * (Math.sin(angle) + 1);
    // 返回四舍五入后的整数值
    const integerValue = Math.round(sineValue);

    return Array(18).fill(integerValue);
}

// 启动发送数据
sendData();