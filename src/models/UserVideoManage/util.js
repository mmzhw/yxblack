import moment from 'moment';
import { handleImgUrl } from '../../../src/utils/util';

moment.locale('zh-cn');

const specialNameHandle = (key, value) => {
    let result = value;
    if (key === 'avatar') {
        result = handleImgUrl(value);
    }
    if (key === 'gmtCreated' || key === 'gmtModified') {
        result = moment(value).format('LLLL');
    }
    if (key === 'status') {
        if (value === -1) {
            result = '已删除';
        } else if (value === 0) {
            result = '无效';
        } else if (value === 1) {
            result = '有效';
        }
    }
    if (key === 'showStatus') {
        if (value === 0) {
            result = '不显示';
        } else if (value === 1) {
            result = '显示';
        }
    }
    if (key === 'auditStatus') {
        if (value === 0) {
            result = '未审核';
        } else if (value === 1) {
            result = '审核通过';
        } else if (value === 2) {
            result = '审核不通过';
        }
    }
    if (key === 'showType') {
        if (value === 0) {
            result = '普通展示';
        } else if (value === 1) {
            result = '首页展示';
        } else if (value === 2) {
            result = '置顶展示';
        }
    }
    return result;
};

export {
    specialNameHandle
};
