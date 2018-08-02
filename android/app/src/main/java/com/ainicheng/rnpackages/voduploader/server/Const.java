package com.ainicheng.rnpackages.voduploader.server;

/**
 * Created by ivan on 2018/8/2.
 */

public class Const {
    public static final String SERVER_IP = "https://ainicheng.com";
    public static final String ADDRESS_SIG = SERVER_IP + "/sdk/qcvod.php";
    public static final String ADDRESS_VIDEO_LIST = SERVER_IP + "/api/vod/videos";
    public static final String ADDRESS_VIDEO_INFO = SERVER_IP + "/api/vod/videos/#";
    public static final String ADDRESS_VIDEO_REPORT = SERVER_IP + "/api/video/report";
    //TODO:: /api/video/report?videoId=&videoUrl= , return video object json
    // /api/v1/resource/videos/#file_id

    static class RetCode {
        // 服务器返回码
        public static final int CODE_SUCCESS = 0;               // 接口请求成功
        public static final int CODE_PARAMS_ERR = 1001;         // 请求参数错误
        public static final int CODE_AUTH_ERR = 1002;           // 鉴权错误
        public static final int CODE_RES_ERR = 1003;            // 资源不存在
        public static final int CODE_REQ_TOO_FAST_ERR = 1004;   // 请求频率过快
        public static final int CODE_SERVER_ERR = 1000;         // 服务器错误
        // 客户端处理码
        public static final int CODE_REQUEST_ERR = 1;          // 请求错误
        public static final int CODE_PARSE_ERR = 2;            // 解析json错误

    }
}
