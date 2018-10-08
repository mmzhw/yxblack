// let baseUrl = 'http://test.dxapi.youxiangtv.com'; // 开发服务器  test01,admin,zhw
let baseUrl = 'https://dxapi.youxiangtv.com';

if (process.env.REACT_APP_URLCENTER === 'production') {
    /* 正式环境 */
    baseUrl = 'https://dxapi.youxiangtv.com'; // 线上正式服务器接口
    // baseUrl = 'http://daxiangapi.youxiangtv.com'; // 线上正式服务器临时接口
    // baseUrl = 'http://dxapi.youxiangtv.com'; // 线上正式服务器
}

if (process.env.REACT_APP_URLCENTER === 'test') {
    /* 测试环境 */
    baseUrl = 'http://realtest.youxiangtv.com';
}

if (process.env.REACT_APP_URLCENTER === 'dev') {
    /* 开发环境 */
    baseUrl = 'http://test.dxapi.youxiangtv.com';
}

let baseTvUrl = 'http://dxapiforboss.youxiangtv.com';
let imgPrefix = 'https://image.youxiangtv.com/';
let videoPrefix = 'https://video.youxiangtv.com/';

const handleVideoUrl = (url) => {
    if (!url) return '';
    if (url.includes('http') || url.includes('https')) {
        return url;
    }
    if (url[0] === '/') {
        return videoPrefix + url.replace('/', '');
    } else {
        return videoPrefix + url;
    }
};

export { baseUrl, baseTvUrl, imgPrefix, videoPrefix, handleVideoUrl };
