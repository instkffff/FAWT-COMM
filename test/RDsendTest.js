for (let id = 1; id <= 144; id++) {
  fetch('http://localhost:3001/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id.toString(),
      msg: {
        header: "RD",
        type: "RD",
        data: null
      }
    })
  })
  .then(response => response.json())
  .then(data => console.log(`Success (id=${id}):`, data))
  .catch((error) => {
    console.error(`Error (id=${id}):`, error);
  });
}