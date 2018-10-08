import { imgPrefix } from './index';
// 拖拽排序的时候用
const sortElm = (newIndex, oldIndex, array) => {
    const newArray = array.slice();
    const oldArray = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, oldArray[0]);
    return newArray;
};

const handleImgUrl = (url, prefix = imgPrefix) => {
    if (!url) return '';
    if (url.includes('http') || url.includes('https')) {
        return url;
    }
    return prefix + url;
};

export {
    sortElm,
    handleImgUrl
};
