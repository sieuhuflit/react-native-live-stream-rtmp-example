# NodeMediaClient
一个简单，快速，免费的直播SDK.

# Cocoapods 安装
## 创建 Podfile 文件
```ruby
source 'https://github.com/CocoaPods/Specs.git'
target 'QLive' do
pod 'NodeMediaClient'
end
```
## 安装
```shell
pod install
```

# 简单用法
完整用例[QLive源码](https://github.com/NodeMedia/QLive-iOS) 

## NodePlayer
```
#import <NodeMediaClient/NodeMediaClient.h>
......

@property (strong,nonatomic) NodePlayer *np;

......
// 开始播放直播视频
    _np = [[NodePlayer alloc] init];
    [_np setPlayerView:self.view];
    [_np setInputUrl:@"rtmp://192.168.0.10/live/stream"];
    [_np start];
    
......

// 停止播放
    [_np stop];
```

## NodePublisher

**请确认描述条目'Privacy - Microphone Usage Description' 和 'Privacy - Camera Usage Description' 已经添加入info.plist**

```
#import <NodeMediaClient/NodeMediaClient.h>

......

@property (strong, nonatomic) NodePublisher *np;

......
// 开始摄像头预览和视频推流
    _np = [[NodePublisher alloc] init];
    [_np setCameraPreview:self.view cameraId:CAMERA_FRONT frontMirror:YES];
    [_np setAudioParamBitrate:32000 profile:AUDIO_PROFILE_HEAAC];
    [_np setVideoParamPreset:VIDEO_PPRESET_16X9_360 fps:15 bitrate:500000 profile:VIDEO_PROFILE_MAIN frontMirror:NO];
    [_np setOutputUrl:@"rtmp://192.168.0.10/live/stream"];
    [_np startPreview];
    [_np start];

......


// 停止摄像头预览和推流
    [_np stopPreview];
    [_np stop];
```
# 特性
## NodePlayer
* 专为RTMP/RTSP等直播协议优化的码流解析器，极短的分析时间，秒开视频流
* NEON指令集优化的软件解码器，性能好，兼容性强
* 视频编码:H.265/H.264/H.263/MPEG4支持硬解码
* 支持的网络协议 RTMP/RTMPT/RTMPE/RTSP/HLS/HTTP(S)-FLV
* 支持的视频解码器:H.264, H.265,FLV, VP6, MPEG4
* 支持的音频解码器:AAC, MP3, SPEEX, NELLYMOSER, ADPCM_SWF, G.711
* OpenGL ES视频渲染
* 全自动网络异常重连
* 支持播放中途来电保持网络流，暂停播放，挂机后继续播放
* 支持设置最大缓冲时长,杜绝延迟累计
* 支持多路直播流同时播放
* RTMP支持设置swfUrl和pageUrl
* RTMP支持设置Connect Arguments (rtmpdump风格)
* RTMP支持Adobe auth模式的鉴权验证 如rtmp://user:pass@server:port/app/name
* RTMP支持播放前设置receiveAudio,receiveVideo来控制只接收音频或视频流(需服务端实现，fms，red5支持)
* RTMP支持发送FCSubscribe命令，兼容国外Akamai, Edgecast , Limelight 等CDN
* RTMP支持RTMP 302重定向(AMS,Wowza模式)
* RTSP支持的传输协议: TCP/UDP/UDP_MULTICAST/HTTP
* RTSP支持海康Smart265解码播放

## NodePublisher
* H.264/AAC 组合的RTMP协议音视频流发布
* 全屏视频采集，720p原画质缩放
* NEON指令集优化H.264软件编码器，性能强劲，兼容性极强
* H.264支持Baseline, Main, High profile
* iOS8以上支持视频硬编码
* 支持手机旋转,横屏16:9，竖屏9:16分辨率自动输出横竖屏视频流
* 支持4:3分辨率,1:1分辨率输出
* NEON优化AAC软件编码器，极少CPU占用，支持LC和HE profile，音质还原效果好
* 支持SPEEX音频编码
* 支持环境背景噪音抑制
* 支持发布中途切换前后摄像头
* 支持闪光灯开关
* 支持全时自动对焦与手动对焦切换
* 支持单音频流发布
* 支持发布中途来电保持网络流，暂停发布，挂机后继续发布
* 支持预览摄像头后,任意时刻截图
* 内置基于GPU加速的5级磨皮美白滤镜
* 支持动态设置视频码率
* 支持视频码率自适应网络带宽
* 支持GPU算法的镜头缩放,兼容性好
* 全自动网络异常重连
* 不依赖\不冲突GPUImage
* 支持定义为'live','record','append'的发布类型

## NodeStreamer
用于户外环境下,具有RTSP协议的运动相机/无人机连接手机热点,通过手机4G网络串流到RTMP服务器。  
手机端不进行编解码,只有网络IO,不占用CPU.注:当按Home或锁屏时,系统会禁止后台网络传输。  
RTSP输入支持的传输协议: TCP/UDP/UDP_MULTICAST/HTTP

## MPEGTS over UDP
当推流url为udp协议地址时, 如 udp://192.168.0.10:12345 则按照mpegts格式封装，udp传输。
接收端可以是任何支持该协议的播放器，如vlc。
如果推流ip地址是内网另外一台手机，则另一台手机只需用NodePlayer播放udp://127.0.0.1:12345即可，根据udp的特性，可随时打开关闭，再打开不中断，无需服务端

# 支持的流媒体服务端
fms, wowza, evostream, red5, crtmpserver, nginx-rtmp-module, srs, [Node-Media-Server](https://github.com/illuspas/Node-Media-Server) 及其他标准RTMP协议服务端

# 跨平台开源流媒体服务端
[Node-Media-Server](https://github.com/illuspas/Node-Media-Server) 
基于Node.JS开发, 跨平台/高性能, 支持RTMP协议推流,RTMP/HTTP-FLV/WebSocket-FLV播放, 内置推流鉴权/播放防盗链/GOP缓存急速秒开.

# 高级版
- 硬件加速的视频编码、解码器
- 麦克风降噪
- 平滑肌肤美颜

请联系商务服务邮箱 : service@nodemedia.cn
