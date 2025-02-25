import asyncio
import websockets

async def echo(websocket):
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            await websocket.send(message)
    except websockets.exceptions.ConnectionClosedOK:
        print("Connection closed gracefully")

async def main():
    server = await websockets.serve(echo, "localhost", 8080)
    print("WebSocket server started on ws://localhost:8080")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
