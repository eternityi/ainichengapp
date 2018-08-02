#ifndef TXUGCRecordTypeDef_H
#define TXUGCRecordTypeDef_H

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/*
 * CameraRecord 录制视频质量类型
 */
typedef NS_ENUM(NSInteger, TXVideoQuality)
{
    VIDEO_QUALITY_LOW                               = 0,            //resolution  360×640     fps 20   bitrate 600
    VIDEO_QUALITY_MEDIUM                            = 1,            //resolution  540×960     fps 20   bitrate 2400
    VIDEO_QUALITY_HIGH                              = 2,            //resolution  720×1280    fps 20   bitrate 3600
};

/*
 * CameraRecord 录制分辨率类型定义
 */
typedef NS_ENUM(NSInteger, TXVideoResolution)
{
    VIDEO_RESOLUTION_360_640                  = 0,
    VIDEO_RESOLUTION_540_960                  = 1,
    VIDEO_RESOLUTION_720_1280                 = 2,
};

/*
 * CameraRecord 视频渲染模式类型定义
 */
typedef NS_ENUM(NSInteger, TXVideoRenderMode)
{
    VIDEO_RENDER_MODE_FULL_FILL_SCREEN        = 0,   //填充模式，尽可能充满屏幕不留黑边，所以可能会裁剪掉一部分画面
    VIDEO_RENDER_MODE_ADJUST_RESOLUTION       = 1,   //黑边模式，尽可能保持画面完整，但当宽高比不合适时会有黑边出现
};

/*
 * CameraRecord 录制视频比例类型定义
 */
typedef NS_ENUM(NSInteger, TXVideoAspectRatio) {
    VIDEO_ASPECT_RATIO_3_4,           // 3:4
    VIDEO_ASPECT_RATIO_9_16,          // 9:16
    VIDEO_ASPECT_RATIO_1_1            // 1:1
};

/*
 * CameraRecord 录制视频速率
 */
typedef NS_ENUM(NSInteger, TXVideoRecordSpeed) {
    VIDEO_RECORD_SPEED_SLOWEST,       //急慢速
    VIDEO_RECORD_SPEED_SLOW,          //慢速
    VIDEO_RECORD_SPEED_NOMAL,         //正常速
    VIDEO_RECORD_SPEED_FAST,          //快速
    VIDEO_RECORD_SPEED_FASTEST,       //极快速
};

/*
 * 横竖屏录制类型定义
 */
typedef NS_ENUM(NSInteger, TXVideoHomeOrientation) {
    VIDOE_HOME_ORIENTATION_RIGHT  = 0,        // home在右边横屏录制
    VIDEO_HOME_ORIENTATION_DOWN,              // home在下面竖屏录制
    VIDEO_HOME_ORIENTATION_LEFT,              // home在左边横屏录制
    VIDOE_HOME_ORIENTATION_UP,                // home在上面竖屏录制
};

/**
 * 编码方式
 */
typedef NS_ENUM(NSInteger, TXVideoEncodeMode){
    VIDEO_ENCODER_MODE_CBR,           //CBR 编码方式
    VIDEO_ENCODER_MODE_VBR,           //VBR 编码方式
};

/**
 * 混响效果
 */
typedef NS_ENUM(NSInteger, TXVideoReverbType) {
    VIDOE_REVERB_TYPE_0         = 0,    //关闭混响
    VIDOE_REVERB_TYPE_1         = 1,    //KTV
    VIDOE_REVERB_TYPE_2         = 2,    //小房间
    VIDOE_REVERB_TYPE_3         = 3,    //大会堂
    VIDOE_REVERB_TYPE_4         = 4,    //低沉
    VIDOE_REVERB_TYPE_5         = 5,    //洪亮
    VIDOE_REVERB_TYPE_6         = 6,    //金属声
    VIDOE_REVERB_TYPE_7         = 7,    //磁性
};

/*
 * 变声类型
 */
typedef NS_ENUM(NSInteger, TXVideoVoiceChangerType) {
    VIDOE_VOICECHANGER_TYPE_0   = 0,    //关闭变声
    VIDOE_VOICECHANGER_TYPE_1   = 1,    //熊孩子
    VIDOE_VOICECHANGER_TYPE_2   = 2,    //萝莉
    VIDOE_VOICECHANGER_TYPE_3   = 3,    //大叔
    VIDOE_VOICECHANGER_TYPE_4   = 4,    //重金属
    VIDOE_VOICECHANGER_TYPE_5   = 5,    //感冒
    VIDOE_VOICECHANGER_TYPE_6   = 6,    //外国人
    VIDOE_VOICECHANGER_TYPE_7   = 7,    //困兽
    VIDOE_VOICECHANGER_TYPE_8   = 8,    //死肥仔
    VIDOE_VOICECHANGER_TYPE_9   = 9,    //强电流
    VIDOE_VOICECHANGER_TYPE_10  = 10,   //重机械
    VIDOE_VOICECHANGER_TYPE_11  = 11,   //空灵
};

/*
 * 美颜类型
 */
