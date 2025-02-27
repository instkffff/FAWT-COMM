import logging
from dataclasses import dataclass
from typing import Optional, Dict, Any
from nokov.nokovsdk import *
import time, math, sys, getopt
import asyncio
import websockets
import json
import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

@dataclass
class Config:
    DEFAULT_SERVER_IP: str = '10.1.1.198'
    WS_HOST: str = 'localhost'
    WS_PORT: int = 8080
    DATA_SEND_INTERVAL: float = 0.01

class NokovCamera:
    def __init__(self):
        self.latest_frame_data: Optional[Dict[str, Any]] = None
        self.pre_frame_no: int = 0
        self.cur_frame_no: int = 0
        self.client = PySDKClient()
        
    def data_callback(self, frame_data, user_data) -> Optional[Dict]:
        if frame_data is None:
            logging.warning("Not get the data frame.")
            return None
            
        frame = frame_data.contents
        self.cur_frame_no = frame.iFrame
        if self.cur_frame_no == self.pre_frame_no:
            return None

        self.pre_frame_no = self.cur_frame_no
        
        frame_data_dict = {
            "FrameNo": frame.iFrame,
            "TimeStamp": frame.iTimeStamp,
            "nMarkerset": frame.nMarkerSets,
            "MarkerSets": []
        }

        for iMarkerSet in range(frame.nMarkerSets):
            markerset = frame.MocapData[iMarkerSet]
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
        
        self.latest_frame_data = frame_data_dict
        return frame_data_dict

    async def start(self, server_ip: str):
        try:
            ver = self.client.PyNokovVersion()
            logging.info(f'NokovrSDK ver. {ver[0]}.{ver[1]}.{ver[2]}.{ver[3]}')
            
            self.client.PySetVerbosityLevel(0)
            self.client.PySetMessageCallback(py_msg_func)
            self.client.PySetDataCallback(self.data_callback, None)
            
            ret = self.client.Initialize(bytes(server_ip, encoding="utf8"))
            if ret != 0:
                raise RuntimeError(f"Connection failed with error code: {ret}")
                
            logging.info("Connected to Nokovr successfully")
            
            serDes = ServerDescription()
            self.client.PyGetServerDescription(serDes)
            
            ret = self.client.PyWaitForForcePlateInit(5000)
            if ret != 0:
                raise RuntimeError(f"Init ForcePlate Failed: {ret}")
            
        except Exception as e:
            logging.error(f"Failed to start camera: {str(e)}")
            raise

    def stop(self):
        self.client.Uninitialize()
        logging.info("Camera stopped")

class WebSocketServer:
    def __init__(self, camera: NokovCamera):
        self.camera = camera
        self.server = None
        
    async def handler(self, websocket, path):
        try:
            while True:
                if self.camera.latest_frame_data:
                    await websocket.send(json.dumps(self.camera.latest_frame_data))
                await asyncio.sleep(Config.DATA_SEND_INTERVAL)
        except websockets.ConnectionClosed:
            logging.info("WebSocket connection closed")
        except Exception as e:
            logging.error(f"WebSocket error: {str(e)}")

    async def start(self):
        self.server = await websockets.serve(
            self.handler,
            Config.WS_HOST,
            Config.WS_PORT
        )
        logging.info(f"WebSocket server started at ws://{Config.WS_HOST}:{Config.WS_PORT}")
        return self.server

    async def stop(self):
        if self.server:
            self.server.close()
            await self.server.wait_closed()
            logging.info("WebSocket server stopped")

async def main(argv):
    try:
        opts, args = getopt.getopt(argv, "hs:", ["server="])
        server_ip = Config.DEFAULT_SERVER_IP
        
        for opt, arg in opts:
            if opt == '-h':
                print('NokovrSDKClient.py -s <serverIp>')
                sys.exit()
            elif opt in ("-s", "--server"):
                server_ip = arg
        
        camera = NokovCamera()
        await camera.start(server_ip)
        
        ws_server = WebSocketServer(camera)
        await ws_server.start()
        
        try:
            while True:
                user_input = await asyncio.to_thread(input, "Press q to quit\n")
                if user_input.lower() == 'q':
                    break
        finally:
            await ws_server.stop()
            camera.stop()
            
    except Exception as e:
        logging.error(f"Application error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:]))