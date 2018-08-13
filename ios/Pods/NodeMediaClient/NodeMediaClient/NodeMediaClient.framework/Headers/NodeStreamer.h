//
//  NodeStreamer.h
//  NodeMediaClient
//
//  Created by Mingliang Chen on 16/9/8.
//  Copyright © 2016年 NodeMedia. All rights reserved.
//

#import <Foundation/Foundation.h>

#define RTSP_TRANSPORT_UDP @"udp"
#define RTSP_TRANSPORT_TCP @"tcp"
#define RTSP_TRANSPORT_UDP_MULTICAST @"udp_multicast"
#define RTSP_TRANSPORT_HTTP @"http"

@protocol NodeStreamerDelegate

-(void) onEventCallback:(nonnull id)sender event:(int)event msg:(nonnull NSString*)msg;

@end

@interface NodeStreamer : NSObject

@property (nullable, nonatomic, weak) id<NodeStreamerDelegate> nodeStreamerDelegate;

/**
 * @brief RTSP 传输协议
 * RTSP_TRANSPORT_UDP
 * RTSP_TRANSPORT_TCP
 * RTSP_TRANSPORT_UDP_MULTICAST
 * RTSP_TRANSPORT_HTTP
 */
@property (nonnull, nonatomic, strong) NSString *rtspTransport;

///开始以视频原始帧率进行串流,多用于输入为本地文件或点播地址
-(int) startNativeRateStreaming:(nonnull NSString*)inputUrl output:(nonnull NSString*)outputUrl;

///开始串流
-(int) startStreamingWithInput:(nonnull NSString*)inputUrl output:(nonnull NSString*)outputUrl;

///停止串流
-(int) stopStreaming;

@end
