import React, { Component } from 'react';
import { message, Modal, Switch, Row, Col } from 'antd';
import { REQ_URL } from '../../constants/constants';
import YXBookshelf from '../../components/Bookshelf';
import { imgPrefix } from '../../utils';
import yxFetch from '../../utils/fetch';
import Upload from '../../components/Upload';
import * as urls from '../../constants/urls';
import style from './style.module.css';
import { SPECIAL_NAME, SUBJECT_MAP, OPERATION_NAME } from '../../constants';
import { List } from 'immutable';

const confirm = Modal.confirm;
const VERSION = '1.0.0';

class ChannelApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            groupsCopy: [],
            modalType: 1, // 1 为新增，0 为编辑
            inputValue: '',
            isModalShow: false,
            modalTitle: '新增',
            groupIndex: 0,
            labelIndex: 0,
            disabled: false,
            isChecked: true,
            switchLabel: '启用',
            validateTxt: '',
            imageUrl: '',
            onImageUrl: '',
            imageId: null,
            onImageId: null,
            isUploadImage: false,
            isUploadOnImage: false,
            bodys: [{
                name: OPERATION_NAME.OPTION,
                click: this.linkToDetail.bind(this),
                width: '50%',
                marginLeft: '22px',
                color: '',
                iconSize: '18px',
                icon: 'setting',
            }],
            footers: [
                {
                    name: OPERATION_NAME.PUBLISH,
                    click: this.updateChannel.bind(this),
                    width: '25%',
                    color: '#009688'
                },
                {
                    name: OPERATION_NAME.CHANNELS_OPTION,
                    click: this.linkToChannelSetting.bind(this),
                    width: '25%',
                    color: '#F57C00'
                },
                {
                    name: OPERATION_NAME.EDIT,
                    click: this.editChannel.bind(this),
                    width: '25%',
                    color: '#417BFF'
                },
                {
                    name: OPERATION_NAME.DELETE,
                    click: this.removeChannel.bind(this),
                    width: '25%',
                    color: '#FC363E'
                }],
            dehaze: false,
        };
        // drag function
        this.dragGroup = this.dragGroup.bind(this);
        // sort groupsCopy
    }
    componentDidMount () {
        this.getGroupsData();
    }
    // 获取频道列表
    async getGroupsData() {
        let res = await yxFetch(REQ_URL.LIST_MOBILE_CHANNEL, {});
        if (res.code === 0) {
            this.transform(res.data);
        } else {
            message.error(res.errmsg);
        }
    }

    // 获取channels数据，把具体cards循环请求到？好扯
    async transform(bookshelfGroups) {
        let self = this;
        let groups = bookshelfGroups.concat();
        let promiseArr = await bookshelfGroups.map(async (item) => {
            return await yxFetch(REQ_URL.QUERY_LEGO, {
                channelId: item.id,
                version: VERSION
            });
        });

        Promise.all(promiseArr).then((values) => {
            values.forEach((value, index) => {
                // item.imageUrl = imgPrefix + item.imageUrl; //明明不需要加前缀就可以显示，解析是在uplad里显示的时候解析的，这里感觉有问题！
                // item.onImageUrl = imgPrefix + item.onImageUrl;
                // item.labels = [];
                value.data.cards.forEach((label) => {
                    label.name = label.title; // 呵呵，这里貌似是为了显示，为啥不直接用title显示？
                });
                groups[index].labels = value.data.cards;
            });
            self.setState({
                groups,
            }, () => {
                self.getGroupsCache(groups);
            });
        });
    }

    async getGroupsCache(groups) {
        let res = await yxFetch(REQ_URL.GET_CHANNEL_CACHE, {});
        if (res.code === 0) {
            if (res.data && res.data.length > 0) { // 如果缓存中有数据
                let groupsCopy = JSON.parse(res.data);
                if (groups.length === groupsCopy.length) { // 数据库中频道数据长度 === 缓存中频道数据长度
                    groupsCopy = this.resetBannerOnLabelsToCache(groups, groupsCopy); // 线上和缓存频道中bannerOn和labels的数据不同，先重新copy一遍
                    // 遍历banner数据
                    groupsCopy.forEach(async (item, index) => {
                        let res = await yxFetch(REQ_URL.BANNER, {
                            channelId: item.id
                        });
                        if (res.code === 0) {
                            item.bannerLength = res.data.length; // 设置groupsCoupy的bannerLength
                            if (index === groupsCopy.length - 1) {
                                // 获取所有channels 的ip数组进行字符串比较，如果有不一样的说明没发布，需要发布后更新
                                this.setState({
                                    groupsCopy
                                });
                            }
                        }
                    });
                } else { // 数据库中频道数据长度 !== 缓存中频道数据长度
                    let groupsCopy = JSON.parse(JSON.stringify(groups));
                    groupsCopy = this.resetBannerOnLabelsToCache(groups, groupsCopy);
                    this.setGroupsCache(groupsCopy);
                }
            } else if (groups.length > 0 && !res.data) { // 如果缓存中没有数据
                let groupsCopy = JSON.parse(JSON.stringify(groups));
                groupsCopy = this.resetBannerOnLabelsToCache(groups, groupsCopy);
                this.setGroupsCache(groupsCopy);
            }
        } else {
            message.error(res.errmsg);
        }
    }
    // 重设缓存中的bannerOn和labels
    resetBannerOnLabelsToCache(groups, groupsCopy) {
        for (let i = 0; i < groups.length; i++) {
            for (let j = 0; j < groupsCopy.length; j++) {
                if (groups[i].id === groupsCopy[j].id) {
                    groupsCopy[j].bannerOn = groups[i].bannerOn;
                    groupsCopy[j].labels = groups[i].labels;
                    const bannerLabel = {
                        id: '-1',
                        name: 'banner',
                        isEnable: groups[i].bannerOn
                    };
                    groupsCopy[j].labels.splice(0, 0, bannerLabel);
                    groupsCopy[j].labels = this.addGroupLabelId(groupsCopy[j].labels);
                }
            }
        }
        return groupsCopy;
    }
    // 客户端生成id？什么鬼
    addGroupLabelId(labels) {
        labels.forEach((label, index) => {
            label.id = index;
        });
        return labels;
    }
    // 跳转到详情页
    linkToDetail = (groupIndex, labelIndex) => {
        const groupsCopy = this.state.groupsCopy;
        const channelId = groupsCopy[groupIndex].id;
        const channelName = groupsCopy[groupIndex].name;
        this.props.match.history.push(`${urls.CHANNELAPP}/ChannelAppDetail/${channelId}?lego=${labelIndex - 1}&ChannelName=${channelName}`);
    }
    // 删除频道
    removeChannel = (groupIndex, labelIndex) => {
        const that = this;
        const group = that.state.groupsCopy[groupIndex];
        if (group.enable) {
            return message.warn('频道已启用状态，不可删除');
        }
        const hasEnableLabel = group && group.labels.some(label => {
            return label.isEnable;
        });
        if (hasEnableLabel) {
            return message.warn('频道中有已启用状态的专题，不可删除');
        }
        confirm({
            title: '提示',
            content: '删除后用户将不再能看到该视频，且删除后不可恢复，确认删除么？',
            onOk () {
                yxFetch(REQ_URL.REMOVE_MOBILE_CHANNEL, { channelId: that.state.groupsCopy[groupIndex].id }).then(res => {
                    if (res.code === 0) {
                        message.success('频道删除成功！');
                        let groupsCopy = that.state.groupsCopy;
                        groupsCopy.splice(groupIndex, 1);
                        that.setGroupsCache(groupsCopy, 0);
                    }
                });
            },
            onCancel() {},
        });
    }
    // 编辑频道
    editChannel = (groupIndex, labelIndex) => {
        const imageUrlSplits = this.state.groupsCopy[groupIndex].imageUrl ? this.state.groupsCopy[groupIndex].imageUrl.split('/') : [];
        const imageUrlLength = imageUrlSplits.length;
        const imageUrl = imageUrlSplits[imageUrlLength - 1];
        const onImageUrlSplits = this.state.groupsCopy[groupIndex].onImageUrl ? this.state.groupsCopy[groupIndex].onImageUrl.split('/') : [];
        const onImageUrlLength = onImageUrlSplits.length;
        const onImageUrl = onImageUrlSplits[onImageUrlLength - 1];
        this.setState({
            id: this.state.groupsCopy[groupIndex].id,
            groupIndex,
            modalType: 0,
            modalTitle: '编辑',
            disabled: false,
            isChecked: Boolean(this.state.groupsCopy[groupIndex].enable),
            inputValue: this.state.groupsCopy[groupIndex].name,
            isModalShow: true,
            imageId: this.state.groupsCopy[groupIndex].imageId,
            imageUrl, // this.state.groupsCopy[groupIndex].imageUrl.substring(34),
            onImageId: this.state.groupsCopy[groupIndex].onImageId,
            onImageUrl // this.state.groupsCopy[groupIndex].onImageUrl.substring(34),
        }, () => {
            this.getSwitchStatus(this.state.isChecked);
        });
    }
    // 设置switch开关状态
    getSwitchStatus(isChecked) {
        this.setState({
            switchLabel: isChecked ? '启用' : '未启用'
        });
    }
    // 频道配置跳转
    linkToChannelSetting(groupIndex) {
        const groupsCopy = this.state.groupsCopy;
        const channelId = groupsCopy[groupIndex].id;
        const channelName = groupsCopy[groupIndex].name;
        this.props.match.history.push(`${urls.CHANNELAPP}/ChannelAppDetail/${channelId}?ChannelName=${channelName}`); // channelApp/ChannelAppDetail/0
    }
    // 发布更新弹框
    updateChannel(groupIndex) {
        const self = this;
        // 所有的频道信息
        const groupsCopy = this.state.groupsCopy;
        const groupCopy = groupsCopy[groupIndex];
        // 该频道下的所有专题
        const labels = groupCopy.labels;
        const bannerOn = groupCopy.bannerOn;
        const bannerLength = groupCopy.bannerLength;
        // 获取可发布与不可发布的专题视频状态（专题数量 专题开启数量 专题关闭数量 专题开启视频全部设置数量 专题开启视频全部未设置数量 专题开启视频未全部设置数量）
        const cannotUpdateLabelCount = this.getLabelUpdateStatus(labels);
        const labelsLength = cannotUpdateLabelCount.labelsLength;
        const labelsOpenLength = cannotUpdateLabelCount.labelsOpenLength;
        const labelsColseLength = cannotUpdateLabelCount.labelsColseLength;
        const labelOpenVideosAllSet = cannotUpdateLabelCount.labelOpenVideosAllSet;
        const labelOpenVideosAllNotSet = cannotUpdateLabelCount.labelOpenVideosAllNotSet;
        const labelOpenVideosNotAllSet = cannotUpdateLabelCount.labelOpenVideosNotAllSet;
        console.log('专题数量: %d, 专题开启数量: %d, 专题关闭数量: %d, 专题开启且视频全部设置数量: %d, 专题开启且视频全部未设置数量: %d, 专题开启且视频未全部设置数量: %d',
            labelsLength, labelsOpenLength, labelsColseLength, labelOpenVideosAllSet, labelOpenVideosAllNotSet, labelOpenVideosNotAllSet);
        if (labels.length === 1) { // 只有banner
            if (bannerOn === 0) { // banner未启用
                message.warning('banner未启用且没有专题，不能发布更新！');
            } else { // banner已启用
                if (bannerLength > 0) { // banner视频数量 > 0
                    confirm({
                        title: '提示',
                        content: '发布更新后用户可以看到更新后的数据，以及排序，确认更新么？',
                        onOk () {
                            self.updateSortSubmit(); // 更新channels的排序到前台
                            self.updateChannelSubmit(groupIndex);
                        },
                        onCancel() {},
                    });
                } else { // banner视频数量 === 0
                    message.warning('banner未配置，不能发布更新！');
                }
            }
        } else { // 有banner 且至少有一个专题
            if (bannerOn === 0) { // banner未启用
                if (labelsColseLength === labelsLength) { // 专题未启用数量 === 专题数量
                    message.warning('banner未启用且专题未启用，不能发布更新！');
                } else { // 专题有启用 有未启用
                    if (labelOpenVideosAllNotSet > 0 || labelOpenVideosNotAllSet > 0) { // 如果视频设置不完整
                        message.warning('专题配置不完整，不能发布更新！');
                    } else { // 已启用的专题视频都已经设置完整
                        confirm({
                            title: '提示',
                            content: '发布更新后用户可以看到更新后的数据，以及排序，确认更新么？',
                            onOk () {
                                self.updateSortSubmit();
                                self.updateChannelLabelsSubmit(groupIndex);
                            },
                            onCancel() {},
                        });
                    }
                }
            } else { // bannerOn === 1 banner已启用
                if (bannerLength === 0) { // banner视频数量 === 0
                    if (labelsColseLength === labelsLength) { // 专题未启用数量 === 专题数量
                        message.warning('banner配置不完整，不能发布更新！');
                    } else { // 专题有启用 有未启用
                        if (labelOpenVideosAllNotSet > 0 || labelOpenVideosNotAllSet > 0) { // 如果视频设置不完整
                            message.warning('banner和专题配置不完整，不能发布更新！');
                        } else { // 已启用的专题视频都已经设置完整
                            message.warning('banner配置不完整，不能发布更新！');
                        }
                    }
                } else { // banner视频数量 > 0 banner已设置
                    if (labelsColseLength === labelsLength) { // 专题未启用数量 === 专题数量
                        confirm({
                            title: '提示',
                            content: '发布更新后用户可以看到更新后的数据，以及排序，确认更新么？',
                            onOk () {
                                self.updateSortSubmit();
                                self.updateChannelLabelsSubmit(groupIndex);
                            },
                            onCancel() {},
                        });
                    } else { // 专题有启用 有未启用
                        if (labelOpenVideosAllNotSet > 0 || labelOpenVideosNotAllSet > 0) { // 如果视频设置不完整
                            message.warning('专题配置不完整，不能发布更新！');
                        } else { // 已启用的专题视频都已经设置完整
                            confirm({
                                title: '提示',
                                content: '发布更新后用户可以看到更新后的数据，以及排序，确认更新么？',
                                onOk () {
                                    self.updateSortSubmit();
                                    self.updateChannelLabelsSubmit(groupIndex);
                                },
                                onCancel() {},
                            });
                        }
                    }
                }
            }
        }
    }
    // 获取可发布与不可发布的专题视频状态
    getLabelUpdateStatus(labels) {
        // 专题数量 专题开启数量 专题关闭数量 专题开启视频全部设置数量 专题开启视频全部未设置数量 专题开启视频未全部设置数量
        let result = {
            labelsLength: 0,
            labelsOpenLength: 0,
            labelsColseLength: 0,
            labelOpenVideosAllSet: 0,
            labelOpenVideosAllNotSet: 0,
            labelOpenVideosNotAllSet: 0
        };
        let labelsLength = 0;
        let labelsOpenLength = 0;// 启用的专题
        let labelsColseLength = 0; // 未启用的专题
        let labelOpenVideosAllSet = 0;
        let labelOpenVideosAllNotSet = 0;
        let labelOpenVideosNotAllSet = 0;
        const _labels = labels.concat();
        _labels.splice(0, 1);
        if (_labels.length > 0) { // 专题数量 > 0
            labelsLength = _labels.length;
            for (let i = 0; i < _labels.length; i++) {
                const label = _labels[i];
                const videos = label.videos;
                const layoutId = label.layoutId;
                const labelEnable = label.isEnable;
                const videosMaxNum = SUBJECT_MAP[layoutId]; // 根据layoutId获取专题视频模板数量
                let count = 0;
                if (labelEnable === 1) {
                    labelsOpenLength++;
                    videos.forEach((video) => {
                        if (!video.name) {
                            console.log(video, 'name 不存在');
                            count++;
                        }
                    });
                } else {
                    labelsColseLength++;
                }
                if (videos.length !== videosMaxNum) { // videos.length < videosMaxNum
                    count = videosMaxNum - videos.length + count;
                }
                if (count === videosMaxNum) {
                    labelOpenVideosAllNotSet++;
                } else if (count > 0) {
                    if (videosMaxNum > 1) {
                        labelOpenVideosNotAllSet++;
                    }
                }
                if (labelEnable === 1 && labelOpenVideosAllNotSet === 0 && labelOpenVideosNotAllSet === 0) {
                    labelOpenVideosAllSet++;
                }
            }
        }
        result.labelsLength = labelsLength;
        result.labelsOpenLength = labelsOpenLength;
        result.labelsColseLength = labelsColseLength;
        result.labelOpenVideosAllSet = labelOpenVideosAllSet;
        result.labelOpenVideosAllNotSet = labelOpenVideosAllNotSet;
        result.labelOpenVideosNotAllSet = labelOpenVideosNotAllSet;
        return result;
    }

    // 专题已开启 是否有视频未配置完整的专题数量
    getLabelOpenVideosCloseCount(labels) {
        let count = 0;
        for (let i = 1; i < labels.length; i++) {
            const label = labels[i];
            const enable = label.isEnable;
            const videos = label.videos;
            for (let j = 0; j < videos.length; j++) {
                const video = videos[j];
                if (enable === 1 && (!video.name || !video.subName)) {
                    count++;
                }
            }
        }
        return count;
    }

    // 发布更新【频道】确认提交
    updateChannelSubmit(groupIndex) {
        const groupsCopy = this.state.groupsCopy;
        const groupCopy = groupsCopy[groupIndex];
        const groupCopyName = groupCopy.name;
        if (groupCopyName !== SPECIAL_NAME.immutableChannelName) {
            yxFetch(REQ_URL.MODIFY_MOBILE_CHANNEL, {
                id: groupCopy.id,
                name: groupCopy.name,
                enable: groupCopy.enable,
                imageId: groupCopy.imageId,
                onImageId: groupCopy.onImageId,
                bannerOn: groupsCopy.bannerOn
            }).then(res => {
                message.success('发布更新成功！');
                this.setState({
                    groupsCopy: this.state.groupsCopy
                }, () => {
                    this.setGroupsCache(this.state.groupsCopy, 0);
                });
            });
        } else {
            message.success(`${SPECIAL_NAME.immutableChannelName}不需要更新！`);
        }
    }

    // 发布更新【频道和专题】确认提交
    updateChannelLabelsSubmit(groupIndex) {
        console.log('发布更新');
        const groupsCopy = this.state.groupsCopy;
        const groupCopy = groupsCopy[groupIndex];
        const groupCopyName = groupCopy.name;
        if (groupCopyName !== SPECIAL_NAME.immutableChannelName) {
            yxFetch(REQ_URL.MODIFY_MOBILE_CHANNEL, {
                id: groupCopy.id,
                name: groupCopy.name,
                enable: groupCopy.enable,
                imageId: groupCopy.imageId,
                onImageId: groupCopy.onImageId,
                bannerOn: groupsCopy.bannerOn
            }).then(res => {
                if (res.code === 0) {
                    this.updateLegoSubmit(groupCopy.id);
                } else {
                    message.error(res.errmsg);
                }
            });
        } else {
            this.updateLegoSubmit(groupCopy.id);
        }
    }

    // 确认提交专题
    updateLegoSubmit(channelId) {
        yxFetch(REQ_URL.PUBLISH_LEGO, {
            channelId: channelId,
            version: VERSION,
        }).then(res => {
            if (res.code === 0) {
                message.success('发布更新成功！');
                this.setState({
                    groupsCopy: this.state.groupsCopy
                }, () => {
                    this.setGroupsCache(this.state.groupsCopy, 0);
                });
            } else {
                message.error(res.errmsg);
            }
        });
    }

    // 新增频道弹窗
    addChannel = () => {
        this.setState({
            modalType: 1,
            groupIndex: this.state.groupsCopy.length,
            modalTitle: '新增',
            inputValue: '',
            validateTxt: '',
            disabled: true,
            isChecked: false,
            isModalShow: true,
            imageId: null,
            onImageId: null,
            isUploadImage: false,
            isUploadOnImage: false,
            imageUrl: '',
            onImageUrl: '',
        }, () => {
            this.getSwitchStatus(this.state.isChecked);
        });
    }

    // 获取排序的id数组，用来对比两个数组是否相同
    getSortIds(groups) {
        let ids = [];
        for (let i = 0; i < groups.length; i++) {
            const groupId = String(groups[i].id);
            if (groupId) {
                ids.push(groupId);
            }
        }
        return ids;
    }

    // 更新排序
    updateSortSubmit() {
        let { groupsCopy } = this.state;
        let sortJson = [];

        groupsCopy.forEach((item) => {
            sortJson.push({
                channelId: item.id,
                sort: item.sort
            });
        });

        yxFetch(REQ_URL.SORT_MOBILE_CHANNEL, {
            json: JSON.stringify(sortJson)
        }).then(res => {
            if (res.code === 0) {
                console.log('app channels排序成功');
            }
        });
    }

    // 点击弹窗取消按钮
    handleCancel = () => {
        this.setState({
            isModalShow: false
        });
    }

    // 点击弹窗确定按钮
    handleOk() {
        let channelNames = [];
        this.state.groupsCopy.forEach((channel, index) => {
            channelNames.push(channel.name);
        });
        const channelName = this.state.inputValue.trim();
        if (channelName === '') {
            this.setState({
                validateTxt: '频道名称不能为空'
            });
            return;
        }
        if (channelName.length > 6) {
            this.setState({
                validateTxt: '标题不能超过6个字符'
            });
            return;
        }
        switch (this.state.modalType) {
            case 1:
                // 新增
                if (channelNames.indexOf(channelName) !== -1) {
                    this.setState({
                        validateTxt: '您输入的标题已经被使用，请重新输入!'
                    });
                    return;
                }
                if (!this.state.isUploadImage || !this.state.isUploadOnImage) {
                    message.warning('请上传图片');
                    return;
                }
                // 请求添加图片接口，获取 imgId
                yxFetch(REQ_URL.ADD_IMG, {
                    url: this.state.imageUrl,
                    scale: '1'
                })
                    .then(res => {
                        if (res.code === 0) {
                            // 获取 imageId
                            this.setState({
                                imageId: res.data.id
                            }, () => {
                                // 获取 onImageId
                                yxFetch(REQ_URL.ADD_IMG, {
                                    url: this.state.onImageUrl,
                                    scale: '1'
                                })
                                    .then(res => {
                                        if (res.code === 0) {
                                            this.setState({
                                                onImageId: res.data.id
                                            }, () => {
                                                let postData = {
                                                    name: channelName,
                                                    sort: 1000 * (this.state.groupsCopy.length + 1),
                                                    enable: 0, // 新增默认为未开启
                                                    imageId: this.state.imageId,
                                                    imageUrl: this.state.imageUrl,
                                                    onImageId: this.state.onImageId,
                                                    onImageUrl: this.state.onImageUrl,
                                                    bannerOn: 0, // 默认0关闭
                                                };
                                                yxFetch(REQ_URL.ADD_MOBILE_CHANNEL, postData).then(res => {
                                                    if (res.code === 0) {
                                                        message.success('新增频道成功！');
                                                        const resData = res.data;
                                                        postData.id = resData.id;
                                                        this.resetGroupsCopy(postData);
                                                    }
                                                });
                                            });
                                        }
                                    });
                            });
                        } else {
                            message.error(res.errmsg);
                        }
                    });
                break;
            case 0:
                // 编辑
                // 设置编辑窗口的图片
                if (this.state.inputValue.trim() === '') {
                    this.setState({
                        validateTxt: '频道名称不能为空'
                    });
                    return;
                }
                // 没有修改图片，直接请求编辑接口
                if (!this.state.isUploadImage && !this.state.isUploadOnImage) {
                    const postData = {
                        name: this.state.inputValue.trim(),
                        enable: Number(this.state.isChecked),
                        id: this.state.id,
                        imageId: this.state.imageId,
                        imageUrl: this.state.imageUrl,
                        onImageId: this.state.onImageId,
                        onImageUrl: this.state.onImageUrl,
                    };
                    this.resetGroupsCopy(postData);
                } else if (this.state.isUploadImage) { // 上传了 普通状态 的图片
                    yxFetch(REQ_URL.ADD_IMG, {
                        url: this.state.imageUrl,
                        scale: '1'
                    })
                        .then(res => {
                            if (res.code === 0) {
                                this.setState({
                                    imageId: res.data.id
                                }, () => {
                                    // 上传了 激活状态 的图片
                                    if (this.state.isUploadOnImage) {
                                        yxFetch(REQ_URL.ADD_IMG, {
                                            url: this.state.onImageUrl,
                                            scale: '1'
                                        })
                                            .then(res => {
                                                if (res.code === 0) {
                                                    this.setState({
                                                        onImageId: res.data.id
                                                    }, () => {
                                                        message.success('编辑频道成功！');
                                                        const postData1 = {
                                                            name: this.state.inputValue.trim(),
                                                            enable: Number(this.state.isChecked),
                                                            id: this.state.id, // this.state.groupsCopy[this.state.groupIndex].id,
                                                            imageId: this.state.imageId,
                                                            imageUrl: this.state.imageUrl,
                                                            onImageId: this.state.onImageId,
                                                            onImageUrl: this.state.onImageUrl
                                                        };
                                                        this.resetGroupsCopy(postData1);
                                                    });
                                                } else {
                                                    message.error(res.errmsg);
                                                }
                                            });
                                    } else { // 没有上传 激活状态 的图片
                                        message.success('编辑频道成功！');
                                        const postData2 = {
                                            name: this.state.inputValue.trim(),
                                            enable: Number(this.state.isChecked),
                                            id: this.state.id,
                                            imageId: this.state.imageId,
                                            imageUrl: this.state.imageUrl,
                                            onImageId: this.state.onImageId,
                                            onImageUrl: this.state.onImageUrl
                                        };
                                        this.resetGroupsCopy(postData2);
                                    }
                                });
                            } else {
                                message.error(res.errmsg);
                            }
                        });
                } else { // 没有上传 普通状态 的图片
                    yxFetch(REQ_URL.ADD_IMG, { url: this.state.groupsCopy[this.state.groupIndex].onImageUrl, scale: '1' })
                        .then(res => {
                            if (res.code === 0) {
                                this.setState({
                                    onImageId: res.data.id
                                }, () => {
                                    message.success('编辑频道成功！');
                                    const postData3 = {
                                        name: this.state.inputValue.trim(),
                                        enable: Number(this.state.isChecked),
                                        id: this.state.id,
                                        imageId: this.state.imageId,
                                        imageUrl: this.state.imageUrl,
                                        onImageId: this.state.onImageId,
                                        onImageUrl: this.state.onImageUrl
                                    };
                                    this.resetGroupsCopy(postData3);
                                });
                            } else {
                                message.error(res.errmsg);
                            }
                        });
                }
                break;
            default:
                break;
        }
    }

    // 重设groupsCopy数据
    resetGroupsCopy(postData) {
        let groupsCopy = this.state.groupsCopy.concat();
        if (this.state.modalType === 1) { // 新增
            const addGroupCopy = {
                id: postData.id,
                name: postData.name,
                enable: postData.enable,
                imageId: postData.imageId,
                imageUrl: imgPrefix + postData.imageUrl,
                onImageId: postData.onImageId,
                onImageUrl: imgPrefix + postData.onImageUrl,
                bannerOn: postData.bannerOn,
                sort: postData.sort,
                labels: []
            };
            groupsCopy.push(addGroupCopy);
        } else { // 编辑
            groupsCopy.forEach((item) => {
                if (postData.id === item.id) {
                    item.name = postData.name;
                    item.enable = postData.enable;
                    item.id = postData.id;
                    item.imageId = postData.imageId;
                    item.imageUrl = imgPrefix + postData.imageUrl;
                    item.onImageId = postData.onImageId;
                    item.onImageUrl = imgPrefix + postData.onImageUrl;
                }
            });
        }
        this.setState({ groupsCopy });
        this.setGroupsCache(groupsCopy);
    }

    modalSubmit = (api, postData) => {
        yxFetch(api, postData).then(res => {
            if (res.code === 0) {
                this.getGroupsData();
                this.setState({
                    inputValue: '',
                    isModalShow: false,
                }, () => {
                    if (this.state.modalType) {
                        message.success('频道新增成功');
                    } else {
                        message.success('频道编辑成功');
                    }
                    this.setState({
                        imageId: null,
                        onImageId: null,
                        isUploadImage: false,
                        isUploadOnImage: false,
                        imageUrl: '',
                        onImageUrl: '',
                    });
                });
            } else {
                message.error(res.errmsg);
            }
        });
    }

    switchChange = (isChecked) => {
        this.setState({
            isChecked: isChecked
        }, () => {
            this.setState({
                switchLabel: isChecked ? '启用' : '未启用'
            });
        });
    }

    setToolTip() {
        return (
            <div className={style['add-button-tooltip-text']}>新增</div>
        );
    }

    // 拖拽移动数据位置之后
    dragGroup (oldIndex, newIndex, groups, leavel) {
        if (oldIndex === 0 || newIndex === 0) {
            message.warning('不允许的拖拽项,即将刷新！');
            window.setTimeout(() => {
                window.location.reload();
            }, 2000);
            return false;
        }

        // oldIndex 按下拖动的频道的 index
        let optionGroups = groups.concat();
        optionGroups.splice(newIndex, 0, ...optionGroups.splice(oldIndex, 1)); // 将数据插到拖动到的位置前面
        optionGroups = this.formatSort(optionGroups); // 重新格式化sort

        let resultChannels = null;
        // labesl排序
        if (leavel !== -1) {
            let groupsCopy = List(this.state.groupsCopy);
            groupsCopy.get(leavel).labels = optionGroups;
            resultChannels = groupsCopy.toArray();
            optionGroups = optionGroups.filter((item) => {
                // 过滤banner，否则影响数据库
                return item.name !== 'banner';
            });
            this.updateQueryLego(optionGroups, groupsCopy.get(leavel).id);
        } else {
            resultChannels = optionGroups;
            this.setGroupsCache(resultChannels);
        }

        if (resultChannels) {
            this.setState({
                groupsCopy: resultChannels,
            });
        }
    }

    // 更新channel里的lables数据，用在排序
    async updateQueryLego(cards, channelId) {
        let res = await yxFetch(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: channelId,
            version: VERSION,
            json: JSON.stringify({
                version: VERSION,
                timestamp: '',
                cards: cards
            })
        });
        if (res.code === 0) {
            this.setState({
                inputValue: '',
                isModalShow: false,
            });
        } else {
            message.error(res.errmsg);
        }
    }

    // 更新channel数据，排序使用
    async setGroupsCache(channels) {
        let res = await yxFetch(REQ_URL.SET_CHANNEL_CACHE, {
            json: JSON.stringify(channels)
        });

        if (res.code === 0) {
            this.setState({
                inputValue: '',
                isModalShow: false,
            });
        } else {
            message.error(res.errmsg);
        }
    }

    // 格式化sort
    formatSort(channels) {
        if (channels) {
            channels.forEach((channel, index) => {
                channel.sort = 1000 * (index + 1); // 为什么要x1000？
                if (channel.labels) {
                    channel.labels.forEach((item, i) => {
                        item.sort = 1000 * (i + 1);
                    });
                }
            });
        }
        return channels;
    }

    imgUploadDone = (scale, url) => {
        this.setState({
            isUploadImage: true,
            imageUrl: url,
            onImageUrl: this.state.onImageUrl
        });
    }

    onImgUploadDone = (scale, url) => {
        this.setState({
            isUploadOnImage: true,
            onImageUrl: url,
            imageUrl: this.state.imageUrl,
        });
    }

    inputChange = (e) => {
        this.setState({
            inputValue: e.target.value.trim(),
            validateTxt: '',
        }, () => {
            const channelName = this.state.inputValue.trim();
            if (channelName.length > 6) {
                this.setState({
                    validateTxt: '标题不能超过6个字符'
                });
            }
        });
    }

    render() {
        return (
            <div>
                <Modal
                    title={this.state.modalTitle}
                    wrapClassName='vertical-center-modal'
                    style={{ width: 300 }}
                    visible={this.state.isModalShow}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Row>
                        <Col span={16}>
                            <h3>名称</h3>
                            <input type='text' className={style['label-input-text']} value={this.state.inputValue} onChange={this.inputChange} placeholder='请输入频道名称' />
                            <p className={style['validate-txt']}>{this.state.validateTxt}</p>
                            <Switch
                                disabled={this.state.disabled}
                                checked={this.state.isChecked}
                                onChange={this.switchChange}
                                style={{ marginTop: '20px' }}
                            />
                            <span className={style['switch-label']}>{ this.state.switchLabel }</span>
                        </Col>
                        <Col span={6} offset={2}>
                            <div className={style['upload-img']}>
                                <div>
                                    <Upload
                                        imgScaleText = '普通状态'
                                        figureWidth = {80}
                                        figureHeight = {60}
                                        uploadDone = {this.imgUploadDone}
                                        showImgUrl = {this.state.imageUrl}
                                    />
                                </div>
                                <div>
                                    <Upload
                                        imgScaleText = '激活状态'
                                        figureWidth = {80}
                                        figureHeight = {60}
                                        uploadDone = {this.onImgUploadDone}
                                        showImgUrl = {this.state.onImageUrl}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal>
                <YXBookshelf
                    groups = {this.state.groupsCopy}
                    bodys = {this.state.bodys}
                    footers = {this.state.footers}
                    dragGroup = {this.dragGroup}
                    addChannel = {this.addChannel}
                    dehaze = {this.state.dehaze}
                />
            </div>
        );
    }
}

export default ChannelApp;
