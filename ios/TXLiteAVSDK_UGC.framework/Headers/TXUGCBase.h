//
//  TXUGCBase.h
//  TXLiteAVSDK
//
//  Created by shengcui on 2018/5/17.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TXUGCBase : NSObject

///设置sdk的licence下载url和key
+ (void)setLicenceURL:(NSString *)url key:(NSString *)key;
///获取Licence信息
+ (NSString *)getLicenceInfo;

@end
