const getBaseUrl = (type) => {
    let appBaseUrl = `http://${type}.test.youxiangtv.com/activity`;
    if (process.env.NODE_ENV === 'production') {
        appBaseUrl = `https://${type}.youxiangtv.com/activity`;
    }
    return appBaseUrl;
};

const getYearBaseUrl = (type) => {
    let appBaseUrl = `http://${type}.test.youxiangtv.com/yearSubject`;
    if (process.env.NODE_ENV === 'production') {
        appBaseUrl = `https://${type}.youxiangtv.com/yearSubject`;
    }
    return appBaseUrl;
};

export { getBaseUrl, getYearBaseUrl };
