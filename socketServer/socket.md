### socket server 配置

PORT
HTTP_PORT

### socket server 功能

1. 根据连接后第一条消息 作为客户端id 建立客户端列表
2. 可向指定客户端发送消息
3. 使用POST async await 发送消息 接收返回

发送消息格式

``` json
{
    "id": int,
    "msg": dataBuffer
}
```

返回消息格式

``` json
{
    "id": int,
    "msg": dataBuffer,
    "status": 'succeed'
}
```

消息发送失败

``` json

{
    "id": int,
    "msg": dataBuffer,
    "status": 'failed'
}
```