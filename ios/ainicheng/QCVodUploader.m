//
//  VodUploader.m
//  ainicheng
//
//  Created by ivan zhang on 2018/8/3.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <Photos/Photos.h>
#import "TXUGCPublish.h"
#import "TVCCommon.h"

@interface QCVodUploader : RCTEventEmitter <RCTBridgeModule,TXVideoPublishListener>

  +(void)getVodSign:(void (^)(int, NSString *))completion;
  +(void)asyncSendHttpRequest: (void (^)(int, NSString*))handler;

@end

@implementation QCVodUploader

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;
static int uploadId = 0;
static RCTEventEmitter* staticEventEmitter = nil;
static NSString *BACKGROUND_SESSION_ID = @"QCVodUploader";
static bool isCancelUpload = false;

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

-(id) init {
  self = [super init];
  if (self) {
    staticEventEmitter = self;
  }
  return self;
}

- (void)_sendEventWithName:(NSString *)eventName body:(id)body {
  if (staticEventEmitter == nil)
    return;
  [staticEventEmitter sendEventWithName:eventName body:body];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
           @"QCVodUploader-error",
           @"QCVodUploader-progress",
           @"QCVodUploader-cancelled",
           @"QCVodUploader-completed"
        ];
}

#pragma mark - TXVideoPublishListener
-(void) onPublishProgress:(NSInteger)uploadBytes totalBytes: (NSInteger)totalBytes
{
  float progress = -1;
  if (uploadBytes > 0){
    progress = 100.0 * (float)uploadBytes / (float)totalBytes;
  }
  [self _sendEventWithName:@"QCVodUploader-progress" body:@{ @"id": [NSString stringWithFormat:@"%d", uploadId], @"progress": [NSNumber numberWithFloat:progress] }];
  NSLog(@"onPublishProgress [%ld/%ld] progress: [%f]", (long)uploadBytes, (long)totalBytes, progress);
}

-(void) onPublishComplete:(TXPublishResult*)result
{
  NSMutableDictionary *data = [NSMutableDictionary dictionaryWithObjectsAndKeys:[NSString stringWithFormat:@"%d", uploadId], @"id", nil];
  [data setObject:result.videoId forKey:@"fileId"];
  [data setObject:result.videoURL forKey:@"videoUrl"];
  [self _sendEventWithName:@"QCVodUploader-completed" body:data];
  NSString *string = [NSString stringWithFormat:@"上传完成，错误码[%d]，信息[%@]", result.retCode, result.retCode == 0? result.videoURL: result.descMsg];
  NSLog(@"message: %@", string);
  NSLog(@"onPublishComplete [%d/%@]", result.retCode, result.retCode == 0? result.videoURL: result.descMsg);
}

/*
 Gets file information for the path specified.  Example valid path is: file:///var/mobile/Containers/Data/Application/3C8A0EFB-A316-45C0-A30A-761BF8CCF2F8/tmp/trim.A5F76017-14E9-4890-907E-36A045AF9436.MOV
 Returns an object such as: {mimeType: "video/quicktime", size: 2569900, exists: true, name: "trim.AF9A9225-FC37-416B-A25B-4EDB8275A625.MOV", extension: "MOV"}
 */
RCT_EXPORT_METHOD(getFileInfo:(NSString *)path resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSURL *fileUri = [NSURL URLWithString: path];
    NSString *pathWithoutProtocol = [fileUri path];
    NSString *name = [fileUri lastPathComponent];
    NSString *extension = [name pathExtension];
    bool exists = [[NSFileManager defaultManager] fileExistsAtPath:pathWithoutProtocol];
    NSMutableDictionary *params = [NSMutableDictionary dictionaryWithObjectsAndKeys: name, @"name", nil];
    [params setObject:extension forKey:@"extension"];
    [params setObject:[NSNumber numberWithBool:exists] forKey:@"exists"];
    
    if (exists)
    {
      [params setObject:[self guessMIMETypeFromFileName:name] forKey:@"mimeType"];
      NSError* error;
      NSDictionary<NSFileAttributeKey, id> *attributes = [[NSFileManager defaultManager] attributesOfItemAtPath:pathWithoutProtocol error:&error];
      if (error == nil)
      {
        unsigned long long fileSize = [attributes fileSize];
        [params setObject:[NSNumber numberWithLong:fileSize] forKey:@"size"];
      }
    }
    NSLog(@"get fileinfo ok");
    resolve(params);
  }
  @catch (NSException *exception) {
    NSLog(@"get fileinfo error: %@", exception.name);
    reject(@"QCVodUploader", exception.name, nil);
  }
}

