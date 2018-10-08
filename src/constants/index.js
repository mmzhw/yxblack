// 一些需要特殊处理的名称
export const SPECIAL_NAME = {
    immutableChannelName: '精选',
};

// 操作相关的名称, 还有很多散在各个文件，需要逐步统一
export const OPERATION_NAME = {
    PUBLISH: '发布更新',
    CHANNELS_OPTION: '频道配置',
    EDIT: '编辑',
    DELETE: '删除',
    OPTION: '设置',
};

// 代表app频道设置中每一种模板数目
export const SUBJECT_MAP = {
    1: 1,
    2: 4,
    3: 6,
    4: 7,
    5: 5,
    6: 6,
    7: 7,
    8: 7,
    9: 19
};

// 代表 网页专题管理 页面布局 模版类型 分类
export const PAGE_LAYOUT = {
    1: '1*1',
    2: '2*6',
    3: '1*6',
    4: '2*3+2*3',
    5: '1行*4个/行',
    6: '3行*2个/行',
    7: '1横+2行*2个/行',
};

//
export const SUBJECT_ARR = {
    layoutList2: [0, 1, 2, 3],
    layoutList3: [0, 1, 2, 3, 4, 5],
    layoutList4: [1, 2, 3, 4, 5, 6],
    layoutList5: [0, 1, 2, 3, 4],
    layoutList9: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // 模版G
    layoutList8: [0, 1, 2, 3, 4, 5, 6], // 模版F
};

// 专题类型
export const SUBJECT_TYPE = ['普通专题', '年度专题'];
