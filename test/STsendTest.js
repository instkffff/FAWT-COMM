for (let id = 101; id <= 244; id++) {
  fetch('http://localhost:3003/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id.toString(),
      msg: {
        header: "ST",
        type: "ST",
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