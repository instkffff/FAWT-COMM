const fs = require('fs');

// 读取 JSON 文件内容
const jsonData = fs.readFileSync('output_coordinates_mm.json', 'utf8');
const data = JSON.parse(jsonData);

let output = '';
data.forEach((frame, index) => {
  output += `${index + 1}, ${frame.Marker1[0]}, ${frame.Marker1[1]}, ${frame.Marker1[2]}\n`;
  output += `${index + 1}, ${frame.Marker2[0]}, ${frame.Marker2[1]}, ${frame.Marker2[2]}\n`;
  output += `${index + 1}, ${frame.Marker3[0]}, ${frame.Marker3[1]}, ${frame.Marker3[2]}\n`;
  output += `${index + 1}, ${frame.Marker4[0]}, ${frame.Marker4[1]}, ${frame.Marker4[2]}\n`;
});

fs.writeFile('blenderSim.log', output, (err) => {
  if (err) throw err;
  console.log('文件已保存');
});