function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomData(length) {
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(getRandomInt(0, 255)); // 随机数范围是 0 到 255
  }
  return data;
}

const sendBatch = () => {
  for (let id = 101; id <= 244; id++) {
    fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id.toString(),
        msg: {
          header: "DT",
          type: "DT",
          data: generateRandomData(18) // 假设 data 数组长度为 18
        }
      })
    })
    .then(response => response.json())
    .then(data => console.log(`Success (id=${id}):`, data))
    .catch((error) => {
      console.error(`Error (id=${id}):`, error);
    });
  }
};

const intervalId = setInterval(() => {
  sendBatch();
}, 10); // 每10毫秒发送一次144个请求