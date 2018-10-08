// import { REQ_URL } from '../../../constants/constants';
export const REQ_URL = {
    LOGIN: '/back/auth/login',
    // OTT开始
    OTT_SEARCH_CHANNEL: '/ott/back/lego/queryLego', // 获取指定频道
    OTT_CHANNEL_DATA: '/ott/back/channel/list', // 获取所有的频道数据
    OTT_ADD_CHANNEL: '/ott/back/channel/add', // 增加频道(一级、二级)
    OTT_MODIFY_CHANNEL: '/ott/back/channel/modify', // 修改频道(一级、二级)
    OTT_DELETE_CHANNEL: '/ott/back/channel/delete', // 删除频道(一级、二级)

    SORT_CHANNEL: '/ott/back/channel/sortChannel', // 排序channels

    OTT_PUBLISH: '/ott/back/lego/publishLego', // 发布更新

    OTT_CARDS_CHANNEL: '/ott/back/lego/updateLego', // 修改，增加，删除
    OTT_SEARCH_CHANNEL_BYID: '/ott/back/channel/searchChannelByChannelId', // 修改，增加，删除

    OTT_OTHER_LIST: '/ott/back/channel/other/list', // 获取ott直播，资讯以及推荐列表的接口
    OTT_OTHER_MODIFY: '/ott/back/channel/other/update', // 修改，增加，删除
    OTT_OTHER_PUBLISH: '/ott/back/channel/other/publish', // 发布更新

    SEARCH_THIRD_VIDEO_LISTS: '/ott/back/channel/searchVideo',
    OTT_FIRST_CATEGORY: '/ott/back/catagory/queryFirst', // 查询OTT时期添加的一级分类
    OTT_SECOND_CATEGORY: '/ott/back/catagory/querySecond', // 查询OTT时期添加的二级分类
    // OTT_SEARCH_VIDEO_LISTS: '/ott/video/videoCardList', // OTT本地视频搜索

    // OTT结束
    SEARCH_VIDEO_LISTS: '/back/videoManager/videoCardList', // 本地视频搜索

    SELECT_QUERY: '/back/search/selectQuery',
    VIDEO_DETAILS: '/back/videoManager/nets/videoDetails',
    UPLOAD_TOKEN: '/back/qiniu/image/uploadToken',

    CHANNEL_DATA: '/back/web/channel/list/v1', // 获取所有的频道数据
    REMOVE_CHANNEL: '/back/web/channel/delete', // 删除频道(一级、二级)
    MODIFY_CHANNEL: '/back/web/channel/modifyChannel/v1',
    ADD_CHANNEL: '/back/web/channel/add/v1',
    SORT_WEB_CHANNEL: '/back/web/channel/sortChannel',
    REMOVE_MOVE_CHANNEL: '/v2/back/mobile/removeChannel',
    SORT_MOVE_CHANNEL: '/v2/back/mobile/sortChannel',
    ADD_MOVE_CHANNEL: '/v2/back/mobile/addSecondChannel',
    NEW_TOEN_CHANNEL: '/v2/back/mobile/newTownChannel',

    LIST_MOBILE_CHANNEL: '/v2/back/mobile/channel',
    ADD_MOBILE_CHANNEL: '/v2/back/mobile/addChannel',
    MODIFY_MOBILE_CHANNEL: '/v2/back/mobile/modifyChannel',
    REMOVE_MOBILE_CHANNEL: '/v2/back/mobile/removeChannel',
    SORT_MOBILE_CHANNEL: '/v2/back/mobile/sortChannel',
    ADD_IMG: '/back/image/add',
    // 查询缓存groups
    GET_CHANNEL_CACHE: '/v2/back/mobile/getChannelCache',
    // 保存缓存groups
    SET_CHANNEL_CACHE: '/v2/back/mobile/setChannelCache',
    // 专题
    QUERY_LEGO: '/v2/back/mobile/lego/queryLego', // 查询频道专题
    PUBLISH_LEGO: '/v2/back/mobile/lego/publishLego', // 发布专题
    // banner
    BANNER: '/v2/back/mobile/banner', // 查询banner

    CHANNEL_DETAIL: '/back/web/lego/list', // 查询频道所有信息
    UPDATE_DATA: '/back/web/lego/update', // 更新专题信息
    ADD_SUBJECT: '/back/web/lego/add', // 添加专题
    MODIFY_BANNER: '/back/web/modifyBanner', // 修改 banner 图片
    ADD_BANNER: '/back/web/addBanner', // 添加图片

    WEB_LEGO_SORT: '/back/web/lego/sort',
    UPDATE_MOBILE_LEGO: '/v2/back/mobile/lego/updateLego',
    ADD_MOBILE_BANNER: '/v2/back/mobile/addBanner',
    MODIFY_MOBILE_BANNER: '/v2/back/mobile/modifyBanner',
    REMOVE_MOBILE_BANNER: '/v2/back/mobile/removeBanner',

    WEB_BANNER: '/back/web/banner',
    SEARCH_CHANNEL: '/back/web/channel/searchChannelByChannelId',
    REMOVE_BANNER: '/back/web/removeBanner',

    CREATE_LIVEROOM: '/back/liveRoom/create',
    GET_VIDEO_INFO: '/back/videoManager/videoBaseInfo',
    UPDATE_LIVEROOM: '/back/liveRoom/update',
    VIEW_LIVEROOM: '/back/liveRoom/view',
    ENABLE_LIVEROOM: '/back/liveRoom/enablePlayBack',
    DIPLAY_LIVEROOM: '/back/liveRoom/disablePlayBack',
    UPDATE_STATUS_TO_END: '/back/liveRoom/updateStatusToEnd',
    UPDATE_STATUS_TO_LIVING: '/back/liveRoom/updateStatusToLiving',
    UPDATE_STATUS: '/back/liveRoom/updateStatus',
    ONSHELF_LIVEROOM: '/back/liveRoom/onShelf',
    OFFSHELF_LIVEROOM: '/back/liveRoom/offShelf',
    LIST_LIVEROOM: '/back/liveRoom/list',
    TV_VIDEO: '/tv/back/ott/cutVideo/getById/v1',
    EDIT_TV_VIDEO: '/tv/back/ott/cutVideo/edit/v1',
    ADD_TV_VIDEO: '/tv/back/ott/cutVideo/add/v1',
    SET_RUN_BANNER: '/back/runBanner/setting',
    IS_SHOW_INFO_RUN_BANNER: '/back/runBanner/isShowInfo',
    SET_INFO_RUN_BANNER: '/back/runBanner/settingInfo',
    CANCEL_SET_RUN_BANNER: '/back/runBanner/cancelSetting',
    DEL_RUN_BANNER: '/back/runBanner/del',
    IS_SHOW_RUN_BANNER: '/back/runBanner/isShow',
    LISTS_RUN_BANNER: '/back/runBanner/lists',
    DETAIL_RUN_BANNER: '/back/runBanner/detail',
    INSERT_RUN_BANNER: '/back/runBanner/insertUpadte',

    TV_OTT_DETAIL: '/tv/back/ott/play/detail/v1',
    TV_OTT_SET: '/tv/back/ott/queue/interval/set/v1',
    TV_OTT_DELETE: '/tv/back/ott/queue/delete/v1',
    TV_OTT_ONLINE: '/tv/back/ott/queue/online/v1',
    TV_OTT_CANCEL: '/tv/back/ott/queue/schedule/cancel/v1',
    TV_OTT_LIST: '/tv/back/ott/queue/list/v1',
    TV_OTT_QUEUE_DETAIL: '/tv/back/ott/queue/detail/v1',
    TV_OTT_QUEUE_DELETE: '/tv/back/ott/cutVideo/delete/v1',
    TV_OTT_QUEUE_ONLINE: '/tv/back/ott/cutVideo/online/v1',
    TV_OTT_QUEUE_OFFLINE: '/tv/back/ott/cutVideo/offline/v1',
    TV_OTT_QUEUE_CANCEL: '/tv/back/ott/cutVideo/schedule/cancel/v1',
    TV_OTT_QUEUE_SET: '/tv/back/ott/cutVideo/setPreVideo/v1',
    TV_OTT_QUEUE_LIST: '/tv/back/ott/cutVideo/list/v1',
    TV_OTT_QUEUE_UPDATE: '/tv/back/ott/queue/update/v1',
    TV_OTT_QUEUE_CREATE: '/tv/back/ott/queue/create/v1',

    MOBILE_UPDATE: '/back/mobile/updateConfig',
    MOBILE_CONFIG: '/back/mobile/config',
    USER_FIND: '/back/user/find',
    USER_UPDATE: '/back/user/update',
    LOG_DETAIL_LIST: '/back/logDetail/list',
    GET_UN_AUDIT_VIDEOS: '/back/video/getUnAuditVideos',
    VIDEO_RECOMMOND: '/back/video/recommond',
    VIDEO_CHECK: '/back/video/checkVideo',
    VIDEO_GET_SHORT_DETAIL: '/back/video/getVideoShortDetail',
    USER_INFO_LIST: '/back/userManager/userInfo/List/get',
    USER_INFO_EXPORT: '/back/userManager/export',
    USER_VIDEOS: '/back/video/getAllVideosByUid',
    UPDATE_USER_STATUS: '/back/userManager/status/update',
    USER_POINTS_LIST: 'back/userManager/points/list',
    USER_EXPER_LIST: '/back/userManager/experience/list',
    USER_INFO: '/back/userManager/userInfo/get',
    POINTS_CONFIG: '/back/points/config/get',

    VIDEO_SHORT_ADD: '/back/videoManager/short/add/v1',
    VIDEO_SHORT_PUT: '/back/videoManager/putVideoOffShelf',
    SEARCH_GROUP_LABELS: '/back/search/searchGroupLabels',
    CLASS_LIST: '/back/property/classification/list',
    TYPE_LIST: '/back/property/type/list',

    GROUP_LIST: '/back/label/group/list/propertyExcluded',
    YEAR_LIST: '/back/property/year/list',
    AREA_LIST: '/back/property/area/list',
    ADD_VIDEO_BASE_INFO: '/back/videoManager/addVideoBaseInfo/v2',
    APPROVE_THIRDPARDY_DETAIL: '/back/thirdParty/approve/thirdPartyVideoDetail',
    VIEW_THIRDPARDY_DETAIL: '/back/thirdParty/view/thirdPartyVideoDetail',
    VIEW_THIRDPARDY_BASE: '/back/thirdParty/view/thirdPartyVideoBase',
    APPROVE_VIEW_THIRDPARDY_BASE: '/back/thirdParty/approve/thirdPartyVideoBase',
    NETS_VIDEO_BASE_INFOS: '/back/videoManager/nets/videoBaseInfo',
    UPDATE_VIDEO_BASE_INFO: '/back/videoManager/updateVideoBaseInfo',
    QUICK_UPDATE_VIDEO_BASE: '/back/videoManager/quickUpdateVideoBase',
    PUT_VIDEO_ON_SHELF: '/back/videoManager/putVideoOnShelf',
    VIDEO_PROCESS: '/back/video/process',
    VIDEO_ADD_DETAIL: '/back/videoManager/addVideoDetail',
    VIDEO_UPDATE_DETAIL: '/back/videoManager/updateVideoDetail',
    NETS_VIDEO_DETIAL_INFO: '/back/videoManager/nets/videoDetailInfo',
    SPECIAL_CHANNEL_UPDATE: '/back/special/channel/update',
    SPECIAL_CHANNEL_DETAIL: '/back/special/channel/detail',
    SPECIAL_CHANNEL_DELETE_BATCH: '/back/special/channel/deleteBatch',
    SPECIAL_CHANNEL_DELETE: '/back/special/channel/delete',
    SPECIAL_CHANNEL_PAGE: '/back/special/channel/page',
    SPECIAL_CHANNEL_ADD: '/back/special/channel/add',

    SPECIAL_LIVE_SORT: '/back/special/live/sort',
    SPECIAL_LIVE_ADD: '/back/special/live/add',
    SPECIAL_LIVE_UPDATE: '/back/special/live/update',
    SPECIAL_CARD_UPDATE: '/back/special/card/update',
    SPECIAL_CHANNEL_LISTS: '/back/special/channel/lists',
    SPECIAL_VIDEO_LISTS: '/back/special/video/lists',
    SPECIAL_VIDEO_DELETE: '/back/special/video/delete',
    SPECIAL_VIDEO_UPDATE: '/back/special/video/update',
    SPECIAL_VIDEO_ADD_SINGLE: '/back/special/video/addSingle',
    SPECIAL_VIDEO_SORT: '/back/special/video/sort',
    SPECIAL_VIDEO_ADD: '/back/special/video/add',

    SPECIAL_AD_ADD: '/back/special/ad/add',
    SPECIAL_AD_UPDATE: '/back/special/ad/update',
    SPECIAL_HEADER_UPDATE: '/back/special/header/update',
    SPECIAL_CARD_SORT: '/back/special/card/sort',
    SPECIAL_CARD_DELETE: '/back/special/card/delete',
    SPECIAL_CARD_ADD: '/back/special/card/add',
    SPECIAL_LIVE_DELETE: '/back/special/live/delete',
    SYNCVIDEO: '/back/videoManager/syncvideo', // 推送OTT数据
    PC_PUBLISH: '/back/web/channel/publish', // pc发布功能
    QINIU: 'http://up.qiniu.com',

};

export const OTT_MODULE = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
    FIFTH: 5,
    SIXTH: 6,
    SEVENTH: 7,
};
