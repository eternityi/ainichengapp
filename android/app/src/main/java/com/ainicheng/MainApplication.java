package com.ainicheng;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
//import com.tencent.bugly.crashreport.CrashReport;
//import com.tencent.rtmp.TXLiveBase;
//import com.tencent.ugc.TXUGCBase;
//import com.vydia.RNUploader.UploaderReactPackage;
import com.ainicheng.rnpackages.voduploader.UploaderReactPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            BugsnagReactNative.getPackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new ImagePickerPackage(),
            new ReactVideoPackage(),
            new WebViewBridgePackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new PickerPackage(),
            new UploaderReactPackage(),
            new CodePush(getApplicationContext().getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }


  //替换成自己购买的
  private String ugcKey = "dd82fb6b890bba02ed86a9387b7d0a6a";
  private String ugcLicenceUrl = "http://license.vod2.myqcloud.com/license/v1/0bbe5588e35a8d37586c23910faf074f/TXUgcSDK.licence";

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    // 短视频licence设置
//    TXUGCBase.getInstance().setLicence(this, ugcLicenceUrl, ugcKey);

//    String sdkver = TXLiveBase.getSDKVersionStr();
//    Log.d("liteavsdk", "liteav sdk version is : " + sdkver);
  }
}