/*
 Borrowed from http://stackoverflow.com/questions/2439020/wheres-the-iphone-mime-type-database
 */
- (NSString *)guessMIMETypeFromFileName: (NSString *)fileName {
  CFStringRef UTI = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, (__bridge CFStringRef)[fileName pathExtension], NULL);
  CFStringRef MIMEType = UTTypeCopyPreferredTagWithClass(UTI, kUTTagClassMIMEType);
  CFRelease(UTI);
  if (!MIMEType) {
    return @"application/octet-stream";
  }
  return (__bridge NSString *)(MIMEType);
}


/*
 * Starts a file upload.
 * Options are passed in as the first argument as a js hash:
 * {
 *   url: string.  url to post to.
 *   path: string.  path to the file on the device
 *   headers: hash of name/value header pairs
 * }
 *
 * Returns a promise with the string ID of the upload.
 */
RCT_EXPORT_METHOD(startUpload:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  int thisUploadId;
  @synchronized(self.class)
  {
    thisUploadId = ++uploadId;
  }
  
  __block NSString *fileURI = options[@"path"];
  NSString *customUploadId = options[@"customUploadId"];
  if(customUploadId){
    uploadId = [customUploadId intValue];
  }
  
  NSLog(@"start get signature ...");
  
  [QCVodUploader getVodSign: ^(int code, NSString *signature) {
    
    if(!code){
      NSLog(@"get signature failed: %@", signature);
      return;
    }
    
    NSLog(@"start upload with video path: %@", fileURI);
    @try{
      TXUGCPublish   *_videoPublish = [[TXUGCPublish alloc] initWithUserID:@"carol_ios"];
      _videoPublish.delegate = self;
      TXPublishParam *videoPublishParams = [[TXPublishParam alloc] init];
      videoPublishParams.signature  = signature;
      videoPublishParams.videoPath  = fileURI;
      [_videoPublish publishVideo:videoPublishParams];
      resolve([NSString stringWithFormat:@"%d",thisUploadId]);
    }
    @catch (NSException *exception) {
      reject(@"QCVodUploader uploading error:", exception.name, nil);
    }
  
  }];
  
}

+ (void)getVodSign:(void (^)(int code, NSString *signature))completion
{

  [QCVodUploader asyncSendHttpRequest: ^(int code, NSString *signature) {
    completion(code, signature);
  }];
}

+ (void)asyncSendHttpRequest: (void (^)(int code, NSString *signature))handler
{
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    NSString* urlString = @"https://ainicheng.com/sdk/qcvod.php";
    NSMutableString *strUrl = [[NSMutableString alloc] initWithString:urlString];
    
    NSURL *URL = [NSURL URLWithString:strUrl];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL];
    
    [request setHTTPMethod:@"GET"];
    [request setValue:@"text/html; charset=UTF-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:@"gzip" forHTTPHeaderField:@"Accept-Encoding"];
  
    [request setTimeoutInterval:3];
    
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
      if (error != nil)
      {
        NSLog(@"internalSendRequest failed，NSURLSessionDataTask return error code:%d, des:%@", (int)[error code], [error description]);
        dispatch_async(dispatch_get_main_queue(), ^{
          handler(-1, @"服务请求失败");
        });
      }
      else
      {
        NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
       
        dispatch_async(dispatch_get_main_queue(), ^{
          handler(1, responseString);
        });
      }
    }];
    
    [task resume];
  });
}

/*
 * Cancels file upload
 * Accepts upload ID as a first argument, this upload will be cancelled
 * Event "cancelled" will be fired when upload is cancelled.
 */
RCT_EXPORT_METHOD(cancelUpload: (NSString *)cancelUploadId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  isCancelUpload = true;
  resolve([NSNumber numberWithBool:YES]);
}


@end
