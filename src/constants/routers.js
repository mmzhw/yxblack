import * as urls from './urls';
import asyncComponent from '../PublicTools/AsyncComponent';
const VideoList = asyncComponent(() => import('../models/Videos/list'));
const MarqDetail = asyncComponent(() => import('../models/TV/marqDetail'));
const TvList = asyncComponent(() => import('../components/TvList'));
const WebSubject = asyncComponent(() => import('../models/WebSubject'));
const WebpageTheme = asyncComponent(() => import('../models/WebpageTheme')); // 网页专题管理
const ThemeDetail = asyncComponent(() => import('../models/WebpageTheme/ThemeDetail')); // 专题详情
const ThemeCards = asyncComponent(() => import('../models/WebpageTheme/Cards')); // 专题卡片
const ChannelAppDetail = asyncComponent(() => import('../models/ChannelAppDetail'));
const Label = asyncComponent(() => import('../models/Label'));
const ChannelOTT = asyncComponent(() => import('../models/ChannelOTT'));
const VideoSubDetail = asyncComponent(() => import('../models/Videos/subdetail'));
const ChannelAppForTown = asyncComponent(() => import('../models/ChannelApp/ChannelAppForTown'));
const AddCrawler = asyncComponent(() => import('../models/Videos/addcrawler'));
const Upload = asyncComponent(() => import('../components/Upload'));
const Detail = asyncComponent(() => import('../models/Videos/crawler/common/Detail/Detail'));
const AddLive = asyncComponent(() => import('../models/Live/addLive'));
const LiveList = asyncComponent(() => import('../models/Live/liveList'));
const LiveOTT = asyncComponent(() => import('../models/LiveOTT'));
const ChannelAppForPc = asyncComponent(() => import('../models/ChannelApp/ChannelAppForPc'));
const ChannelOTTDetail = asyncComponent(() => import('../models/ChannelOTTDetail'));
const Interrupt = asyncComponent(() => import('../models/TV/interrupt'));
const VideoDetail = asyncComponent(() => import('../models/Videos/detail'));
const Recommend = asyncComponent(() => import('../models/Label/recommend'));
const VideoManage = asyncComponent(() => import('../models/VideoManage'));
const Advert = asyncComponent(() => import('../models/Advert'));
const UserInfo = asyncComponent(() => import('../models/User/UserInfo'));
const QueueSet = asyncComponent(() => import('../models/TV/queueSet'));
const SubjectConfig = asyncComponent(() => import('../models/WebSubject/SubjectConfig'));
const AdvertAppDetail = asyncComponent(() => import('../models/Advert/advertAppDetail'));
const VideoAdd = asyncComponent(() => import('../models/Videos/add'));
const UpdateRemind = asyncComponent(() => import('../models/UpdateRemind'));
const Marq = asyncComponent(() => import('../models/TV/Marq'));
const LiveDetail = asyncComponent(() => import('../models/Live/liveDetail'));
const ChannelApp = asyncComponent(() => import('../models/ChannelApp'));
const ChannelTown = asyncComponent(() => import('../models/ChannelTown'));
const UserInfoManage = asyncComponent(() => import('../models/UserInfoManage'));
const UserSingleInfo = asyncComponent(() => import('../models/UserInfoManage/UserSingleInfo'));
const UserVideoManage = asyncComponent(() => import('../models/UserVideoManage'));
const UserVideoDetail = asyncComponent(() => import('../models/UserVideoManage/UserVideoDetail'));
const UserLog = asyncComponent(() => import('../models/User/UserLog'));
const TeplsConfig = asyncComponent(() => import('../models/WebSubject/TeplsConfig'));
const AdvertDetail = asyncComponent(() => import('../models/Advert/advertDetail'));
const ChannelAppDetailForPc = asyncComponent(() => import('../models/ChannelAppDetail/ChannelAppDetail'));
const TVPlay = asyncComponent(() => import('../models/TV/play'));

