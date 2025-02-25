class MarkerSet {
    constructor(name, markers) {
        this.szName = name;
        this.nMarkers = markers.length;
        this.Markers = markers;
    }
}

class FrameOfMocapData {
    constructor(iFrame, iTimeStamp, markerSets) {
        this.iFrame = iFrame;
        this.iTimeStamp = iTimeStamp;
        this.nMarkerSets = markerSets.length;
        this.MocapData = markerSets;
    }
}

function generateRandomMarkers(numMarkers) {
    const markers = [];
    for (let i = 0; i < numMarkers; i++) {
        const x = parseFloat(((Math.random() * 6000) - 3000).toFixed(4)); // 随机生成 -3000 到 3000 之间的坐标并保留四位小数
        const y = parseFloat(((Math.random() * 6000) - 3000).toFixed(4));
        const z = parseFloat(((Math.random() * 6000) - 3000).toFixed(4));
        markers.push([x, y, z]);
    }
    return markers;
}

function generateFrameData(iFrame, iTimeStamp, markerSetConfigs) {
    const markerSets = markerSetConfigs.map(config => {
        const markers = generateRandomMarkers(config.numMarkers);
        return new MarkerSet(config.name, markers);
    });

    return new FrameOfMocapData(iFrame, iTimeStamp, markerSets);
}

let preFrmNo = 0;
let curFrmNo = 0;

function simulateFrames(numFrames, markerSetConfigs) {
    for (let i = 0; i < numFrames; i++) {
        curFrmNo = i + 1;
        if (curFrmNo === preFrmNo) {
            continue;
        }

        preFrmNo = curFrmNo;
        const frameData = generateFrameData(curFrmNo, Date.now(), markerSetConfigs);

        return frameData;
    }
}

export { simulateFrames, generateFrameData };