# TurbSim to Array PWM

1.打开 TurbSim.inp 中设置

```shell
True      WrFMTFF         - Output full-field time-series data in formatted (readable) form?  (Generates RootName.u, RootName.v, RootName.w)
```

2.运行 TurbSim.exe 生成 RootName.u, RootName.v, RootName.w

3.把生成文和 array.js wind.js 放在同一目录下

4.运行 array.js 生成 u.json, v.json, w.json

5.运行 wind.js 生成 wind.json

6.运行 pwm.js 生成 pwm.json

7.运行 framelogs.js 生成 framelog.json

8.运行 send.js 发送到风洞矩阵

send.js 可以定义发送范围

math.js 是计算pwm的公式 包括参数 [距离] [风速]
