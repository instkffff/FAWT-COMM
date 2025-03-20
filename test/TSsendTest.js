for (let id = 101; id <= 244; id++) {
  fetch('http://localhost:3003/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id.toString(),
      msg: {
        header: "TS",
        type: "TS",
        data: "TEST"
      }
    })
  })
  .then(response => response.json())
  .then(data => console.log(`Response for id ${id}:`, data))
  .catch(error => console.error(`Error for id ${id}:`, error));
}