// Define a function to send fan control request
function sendFanControlRequest(obj) {
  const { value, duration } = obj;

  // Construct request data
  const requestData = {
    id: "101",
    msg: {
      header: "DT",
      type: "DT",
      data: Array(18).fill(value) // Assume data array length is 18, all elements set to the same value
    }
  };

  // Send POST request
  return fetch('http://localhost:3003/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Request successful:', data);
  })
  .catch(error => {
    console.error('Request failed:', error);
  });
}

// Example usage
const fanControlArray = [
  { value: 50, duration: 6000 },
  { value: 150, duration: 8000 },
  { value: 100, duration: 10000 },
  { value: 250, duration: 6000 },
  { value: 150, duration: 20000 },
  { value: 0, duration: 10000 },
];

async function sendRequestsSequentially() {
  for (const obj of fanControlArray) {
    await sendFanControlRequest(obj);
    await new Promise(resolve => setTimeout(resolve, obj.duration));
  }
}

sendRequestsSequentially();