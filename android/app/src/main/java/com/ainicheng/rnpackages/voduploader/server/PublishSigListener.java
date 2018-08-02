package com.ainicheng.rnpackages.voduploader.server;

/**
 * Created by ivan on 2018/8/2.
 */

public interface PublishSigListener {
    void onSuccess(String signatureStr);

    void onFail(int errCode);
}
