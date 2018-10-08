const menuRouterMap = {
    '/app/userInfoManage': 'user-info-manage',
    '/app/videoManage': 'video-manage',
    '/app/videoList/VideoDetail': 'video-manage',
    '/app/userVideoManage': 'user-video-manage',
    '/app/label': 'label-list',
    '/app/channelApp': 'channel-list',
    '/app/channel-town': 'channel-town',
    '/app/channel-app-pc': 'channel-app-pc',
    '/app/OTTLive?1': 'OTTLive',
    '/app/OTTLive?2': 'OTTNew',
    '/app/OTTLive?3': 'OTTRecommend',
    '/app/liveList': 'live-list',
    '/app/websubject': 'webpage-subject',
    '/app/tvAdmin': 'tv-admin',
    '/app/marqAdmin': 'tv-marq',
    '/app/advertAdmin': 'advert',
    '/app/UpdateRemind/A': 'remind-A',
    '/app/UpdateRemind/I': 'remind-I',
    '/simple/videoManage': 'video-manage-simple',
    '/simple/label': 'label-list-simple',
    '/simple/channelOTTDetail': 'label-channel-ott-detail-simple',
};

const getMenuMap = (path) => {
    const keys = Object.keys(menuRouterMap).filter((value) => path.startsWith(value));
    let mapKey = '/app/userInfoManage';
    if (keys.length > 0) {
        mapKey = keys[0];
    }
    return menuRouterMap[mapKey];
};

export default getMenuMap;
