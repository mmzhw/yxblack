const getQuery = function(name) {
    let reg, ret, query;
    let search = window.location.search.substr(1);
    if (name) {
        reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        query = search.match(reg);
        return query !== null ? decodeURIComponent(query[2]) : null;
    }
    reg = new RegExp(/(^|&)(\w+)=([\w]*)/, 'g');
    query = search.match(reg);
    ret = {};
    query.forEach(v => {
        let arr = v.split('=');
        if (arr[0].indexOf('&') > -1) arr[0] = arr[0].slice(1);
        ret[arr[0]] = decodeURIComponent(arr[1]);
    });
    return ret;
};

export default getQuery;
