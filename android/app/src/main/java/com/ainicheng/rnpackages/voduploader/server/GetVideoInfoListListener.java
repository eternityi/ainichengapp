package com.ainicheng.rnpackages.voduploader.server;

import java.util.List;

/**
 * Created by ivan on 2018/8/2.
 */

public interface GetVideoInfoListListener {
    void onGetVideoInfoList(List<VideoInfo> videoInfoList);

    void onFail(int errCode);
}
