package com.ainicheng.rnpackages.voduploader;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import com.ainicheng.rnpackages.voduploader.server.PublishSigListener;
import com.ainicheng.rnpackages.voduploader.server.ReportVideoInfoListener;
import com.ainicheng.rnpackages.voduploader.server.VideoDataMgr;
import com.ainicheng.videoupload.TXUGCPublish;
import com.ainicheng.videoupload.TXUGCPublishTypeDef;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
//import com.tencent.liteav.basic.log.TXCLog;
//import com.tencent.rtmp.TXLog;
//import com.tencent.ugc.TXVideoInfoReader;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;


/**
 * Created by ivan on 18-8-2.
 */

public class UploaderModule extends ReactContextBaseJavaModule {
    private static final String TAG = "UploaderBridge";

    private String signature;
    private String mVideoPath, mCoverImagePath;
    private TXUGCPublish mTXugcPublish;
    private boolean isCancelPublish = false;
    private PublishSigListener mPublishSiglistener;
    private ReportVideoInfoListener mReportVideoInfoListener;
    private Context mContent;
    private String customUploadId;


    public UploaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContent = reactContext;
    }

    @Override
    public String getName() {
        return "VodUploader";
    }

    /*
    Sends an event to the JS module.
     */
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        this.getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("VodUploader-" + eventName, params);
    }

    /*
    Gets file information for the path specified.  Example valid path is: /storage/extSdCard/DCIM/Camera/20161116_074726.mp4
    Returns an object such as: {extension: "mp4", size: "3804316", exists: true, mimeType: "video/mp4", name: "20161116_074726.mp4"}
     */
    @ReactMethod
    public void getFileInfo(String path, final Promise promise) {
        try {
            WritableMap params = Arguments.createMap();
            File fileInfo = new File(path);
            params.putString("name", fileInfo.getName());
            if (!fileInfo.exists() || !fileInfo.isFile()) {
                params.putBoolean("exists", false);
            } else {
                params.putBoolean("exists", true);
                params.putString("size", Long.toString(fileInfo.length())); //use string form of long because there is no putLong and converting to int results in a max size of 17.2 gb, which could happen.  Javascript will need to convert it to a number
                String extension = MimeTypeMap.getFileExtensionFromUrl(path);
                params.putString("extension", extension);
                String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.toLowerCase());
                params.putString("mimeType", mimeType);
            }

            //保存要上传的视频文件的路径
            mVideoPath = path;
            promise.resolve(params);
        } catch (Exception exc) {
            Log.e(TAG, exc.getMessage(), exc);
            promise.reject(exc);
        }
    }

    private void initData() {
        //getFileInfo先获得 mVideoPath ..

        //本地截图视频封面？？
//        mCoverImagePath = "/sdcard/cover.jpg";
//        final Bitmap coverBitmap = TXVideoInfoReader.getInstance().getSampleImage(0, mVideoPath);
//        if (coverBitmap != null) {
//            new Thread(new Runnable() {
//                @Override
//                public void run() {
//                    saveBitmap(coverBitmap, mCoverImagePath);
//                }
//            }).start();
//        }

    }


    //开始上传
    private void uploadToVod() {

        mTXugcPublish = new TXUGCPublish(mContent, "customID");
        mTXugcPublish.setListener(new TXUGCPublishTypeDef.ITXVideoPublishListener() {
            @Override
            public void onPublishProgress(long uploadBytes, long totalBytes) {
                Log.d(TAG, "onPublishProgress [" + uploadBytes + "/" + totalBytes + "]");

                int progress = (int) ((uploadBytes * 100) / totalBytes);
                WritableMap params = Arguments.createMap();
                params.putString("id", customUploadId);
                params.putInt("progress", progress); //0-100
                sendEvent("progress", params);

                if (isCancelPublish) {
                    return;
                }
            }

            @Override
            public void onPublishComplete(TXUGCPublishTypeDef.TXPublishResult result) {
                Log.d(TAG, "onPublishComplete [" + result.retCode + "/" + (result.retCode == 0 ? result.videoId + result.videoURL : result.descMsg) + "]");

                WritableMap params = Arguments.createMap();
                params.putString("id", customUploadId);
                params.putString("fileId", result.videoId);
                params.putString("videoUrl", result.videoURL);
                sendEvent("completed", params);

                // 这里可以把上传返回的视频信息以及自定义的视频信息上报到自己的业务服务器
//                VideoDataMgr.getInstance().reportVideoInfo(result.videoId, result.videoURL);

                if (isCancelPublish) {
                    return;
                }

            }
        });

        TXUGCPublishTypeDef.TXPublishParam param = new TXUGCPublishTypeDef.TXPublishParam();
        // signature计算规则可参考 https://www.qcloud.com/document/product/266/9221
        param.signature = signature;
        param.videoPath = mVideoPath;
        param.coverPath = mCoverImagePath;
        param.fileName = "from_android_video";
        mTXugcPublish.publishVideo(param);
    }

    /*
     * Starts a file upload.
     * Returns a promise with the string ID of the upload.
     */
    @ReactMethod
    public void startUpload(ReadableMap options, final Promise promise) {
        customUploadId = "vod_upload_" + System.currentTimeMillis();

        //1. 先拿到上传签名
        mPublishSiglistener = new PublishSigListener() {
            @Override
            public void onSuccess(String signatureStr) {
                signature = signatureStr;
                //2. 开始上传
                uploadToVod();
            }

            @Override
            public void onFail(final int errCode) {
                Log.d(TAG, "get signature failed");
            }
        };
        VideoDataMgr.getInstance().setPublishSigListener(mPublishSiglistener);

        mReportVideoInfoListener = new ReportVideoInfoListener() {
            @Override
            public void onFail(int errCode) {
                Log.e(TAG, "reportVideoInfo, report video info fail");
            }

            @Override
            public void onSuccess() {
                //TODO:: post to our app backend get video info ...
                Log.i(TAG, "reportVideoInfo, report video info success");
            }
        };
        VideoDataMgr.getInstance().setReportVideoInfoListener(mReportVideoInfoListener);

        VideoDataMgr.getInstance().getPublishSig();
        promise.resolve(customUploadId);
    }

    /*
     * Cancels file upload
     * Accepts upload ID as a first argument, this upload will be cancelled
     * Event "cancelled" will be fired when upload is cancelled.
     */
    @ReactMethod
    public void cancelUpload(String cancelUploadId, final Promise promise) {
        if (!(cancelUploadId instanceof String)) {
            promise.reject(new IllegalArgumentException("Upload ID must be a string"));
            return;
        }
        try {

            if(customUploadId == cancelUploadId) {
                isCancelPublish = true;
            }
            promise.resolve(true);
        } catch (Exception exc) {
            Log.e(TAG, exc.getMessage(), exc);
            promise.reject(exc);
        }
    }


    public static void saveBitmap(Bitmap bitmap, String filePath) {
        File f = new File(filePath);
        if (f.exists()) {
            f.delete();
        }
        try {
            FileOutputStream out = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, out);
            out.flush();
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}