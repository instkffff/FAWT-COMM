const url = 'http://localhost:3003/send';
const options = {
  method: 'POST',
  headers: {'content-type': 'application/json'},
  body: JSON.stringify({
    id: "200",
    msg: {
      header: "DT",
      type: "DT",
      // 填充18个相同的数
      data: Array(18).fill(125)
    }
  })
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}