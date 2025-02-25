# Nokov SDK 与动作捕捉系统交互

根据提供的代码片段，这是一个使用Nokov SDK与动作捕捉系统交互的Python客户端。它主要负责连接到服务器、获取数据描述、设置回调函数以处理不同类型的数据（如运动捕捉数据、模拟通道数据、力板数据等），并打印这些数据。

### 输出原理图

1. **初始化**
   - 解析命令行参数，确定服务器IP。
   - 创建`PySDKClient`实例。
   - 初始化SDK客户端，连接到指定的服务器。
   
2. **选择接收模式**
   - 用户选择是通过回调被动接收数据还是主动读取数据。
     - 如果选择**被动接收**：
       - 设置数据回调函数`py_data_func`。
       - 设置模拟通道回调函数`py_analog_channel_func`。
     - 如果选择**主动读取**：
       - 启动一个线程不断调用`read_data_func`来获取最新的运动捕捉帧数据。

3. **设置其他回调**
   - 设置消息回调`py_msg_func`用于处理日志信息。
   - 设置通知回调`py_notify_func`用于处理来自服务器的通知消息。
   - 设置力板回调`py_forcePlate_func`用于处理力板数据。

4. **获取数据描述**
   - 获取服务器描述信息。
   - 获取数据描述信息，并通过`py_desc_func`打印出来。

5. **等待力板初始化**
   - 等待力板设备初始化完成。

6. **持续运行**
   - 进入循环等待用户输入`q`退出程序。

### 数据结构图

#### 主要数据结构

1. **MocapData (运动捕捉数据)**
   - `iFrame`: 帧号
   - `iTimeStamp`: 时间戳
   - `Timecode`: 时间码
   - `nMarkerSets`: 标记集数量
   - `MocapData`: 标记集数组
   - `nRigidBodies`: 刚体数量
   - `RigidBodies`: 刚体数组
   - `nSkeletons`: 骨骼数量
   - `Skeletons`: 骨骼数组
   - `nOtherMarkers`: 未识别标记数量
   - `OtherMarkers`: 未识别标记数组
   - `nAnalogdatas`: 模拟数据数量
   - `Analogdata`: 模拟数据数组

2. **MarkerSet (标记集)**
   - `szName`: 名称
   - `nMarkers`: 标记数量
   - `Markers`: 标记位置数组

3. **RigidBody (刚体)**
   - `ID`: 刚体ID
   - `x`, `y`, `z`: 位置坐标
   - `qx`, `qy`, `qz`, `qw`: 四元数表示的姿态
   - `nMarkers`: 标记数量
   - `Markers`: 标记位置数组
   - `MarkerIDs`: 标记ID数组

4. **Skeleton (骨骼)**
   - `nRigidBodies`: 刚体数量
   - `RigidBodyData`: 刚体数组

5. **ForcePlatesData (力板数据)**
   - `iFrame`: 帧号
   - `nForcePlates`: 力板数量
   - `ForcePlates`: 力板数组
     - `Fxyz`: 力向量
     - `xyz`: 位置坐标
     - `Mfree`: 自由力矩

6. **AnalogData (模拟数据)**
   - `iFrame`: 帧号
   - `iTimeStamp`: 时间戳
   - `nAnalogdatas`: 模拟数据数量
   - `nSubFrame`: 子帧数量
   - `Analogdata`: 模拟数据数组

### 图形表示

由于无法直接绘制图形，以下是简化的文本表示：

```
+---------------------+
|      Nokov SDK      |
|    Initialization   |
+---------------------+
          |
          v
+---------------------+
| Select Data Mode    |
| (Callback/Read)     |
+---------------------+
          |
          v
+---------------------+
| Set Callbacks       |
| (Data, Analog, Msg) |
+---------------------+
          |
          v
+---------------------+
| Get Data Descriptions|
+---------------------+
          |
          v
+---------------------+
| Wait for Force Plate|
| Initialization      |
+---------------------+
          |
          v
+---------------------+
| Continuous Operation|
| (Wait for 'q')      |
+---------------------+

```

数据结构图可以使用类似的层次结构表示，每个节点代表一个数据类型及其属性。

``` python
class FrameOfMocapData(Structure):
    _fields_ = [
        ("iFrame", c_int),  # 帧编号
        ("iTimeStamp", c_int),  # 时间戳
        ("Timecode", c_int),  # 时间码
        ("TimecodeSubframe", c_int),  # 时间码子帧
        ("nMarkerSets", c_int),  # 标记集数量
        ("MocapData", POINTER(MarkerSet) * 128),  # 标记集数组，最多128个
        ("nRigidBodies", c_int),  # 刚体数量
        ("RigidBodies", POINTER(RigidBody) * 128),  # 刚体数组，最多128个
        ("nSkeletons", c_int),  # 骨骼数量
        ("Skeletons", POINTER(Skeleton) * 128),  # 骨骼数组，最多128个
        ("nOtherMarkers", c_int),  # 未识别标记数量
        ("OtherMarkers", (c_float * 3) * 1024),  # 未识别标记数组，最多1024个，每个标记有3个浮点数（x, y, z）
        ("nAnalogdatas", c_int),  # 模拟数据数量
        ("Analogdata", c_float * 128)  # 模拟数据数组，最多128个
    ]

class MarkerSet(Structure):
    _fields_ = [
        ("szName", c_char * 256),  # 标记集名称
        ("nMarkers", c_int),  # 标记数量
        ("Markers", (c_float * 3) * 128)  # 标记数组，最多128个，每个标记有3个浮点数（x, y, z）
    ]

class RigidBody(Structure):
    _fields_ = [
        ("ID", c_int),  # 刚体ID
        ("x", c_float),  # x坐标
        ("y", c_float),  # y坐标
        ("z", c_float),  # z坐标
        ("qx", c_float),  # 四元数x分量
        ("qy", c_float),  # 四元数y分量
        ("qz", c_float),  # 四元数z分量
        ("qw", c_float),  # 四元数w分量
        ("nMarkers", c_int),  # 刚体上标记的数量
        ("Markers", (c_float * 3) * 64),  # 刚体上标记数组，最多64个，每个标记有3个浮点数（x, y, z）
        ("MarkerIDs", c_int * 64)  # 刚体上标记ID数组，最多64个
    ]

class Skeleton(Structure):
    _fields_ = [
        ("nRigidBodies", c_int),  # 骨骼中的刚体数量
        ("RigidBodyData", POINTER(RigidBody) * 64)  # 骨骼中刚体数组，最多64个
    ]
```
