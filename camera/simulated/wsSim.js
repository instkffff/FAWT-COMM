function* markerSetGenerator(markerSetParams) {
  let frameNo = 0;

  // 预先定义每个 MarkerSet 的固定相对位置坐标
  const predefinedPositions = [
    [
      [-100, 100, 200],
      [-50, 50, 100],
      [100, -100, 30],
      [20, -500, 150]
    ],
    [
      [150, -150, 100],
      [250, -100, 50],
      [300, -500, 200]
    ]
  ];

  // 布朗运动的步长
  const brownianStep = 5000; // 保持步长为 100

  // 低通滤波器参数
  const filterAlpha = 0.1; // 滤波器系数，值越小，平滑度越高

  // 存储上一帧的位置
  let previousPositions = markerSetParams.map(({ pointNumber }, index) => {
    return predefinedPositions[index].map(pos => [...pos]);
  });

  while (true) {
    const timeStamp = Date.now(); // 使用当前时间戳

    const markerSets = markerSetParams.map(({ MarkerSetName, pointNumber }, index) => {
      const markers = [];
      for (let i = 0; i < pointNumber; i++) {
        const originalPosition = predefinedPositions[index][i];
        const randomOffset = [
          (Math.random() - 0.5) * brownianStep,
          (Math.random() - 0.5) * brownianStep,
          (Math.random() - 0.5) * brownianStep
        ];
        const newPosition = [
          originalPosition[0] + randomOffset[0],
          originalPosition[1] + randomOffset[1],
          originalPosition[2] + randomOffset[2]
        ];

        // 应用低通滤波器
        const filteredPosition = [
          previousPositions[index][i][0] * (1 - filterAlpha) + newPosition[0] * filterAlpha,
          previousPositions[index][i][1] * (1 - filterAlpha) + newPosition[1] * filterAlpha,
          previousPositions[index][i][2] * (1 - filterAlpha) + newPosition[2] * filterAlpha
        ];

        // 更新上一帧的位置
        previousPositions[index][i] = filteredPosition;

        markers.push({
          MarkerIndex: i,
          Position: filteredPosition
        });
      }
      return {
        Name: MarkerSetName,
        nMarkers: pointNumber,
        Markers: markers
      };
    });

    yield {
      FrameNo: frameNo++,
      TimeStamp: timeStamp,
      nMarkerset: markerSetParams.length,
      MarkerSets: markerSets
    };
  }
}

export { markerSetGenerator };