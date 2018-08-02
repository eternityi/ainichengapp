package com.ainicheng;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.tencent.bugly.crashreport.CrashReport;
import com.tencent.rtmp.TXLiveBase;
import com.tencent.ugc.TXUGCBase;
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


  //TODO:: 测试的，需要替换成自己购买的
  private String ugcKey = "09bb91939d9ef9669f7ff16a850c92e5";
  private String ugcLicenceUrl = "http://download-1252463788.cossh.myqcloud.com/xiaoshipin/licence_xsp/TXUgcSDK.licence";

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    // 短视频licence设置
    TXUGCBase.getInstance().setLicence(this, ugcLicenceUrl, ugcKey);

//    String sdkver = TXLiveBase.getSDKVersionStr();
//    Log.d("liteavsdk", "liteav sdk version is : " + sdkver);
  }
}
