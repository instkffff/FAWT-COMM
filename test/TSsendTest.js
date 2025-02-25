for (let id = 1; id <= 144; id++) {
  fetch('http://localhost:3001/send', {
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