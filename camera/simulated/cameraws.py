__author__ = 'duguguang'

from nokov.nokovsdk import *
import time, math
import sys, getopt
import asyncio
import websockets
import json
import pandas as pd


# Global variable to store latest frame data
latest_frame_data = None
preFrmNo = 0
curFrmNo = 0

def py_data_func(pFrameOfMocapData, pUserData):
    global latest_frame_data
    if pFrameOfMocapData == None:  
        print("Not get the data frame.\n")
    else:
        # Store the raw frame data directly
        frameData = pFrameOfMocapData.contents
        global preFrmNo, curFrmNo 
        curFrmNo = frameData.iFrame
        if curFrmNo == preFrmNo:
            return

        preFrmNo = curFrmNo

        # Create a dictionary to hold the frame data
        frame_data_dict = {
            "FrameNo": frameData.iFrame,
            "TimeStamp": frameData.iTimeStamp,
            "nMarkerset": frameData.nMarkerSets,
            "MarkerSets": []
        }

        for iMarkerSet in range(frameData.nMarkerSets):
            markerset = frameData.MocapData[iMarkerSet]
            markerset_dict = {
                "Name": str(markerset.szName),
                "nMarkers": markerset.nMarkers,
                "Markers": []
            }

            for iMarker in range(markerset.nMarkers):
                marker_position = {
                    "MarkerIndex": iMarker,
                    "Position": [
                        markerset.Markers[iMarker][0],
                        markerset.Markers[iMarker][1],
                        markerset.Markers[iMarker][2]
                    ]
                }
                markerset_dict["Markers"].append(marker_position)

            frame_data_dict["MarkerSets"].append(markerset_dict)

        # Convert the dictionary to a JSON string
        #json_output = json.dumps(frame_data_dict, indent=4)

        latest_frame_data = frame_data_dict
        return frame_data_dict


# WebSocket server handler
async def websocket_handler(websocket, path):
    try:
        while True:
            if latest_frame_data:
                
                
                await websocket.send(json.dumps(latest_frame_data))
            await asyncio.sleep(0.01)
    except websockets.ConnectionClosed:
        print("WebSocket connection closed")

# Start WebSocket server
async def start_websocket_server():
    server = await websockets.serve(
        websocket_handler,
        "localhost",
        8080
    )
    print("WebSocket server started at ws://localhost:8080")
    await server.wait_closed()

async def main(argv):
    serverIp = '10.1.1.198'

    try:
        opts, args = getopt.getopt(argv, "hs:", ["server="])
    except getopt.GetoptError:
        print('NokovrSDKClient.py -s <serverIp>')
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print('NokovrSDKClient.py -s <serverIp>')
            sys.exit()
        elif opt in ("-s", "--server"):
            serverIp = arg

    print('serverIp is %s' % serverIp)
    print("Started the Nokovr_SDK_Client Demo")
    client = PySDKClient()

    ver = client.PyNokovVersion()
    print('NokovrSDK Sample Client 2.4.0.5428(NokovrSDK ver. %d.%d.%d.%d)' % (ver[0], ver[1], ver[2], ver[3]))

    client.PySetVerbosityLevel(0)
    client.PySetMessageCallback(py_msg_func)  # Assuming py_msg_func is defined elsewhere
    client.PySetDataCallback(py_data_func, None)

    print("Begin to init the SDK Client")
    ret = client.Initialize(bytes(serverIp, encoding="utf8"))

    if ret == 0:
        print("Connect to the Nokovr Succeed")
    else:
        print("Connect Failed: [%d]" % ret)
        sys.exit(0)

    serDes = ServerDescription()
    client.PyGetServerDescription(serDes)
    
    ret = client.PyWaitForForcePlateInit(5000)
    if ret != 0:
        print("Init ForcePlate Failed[%d]" % ret)
        sys.exit(0)

    # Start the WebSocket server as a background task
    websocket_task = asyncio.create_task(start_websocket_server())

    try:
        # Use an async loop to wait for user input without blocking
        while True:
            user_input = await asyncio.to_thread(input, "Press q to quit\n")
            if user_input == "q":
                break
    finally:
        websocket_task.cancel()
        try:
            await websocket_task  # Ensure the task is fully cancelled
        except asyncio.CancelledError:
            pass
        client.Uninitialize()

if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:]))