const VideoManageSimple = asyncComponent(() => import('../models/simple/VideoManage'));
const LabelSimple = asyncComponent(() => import('../models/simple/Label'));
const ChannelOTTDetailSimple = asyncComponent(() => import('../models/simple/ChannelOTTDetail'));
const LiveOTTSimple = asyncComponent(() => import('../models/simple/LiveOTT'));
const VideoAddSimple = asyncComponent(() => import('../models/simple/Videos/add'));
const VideoDetailSimple = asyncComponent(() => import('../models/simple/Videos/detail'));
const RecommendSimple = asyncComponent(() => import('../models/simple/Label/recommend'));
const VideoListSimple = asyncComponent(() => import('../models/simple/Videos/list'));
export const ROUTERS = [
    {
        path: urls.USER_INFO_MANAGE,
        exact: true,
        component: UserInfoManage,
        componentName: './models/UserInfoManage',
        breadcrumbName: '用户信息管理',
    },
    {
        path: urls.HOME,
        exact: true,
        component: UserInfoManage,
        componentName: './models/UserInfoManage',
        breadcrumbName: '用户信息管理'
    },
    {
        path: urls.SIMPLE,
        exact: true,
        component: VideoManageSimple,
        componentName: './models/simple/VideoManage',
        breadcrumbName: '视频管理'
    },
    {
        path: urls.USER_VIDEO_MANAGE,
        exact: true,
        component: UserVideoManage,
        componentName: './models/UserVideoManage',
        breadcrumbName: '短视频管理'
    },
    {
        path: `${urls.USER_SINGLE_INFO}/:id`,
        exact: true,
        component: UserSingleInfo,
        breadcrumbName: '用户详情',
        componentName: './models/UserSingleInfo',
        parentPath: urls.USER_INFO_MANAGE
    },
    {
        path: `${urls.USER_VIDEO_MANAGE}/UserVideoDetail/:id`,
        exact: true,
        component: UserVideoDetail,
        componentName: './models/UserVideoManage/UserVideoDetail',
        parentPath: urls.USER_VIDEO_MANAGE
    },
    {
        path: `${urls.USER_SINGLE_INFO}/:parentUserId/:id`,
        exact: true,
        component: UserVideoDetail,
        componentName: './models/UserSingleInfo/UserVideoDetail',
        parentPath: `${urls.USER_SINGLE_INFO}/:id`
    },
    {
        path: urls.VIDEO_ADD,
        component: VideoAdd,
        componentName: './models/Videos/add',
        // parentPath: urls.HOME
    },
    {
        path: urls.VIDEO_MANAGE,
        component: VideoManage,
        componentName: './models/VideoManage',
        breadcrumbName: `视频管理`,
        activeMenu: () => `video-manage`
    },
    {
        path: urls.VIDEO_LIST,
        component: VideoList,
        componentName: './models/Videos/list',
        exact: true,
        breadcrumbName: `视频列表`,
        activeMenu: () => `video-list`,
    },
    {
        path: `${urls.CRAWLER}/crawlerDetail/:id`,
        exact: true,
        component: Detail,
        componentName: './models/Videos/crawler/common/Detail/Detail',
        parentPath: urls.CRAWLER
    },
    {
        path: `${urls.CRAWLER}/crawlerDetail/:id/addCrawler`,
        component: AddCrawler,
        componentName: './models/Videos/addcrawler',
        breadcrumbName: `新增`,
        parentPath: urls.CRAWLER
    },
    {
        path: `${urls.VIDEO_LIST}/VideoDetail/:id`,
        exact: true,
        component: VideoDetail,
        parentPath: urls.VIDEO_MANAGE
    },
    {
        path: `${urls.VIDEO_LIST}/VideoDetail/:id/addCrawler`,
        component: AddCrawler,
        componentName: './models/Videos/addcrawler',
        breadcrumbName: `新增`,
        parentPath: `${urls.VIDEO_LIST}/VideoDetail/:id`
    },
    {
        path: `${urls.VIDEO_LIST}/VideoDetail/:parentVideoId/videoSubDetail`,
        component: VideoSubDetail,
        componentName: './models/Videos/subdetail',
        breadcrumbName: `新增选集`,
        parentPath: `${urls.VIDEO_LIST}/VideoDetail/:id`
    },
    {
        path: urls.ADDLIVE,
        component: AddLive,
        breadcrumbName: `新增活动`,
        componentName: './models/Live/addLive',
    },
    {
        path: `${urls.LIVE_LIST}/liveDetail/:id`,
        component: LiveDetail,
        componentName: './models/Live/liveDetail',
        parentPath: urls.LIVE_LIST
    },
    {
        path: urls.LABEL,
        component: Label,
        componentName: './models/Label',
        exact: true,
        activeMenu: () => `label-list`,
        breadcrumbName: `标签`,
    },
    {
        path: `${urls.LABEL}/recommend/:id`,
        component: Recommend,
        componentName: './models/Label/recommend',
        parentPath: urls.LABEL
    },
    {
        path: urls.TV_LIST,
        component: TvList,
        componentName: './components/TvList',
    },
    // { path: `${BASEPATH}/livedetail`,
    //   component: App,
    // },
    { path: urls.LIVE_LIST,
        component: LiveList,
        componentName: './models/Live/liveList',
        activeMenu: () => `live-list`,
        breadcrumbName: `直播列表`,
    },
    {
        path: `${urls.HOME}/UpdateRemind/:id`,
        component: UpdateRemind,
        componentName: './models/UpdateRemind',
        activeMenu: (match) => `remind-${match.params.id}`,
    },
    { path: urls.CHANNELAPP,
        component: ChannelApp,
        componentName: './models/ChannelApp',
        activeMenu: () => `channel-list`,
        exact: true,
        breadcrumbName: `APP频道配置`,
        // parentPath: urls.HOME
    },
    { path: `${urls.HOME}/channel-town/:id`,
        component: ChannelTown,
        // activeMenu: () => `channel-list`,
        exact: true,
        parentPath: `${urls.HOME}/channel-town`
    },
    {
        path: urls.UPLOAD,
        activeMenu: () => 'channel-list',
        exact: true,
    },
    {
        path: `${urls.CHANNELAPP}/ChannelAppDetail/:id`,
        component: ChannelAppDetail,
        componentName: './models/ChannelAppDetail',
        exact: true,
        parentPath: urls.CHANNELAPP
    },
    {
        path: `${urls.HOME}/channel-detail/:id`,
        component: ChannelAppDetailForPc,
        componentName: './models/ChannelAppDetail/ChannelAppDetail',
        exact: true,
        parentPath: `${urls.HOME}/channel-app-pc`
    },
    {
        path: `${urls.HOME}/channel-app-pc`,
        component: ChannelAppForPc,
        componentName: './models/ChannelApp/ChannelAppForPc',
        exact: true,
        breadcrumbName: `PC频道配置`,
        activeMenu: () => 'channel-app-pc'
    },
    {
        path: `${urls.OTT_CHANNEL}`,
        component: ChannelOTT,
        componentName: './models/ChannelOTT',
        exact: true,
        breadcrumbName: `OTT频道配置`,
        activeMenu: () => 'channel-app-ott'
    },
    {
        path: `${urls.OTT_DETAIL}/:id`,
        component: ChannelOTTDetail,
        componentName: './models/ChannelOTTDetail',
        exact: true,
        parentPath: `${urls.OTT_CHANNEL}`
    },
    {
        path: `${urls.OTT_LIVE}`,
        component: LiveOTT,
        componentName: './models/LiveOTT',
        exact: true,
        breadcrumbName: `OTT单项配置`,
        activeMenu: () => 'OTTLive'
    },
    {
        path: `${urls.HOME}/channel-town`,
        component: ChannelAppForTown,
        componentName: './models/ChannelApp/ChannelAppForTown',
        exact: true,
        breadcrumbName: `APP新城镇频道配置`,
        activeMenu: () => 'channel-town'
    },
    {
        path: '/upload',
        component: Upload,
        componentName: './components/Upload',
        breadcrumbName: `上传`
    },
    {
        path: `${urls.TV_ADMIN}`,
        component: TVPlay,
        componentName: './components/Upload',
        exact: true,
        activeMenu: () => 'tv-admin',
        // parentPath: urls.HOME,
        breadcrumbName: `播放管理`
    },
    {
        path: `${urls.TV_ADMIN}/queueSet/:id`,
        component: QueueSet,
        componentName: './models/TV/queueSet',
        parentPath: urls.TV_ADMIN
    },
    {
        path: `${urls.TV_ADMIN}/queueSet`,
        component: QueueSet,
        componentName: './models/TV/queueSet',
        parentPath: urls.TV_ADMIN,
        exact: true,
        breadcrumbName: `新增队列`,
    },
    {
        path: `${urls.TV_ADMIN}/interrupt`,
        component: Interrupt,
        componentName: './models/TV/interrupt',
        parentPath: urls.TV_ADMIN,
        exact: true,
        breadcrumbName: `新增插播`,
    },
    {
        path: `${urls.TV_ADMIN}/interrupt/:id`,
        component: Interrupt,
        componentName: './models/TV/interrupt',
        parentPath: urls.TV_ADMIN
    },
    {
        path: `${urls.WEBSUBJECT}`,
        component: WebSubject,
        componentName: './models/WebSubject',
        exact: true,
        breadcrumbName: '网页专题管理'
    },
    {
        path: `${urls.WEBPAGE_THEME}`,
        component: WebpageTheme,
        componentName: './models/WebpageTheme',
        exact: true,
        breadcrumbName: '网页专题管理'
    },
    {
        path: `${urls.WEBPAGE_THEME}/:id`,
        component: ThemeDetail,
        componentName: './models/WebpageTheme/ThemeDetail',
        exact: true,
        breadcrumbName: '专题编辑',
        parentPath: `${urls.WEBPAGE_THEME}`,
    },
    {
        path: `${urls.WEBPAGE_THEME}/:id/Cards`,
        component: ThemeCards,
        componentName: './models/WebpageTheme/Cards',
        exact: true,
        breadcrumbName: '卡片管理',
        parentPath: `${urls.WEBPAGE_THEME}/:id`,
    },
    {
        path: `${urls.WEBSUBJECT}/add`,
        component: SubjectConfig,
        componentName: './models/WebSubject/SubjectConfig',
        exact: true,
        parentPath: urls.WEBSUBJECT,
        breadcrumbName: `新增`,
    },
    {
        path: `${urls.WEBSUBJECT}/:id`,
        component: SubjectConfig,
        componentName: './models/WebSubject/SubjectConfig',
        exact: true,
        parentPath: urls.WEBSUBJECT,
    },
    {
        path: `${urls.WEBSUBJECT}/:id/tepls-config`,
        component: TeplsConfig,
        componentName: './models/WebSubject/TeplsConfig',
        exact: true,
        parentPath: urls.WEBSUBJECT,
    },
    {
        path: `${urls.MARQ_ADMIN}`,
        component: Marq,
        componentName: './models/TV/Marq',
        exact: true,
        breadcrumbName: `轮播跑马灯管理`
    },
    {
        path: `${urls.MARQ_ADMIN}/add`,
        component: MarqDetail,
        componentName: './models/TV/marqDetail',
        exact: true,
        parentPath: urls.MARQ_ADMIN,
        breadcrumbName: `新增`,
    },
    {
        path: `${urls.MARQ_ADMIN}/del/:id`,
        component: MarqDetail,
        componentName: './models/TV/marqDetail',
        parentPath: urls.MARQ_ADMIN,
    },
    {
        path: `${urls.ADVERT_ADMIN}`,
        component: Advert,
        componentName: './models/Advert',
        exact: true,
        activeMenu: () => 'advert',
        breadcrumbName: `PC广告管理`,
    },
    {
        path: `${urls.ADVERT_ADMIN}/app`,
        component: Advert,
        componentName: './models/Advert',
        exact: true,
        activeMenu: () => 'advert',
        breadcrumbName: `APP广告管理`,
        // parentPath: urls.HOME
    },
    {
        path: `${urls.ADVERT_ADMIN}/pc/:id`,
        component: AdvertDetail,
        componentName: './models/Advert/advertDetail',
        parentPath: urls.ADVERT_ADMIN
    },
    {
        path: `${urls.ADVERT_ADMIN}/app/:id`,
        component: AdvertAppDetail,
        componentName: './models/Advert/advertAppDetail',
        parentPath: `${urls.ADVERT_ADMIN}/app`
    },
    {
        path: urls.USER_INFO,
        exact: true,
        component: UserInfo,
        componentName: './models/User/UserInfo',
        breadcrumbName: `个人信息`,
    },
    {
        path: urls.USER_LOG,
        exact: true,
        component: UserLog,
        componentName: './models/User/UserLog',
        breadcrumbName: `操作日志`,
    },
    // simple
    {
        path: urls.VIDEO_MANAGE_SIMPLE,
        component: VideoManageSimple,
        componentName: './models/simple/VideoManage',
        breadcrumbName: `视频管理`,
        activeMenu: () => `video-manage`
    },
    {
        path: urls.LABEL_SIMPLE,
        component: LabelSimple,
        componentName: './models/simple/Label',
        exact: true,
        activeMenu: () => `label-list`,
        breadcrumbName: `标签`,
    },
    {
        path: `${urls.CHANNEL_OTT_DETAIL_SIMPLE}/:id`,
        component: ChannelOTTDetailSimple,
        componentName: './models/ChannelOTTDetail',
        exact: true,
        breadcrumbName: `电影频道配置`,
    },
    {
        path: `${urls.OTT_LIVE_SIMPLE}`,
        component: LiveOTTSimple,
        componentName: './models/simple/LiveOTT',
        exact: true,
        breadcrumbName: `OTT单项配置`,
    },
    {
        path: urls.VIDEO_ADD_SIMPLE,
        component: VideoAddSimple,
        componentName: './models/simple/Videos/add',
        // parentPath: urls.HOME
    },
    {
        path: `${urls.VIDEO_LIST_SIMPLE}/VideoDetail/:id`,
        exact: true,
        component: VideoDetailSimple,
        parentPath: urls.VIDEO_MANAGE_SIMPLE
    },
    {
        path: `${urls.LABEL_SIMPLE}/recommend/:id`,
        component: RecommendSimple,
        componentName: './models/simple/Label/recommend',
        parentPath: urls.LABEL_SIMPLE
    },
    {
        path: urls.VIDEO_LIST_SIMPLE,
        component: VideoListSimple,
        componentName: './models/simple/Videos/list',
        exact: true,
        breadcrumbName: `视频列表`,
    },
];
