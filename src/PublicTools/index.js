import { imgPrefix } from '../utils';

// (scale 0 rate= 16:9  ,scale 1 rate= 16:9 ,scale 2 rate=4:3, scale 3 rate=2:3, scale 4 rate 3:2, scale 5 1:1, scale 6 rate 11:4 (廣告)
export const getImgTypeSize = (type) => {
    let width = 160;
    let height = 90;
    let scale = 1;
    switch (type) {
        case 1:
            width = 160;
            height = 90;
            scale = 1;
            break;
        case 3:
            width = 100;
            height = 150;
            scale = 3;
            break;
        case 5: // 圖標
            width = 50;
            height = 50;
            scale = 5;
            break;
        default:
            width = 160;
            height = 90;
            scale = 1;
            break;
    }
    return { width, height, scale };
};

// 获取相应模板的数目(作用於OTT)
export const handleModuleType = (index) => {
    let num = 4;
    switch (Number(index)) {
        case 1:
            num = 4;
            break;
        case 2:
            num = 4;
            break;
        case 3:
            num = 6;
            break;
        case 4:
            num = 9;
            break;
        case 5:
            num = 2;
            break;
        case 6:
            num = 3;
            break;
        case 7: // 横图6导航
            num = 6;
            break;
        default:
            num = 4;
            break;
    }
    return num;
};

// 根據scale（比例）獲取相應的圖片
export const getImgUrl = (imgsArr, targetScale) => {
    let finalImgObj = imgsArr.filter(imgObj => imgObj.scale === targetScale)[0] || {};
    return finalImgObj.url || '';
};

// 获取图片地址，无的情况直接返回默认图片，有的情况需要判断是否返回http的类型
export const handleImgUrl = (imgUrl) => {
    if (!imgUrl) {
        return null;
    } else {
        if (imgUrl.includes(imgPrefix) || imgUrl.includes('http://') || imgUrl.includes('https://')) {
            return imgUrl;
        }
        return imgPrefix + imgUrl;
    }
};
