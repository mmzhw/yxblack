const fixNum = function(num) {
    if (num > 9 || num === 0) {
        return num;
    } else {
        return '0' + num;
    }
};

const transPlayTime = function(time) {
    const hour = Math.floor((time / 3600) % 24);
    const min = fixNum(Math.floor((time / 60) % 60));
    const sec = fixNum(Math.floor(time % 60));

    return hour + '时' + min + '分' + sec + '秒';
};

function twoDigits(number) {
    return number >= 10 ? number : '0' + number;
}
/**
* return
*   ex: 2017-12-12 12:00:00
*/
function getDateTimeByTimeStamp(timestamp) {
    let ts = parseInt(timestamp, 10);
    ts = isNaN(ts) ? 0 : ts;
    let datetime = new Date(ts);
    let year = datetime.getFullYear();
    let month = twoDigits(datetime.getMonth() + 1);
    let date = twoDigits(datetime.getDate());
    let hours = twoDigits(datetime.getHours());
    let minutes = twoDigits(datetime.getMinutes());
    let seconds = twoDigits(datetime.getSeconds());
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

export { transPlayTime, getDateTimeByTimeStamp };