typedef NS_ENUM(NSInteger, TXVideoBeautyStyle) {
    VIDOE_BEAUTY_STYLE_SMOOTH     = 0,    // 光滑
    VIDOE_BEAUTY_STYLE_NATURE     = 1,    // 自然
    VIDOE_BEAUTY_STYLE_PITU       = 2,    // pitu美颜
};

typedef NS_ENUM(NSInteger, TXAudioSampleRate) {
    AUDIO_SAMPLERATE_8000 = 0,
    AUDIO_SAMPLERATE_16000,
    AUDIO_SAMPLERATE_32000,
    AUDIO_SAMPLERATE_44100,
    AUDIO_SAMPLERATE_48000,
};

/*
 * 录制参数定义
 */

@interface TXUGCSimpleConfig : NSObject
@property (nonatomic, assign) TXVideoQuality        videoQuality;        //录制视频质量
//这里的水印设置参数已经废弃，设置水印请直接调用TXUGCRecord.h 里面的setWaterMark接口
//@property (nonatomic, retain) UIImage *           watermark;           //设置水印图片. 设为nil等同于关闭水印
//@property (nonatomic, assign) CGPoint             watermarkPos;        //设置水印位置
@property (nonatomic, assign) BOOL                  frontCamera;         //是否是前置摄像头
@property (nonatomic, assign) float                 minDuration;         //设置视频录制的最小时长，大于0         (s)
@property (nonatomic, assign) float                 maxDuration;         //设置视频录制的最大时长，建议不超过300  (s)
@end

@interface TXUGCCustomConfig : NSObject
@property (nonatomic, assign) TXVideoResolution     videoResolution;     //自定义分辨率
@property (nonatomic, assign) int                   videoFPS;            //自定义fps   15~30

//自定义码率   建议值：600~12000 (SDK上限不再做限制)  单位kbps/s,这里需要注意的是，这里设置的码率只是给编码器一个参考值，实际出来视频的码率是会在这个参考值上下波动的
@property (nonatomic, assign) int                   videoBitratePIN;
//这里的水印设置参数已经废弃，设置水印请直接调用TXUGCRecord.h 里面的setWaterMark接口
//@property (nonatomic, retain) UIImage *           watermark;           //设置水印图片. 设为nil等同于关闭水印
//@property (nonatomic, assign) CGPoint             watermarkPos;        //设置水印位置
@property (nonatomic, assign) BOOL                  frontCamera;         //是否是前置摄像头
@property (nonatomic, assign) TXVideoEncodeMode     encodeMode;          //编码方式   （默认VBR编码方式，相同码率下能获得更好的画面质量）
@property (nonatomic, assign) BOOL                  enableBFrame;        //是否开启B帧 （默认开启，相同码率下能获得更好的画面质量)

//开启回声消除，BGM会通过代码混入人声，生成的视频BGM音质更好，衔接性更好(如果使用了多段录制功能)。
//关闭回声消除，BGM会通过喇叭播放后和人声一起录入视频，生成的视频BGM音质稍差，衔接性稍差(如果使用了多段录制功能)，除非特殊业务需求（比如跟拍，一边播放跟拍的视频，一边录制视频，并且跟拍的视频的声音需要合成到录制视频中），不建议关闭回声消除）
@property (nonatomic, assign) BOOL                  enableAEC;           //是否开启回声消除（默认开启）
@property (nonatomic, assign) int                   GOP;                 //关键帧间隔（1 ~10）,默认3s          (s)
@property (nonatomic, assign) TXAudioSampleRate     audioSampleRate;     //音频采样率
@property (nonatomic, assign) float                 minDuration;         //设置视频录制的最小时长，大于0         (s)
@property (nonatomic, assign) float                 maxDuration;         //设置视频录制的最大时长，建议不超过300  (s)
@end


/*
 * 录制结果错误码定义
 */
typedef NS_ENUM(NSInteger, TXUGCRecordResultCode)
{
    UGC_RECORD_RESULT_OK                                = 0,    //录制成功（业务层主动结束录制）,会生成最终视频
    UGC_RECORD_RESULT_OK_INTERRUPT                      = 1,    //录制成功（因为进后台，或则闹钟，电话打断等自动结束录制），会生成最终视频
    UGC_RECORD_RESULT_OK_UNREACH_MINDURATION            = 2,    //录制成功（录制时长未达到设置的最小时长），会生成最终视频
    UGC_RECORD_RESULT_OK_BEYOND_MAXDURATION             = 3,    //录制成功（录制时长超过设置的最大时长），会生成最终视频
    UGC_RECORD_RESULT_FAILED                            = 1001, //录制失败，不会生成最终视频
};


/*
 * 录制结果
 */
@interface TXUGCRecordResult : NSObject
@property (nonatomic, assign) TXUGCRecordResultCode retCode;        //错误码
@property (nonatomic, strong) NSString*             descMsg;        //错误描述信息
@property (nonatomic, strong) NSString*             videoPath;      //视频文件path
@property (nonatomic, strong) UIImage*              coverImage;     //视频封面
@end

#endif
