package com.ainicheng;

import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.ReactActivity;
//import com.tencent.rtmp.TXLiveBase;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ainicheng";
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);

//        String sdkver = TXLiveBase.getSDKVersionStr();
//        Log.d("liteavsdk", "liteav sdk version is : " + sdkver);
    }
}
