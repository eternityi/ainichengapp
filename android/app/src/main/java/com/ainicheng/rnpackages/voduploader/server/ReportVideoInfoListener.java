package com.ainicheng.rnpackages.voduploader.server;

/**
 * Created by ivan on 2018/8/2.
 */

public interface ReportVideoInfoListener {
    void onFail(int errCode);

    void onSuccess();
}
