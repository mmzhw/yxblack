import React, { Component } from 'react';
import { Card, Button, Form, message, Modal, Rate } from 'antd';
import style from './style.module.css';
import InputRow from '../../../components/FormRow/InputRow';
import DPRow from '../../../components/FormRow/DPRow';
import SelRow from '../../../components/FormRow/SelRow';
import SingleSelRow from '../../../components/FormRow/SingleSelRow';
import RadioRow from '../../../components/FormRow/RadioRow';
import yxFetch from '../../../utils/fetch';
import Grid from '../subdetail/Grid';
import ImageUpload from '../../../components/Upload';
import SourceCard from '../SourceCard';
import * as urls from '../../../constants/urls';

import {
    Link
} from 'react-router-dom';
import { REQ_URL } from '../../../constants/constants';

message.config({
    top: 100,
    duration: 2,
});
const success = (content) => {
    message.success(content);
};
// const error = (content) => {
//   message.error(content)
// }
const warning = (content) => {
    message.warning(content);
};
const bodyStyle = {
    padding: '10px'
};

const FormItem = Form.Item;

class DetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 更新 flag
            flag: 0,
            displayUp: 'none',
            displayDown: 'none',
            precessingStatus: '',
            // 转码控制 display
            ZMstate: '',
            displayZM: 'none',
            displayYZM: 'none',
            displayBKZM: 'none',
            displayZZCL: 'none',
            displayCLSB: 'none',
            classifyList: [],
            areaList: [],
            yearList: [],
            typeList: [],
            labelGroupList: [],
            clarityMap: {
                '': '无',
                '1080P': '1080P'
            },
            signMap: {
                '': '无',
                '独播': '独播',
                '自制': '自制',
                'HOT': 'HOT',
                '首播': '首播',
                '活动': '活动',
                '专题': '专题',
                '预告': '预告',
                '花絮': '花絮',
                '推广': '推广',
                '直播': '直播',
                '回放': '回放',
            },
            video: {
                vVideoDetailRspVos: [],
                newVideoDetails: [],
                videoBaseId: props.match.match.params.id,
                name: '',
                subName: '',
                foreignName: '',
                anotherName: '',
                director: '',
                actor: '',
                releaseAt: 0,
                categories: 0,
                bizType: 0,
                episodes: 0,
                labelIds: [], // send
                labels: [], // receive
                cmsDuration: '',
                intro: '',
                images: [],
                extMap: {
                    clarity: '',
                    sign: '',
                },
                classificationIds: [],
                typeIds: [],
                areaIds: [],
                yearIds: [],
                originalUrl: '',
                keyword: '',
            },
            firstCategorys: [],
            secondCategorys: [],
            videoDetailId: '',
            imgUrl5: '', // 1:1
            imgUrl1: '', // 16:9
            imgUrl2: '', // 4:3
            imgUrl3: '', // 2:3
            imgUrl4: '', // 3:2
            visible: false,
        };

        this.nameChange = this.nameChange.bind(this);
        this.subNameChange = this.subNameChange.bind(this);
        this.foreignNameChange = this.foreignNameChange.bind(this);
        this.anotherNameChange = this.anotherNameChange.bind(this);
        this.directorChange = this.directorChange.bind(this);
        this.actorChange = this.actorChange.bind(this);
        this.releaseAtChange = this.releaseAtChange.bind(this);
        this.episodesChange = this.episodesChange.bind(this);
        this.cmsDurationChange = this.cmsDurationChange.bind(this);
        this.introChange = this.introChange.bind(this);
        this.classifyListChange = this.classifyListChange.bind(this);
        this.areaListChange = this.areaListChange.bind(this);
        this.yearListChange = this.yearListChange.bind(this);
        this.typeListChange = this.typeListChange.bind(this);
        this.clarityChange = this.clarityChange.bind(this);
        this.keywordChange = this.keywordChange.bind(this);
        this.cornerMarkChange = this.cornerMarkChange.bind(this);
        this.labelIdsChange = this.labelIdsChange.bind(this);
        this.originalUrlChange = this.originalUrlChange.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
        this.trim = this.trim.bind(this);
        this.hasSpecifiedScale = this.hasSpecifiedScale.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.firstCateChange = this.firstCateChange.bind(this);
    }

    componentDidMount() {
        this.fetchClassifyList();
        this.fetchAreaList();
        this.fetchYearList();
        this.fetchTypeList();
        this.fetchLabelGroupList();
        this.fetchVideoDetail();
        this.fetchFirstCategory();
    }
    // 判断转码状态
    judgePrecessingStatus() {
        console.log(this.state.precessingStatus);
        if (this.state.precessingStatus === 0) {
            this.setState({
                displayYZM: 'inline-block',
                displayZM: 'none',
                displayCLSB: 'none',
                displayZZCL: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 1) {
            this.setState({
                displayZM: 'inline-block',
                displayYZM: 'none',
                displayCLSB: 'none',
                displayZZCL: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 2) {
            this.setState({
                displayZZCL: 'inline-block',
                displayZM: 'none',
                displayYZM: 'none',
                displayCLSB: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 3) {
            this.setState({
                displayCLSB: 'inline-block',
                displayZZCL: 'none',
                displayZM: 'none',
                displayYZM: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 401) {
            this.setState({
                displayBKZM: 'inline-block',
                displayCLSB: 'none',
                displayZZCL: 'none',
                displayZM: 'none',
                displayYZM: 'none'
            });
        }
    }
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }
    // 判断视频状态
    judgeStatus() {
        if (this.state.video.status === 2) {
            this.setState({
                displayUp: 'none',
                displayDown: 'inline-block'
            });
        } else {
            this.setState({
                displayUp: 'inline-block',
                displayDown: 'none'
            });
        }
    }
    fetchLabelGroupList() {
        yxFetch(REQ_URL.GROUP_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    this.setState({
                        labelGroupList: res.data
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchYearList() { // set enabled yearList
        yxFetch(REQ_URL.YEAR_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        yearList: enabledList
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchClassifyList() { // set enabled classifyList
        yxFetch(REQ_URL.CLASS_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        classifyList: enabledList
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchAreaList() { // set enabled areaList
        yxFetch(REQ_URL.AREA_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        areaList: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchTypeList() { // set enabled typeList
        yxFetch(REQ_URL.TYPE_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        typeList: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchFirstCategory() {
        yxFetch(REQ_URL.OTT_FIRST_CATEGORY, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        firstCategorys: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
            //
            });
    }
    fetchSecondCategory(topId) {
        yxFetch(REQ_URL.OTT_SECOND_CATEGORY, { topId: topId })
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];

                    res.data.forEach((element) => {
                        enabledList.push(element);
                    });

                    this.setState({
                        secondCategorys: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
            //
            });
    }
    fetchVideoDetail() {
        yxFetch(REQ_URL.NETS_VIDEO_BASE_INFOS, {
            videoBaseId: this.state.video.videoBaseId,
            searchFlag: 0,
        })
            .then(res => {
                if (res.code === 0) {
                    if (res.data.cmsDuration) { // 转换为分钟
                        res.data.cmsDuration = parseInt(res.data.cmsDuration, 10) / 60;
                    }
                    this.firstCateChange(res.data.firstCategory);
                    this.setState({
                        video: res.data,
                        videoDetailId: res.data.vVideoDetailRspVos.length > 0 ? res.data.vVideoDetailRspVos[0].videoDetailId : '',
                        precessingStatus: res.data.vVideoDetailRspVos.length > 0 ? res.data.vVideoDetailRspVos[0].precessingStatus : '',
                    }, () => {
                        let video = this.state.video;
                        // 没有clarity，默认选择 无
                        if (video.extMap && !video.extMap.clarity) {
                            video.extMap.clarity = '';
                        }
                        // 没有sign，默认选择 无
                        if (video.extMap && !video.extMap.sign) {
                            video.extMap.sign = '';
                        }
                        if (this.state.video.categories !== 2) { // 单视频
                            video.originalUrl = this.trim(res.data.vVideoDetailRspVos.length > 0 ? res.data.vVideoDetailRspVos[0].originalUrl : '');
                            this.setState({
                                video
                            });
                        }
                        this.setImgUrls();
                        this.setIds(res.data);
                        this.judgeStatus();
                        if (this.state.video.categories !== 2) {
                            this.judgePrecessingStatus();
                        }
                    });
                } else {
                }
            }).catch(({ res }) => {
                //
            });
    }
    uploadDone(scale, url) {
        let video = this.state.video;
        video.images.forEach((image, index, images) => {
            if (image.scale === scale) {
                images.splice(index, 1);
            }
        });
        video.images.push({
            scale,
            url
        });
        this.setState({
            video
        });
        this.setImgUrls();
    }
    getImageUrl(scale) {
        let images = this.state.video.images;
        for (let i = 0; i < images.length; i++) {
            if (images[i].scale === scale) {
                console.log(images[i].url);
                return images[i].url;
            }
        }
        return '';
    }
    setImgUrls() {
        this.setState({
            imgUrl1: this.getImageUrl(1),
            imgUrl2: this.getImageUrl(2),
            imgUrl3: this.getImageUrl(3),
            imgUrl4: this.getImageUrl(4),
            imgUrl5: this.getImageUrl(5),
        });
    }
    setIds(data) {
        let classificationIds = [];
        let classifyList = data.classifyList ? data.classifyList : [];
        classifyList.forEach((val, index, arr) => {
            if (val.enable === 1) {
                classificationIds.push(val.id + '');
            }
        });

        let areaIds = [];
        let areaList = data.areaList ? data.areaList : [];
        areaList.forEach((val, index, arr) => {
            if (val.enable === 1) {
                areaIds.push(val.id + '');
            }
        });

        let yearIds = [];
        let yearList = data.yearList ? data.yearList : [];
        yearList.forEach((val, index, arr) => {
            if (val.enable === 1) {
                yearIds.push(val.id + '');
            }
        });

        let typeIds = [];
        let typeList = data.typeList ? data.typeList : [];
        typeList.forEach((val, index, arr) => {
            if (val.enable === 1) {
                typeIds.push(val.id + '');
            }
        });

        let labelIds = [];
        let labels = data.labels ? data.labels : [];
        for (let id in labels) {
            for (let j = 0; j < labels[id].length; j++) {
                labelIds.push(labels[id][j].id + '');
            }
        }

        let video = this.state.video;

        video.classificationIds = classificationIds;
        video.areaIds = areaIds;
        video.yearIds = yearIds;
        video.typeIds = typeIds;
        video.labelIds = labelIds;

        this.setState({
            video
        });
    }
    hasSpecifiedScale(images, scale) {
        if (!images || images.length === 0) return false;
        return images.some((image, index) => image.scale === scale);
    }
    updateVideo(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            console.log('Received values of form: ', values);
            let video = this.state.video;
            let videoToUpdate = {
                videoBaseId: video.videoBaseId,
                name: video.name,
                extMap: video.extMap,
                subName: video.subName,
                intro: video.intro,
                releaseAt: video.releaseAt,
                categories: video.categories,
                bizType: video.bizType,
                actor: video.actor,
                director: video.director,
                classificationIds: video.classificationIds,
                typeIds: video.typeIds,
                areaIds: video.areaIds,
                yearIds: video.yearIds,
                labelIds: video.labelIds,
                images: video.images,
                // not required
                anotherName: video.anotherName,
                foreignName: video.foreignName,
                episodes: video.episodes,
                cmsDuration: video.cmsDuration,
                keyword: video.keyword,
            };
            if (video.categories !== 2) {
                videoToUpdate.originalUrl = this.trim(video.originalUrl);
            }
            // if (!this.hasSpecifiedScale(video.images, 1)) {
            //   message.warn('请上传16:9的图片')
            //   return
            // }
            if (videoToUpdate.cmsDuration) { // 转换为秒上传
                videoToUpdate.cmsDuration = parseInt(videoToUpdate.cmsDuration, 10) * 60;
            }

            // todo 上面写得好傻逼，可以直接videoToUpdate={...values}，个别做特殊处理,先这样写，等有空整理下
            // todo 新增的，思路：应该用循环做form，方便修改
            videoToUpdate.licence = values.licence;
            videoToUpdate.firstCategory = values.firstCategory;
            videoToUpdate.secondCategory = values.secondCategory;
            videoToUpdate.score = Number(values.score);
            videoToUpdate.releaseAt = Number(values.releaseAt ? values.releaseAt.format('x') : '');
            videoToUpdate.copyrightStart = Number(values.copyrightStart ? values.copyrightStart.format('x') : '');
            videoToUpdate.copyrightEnd = Number(values.copyrightEnd ? values.copyrightEnd.format('x') : '');

            yxFetch(REQ_URL.UPDATE_VIDEO_BASE_INFO, videoToUpdate)
                .then(res => {
                    if (res.code === 0) {
                        success('更新成功！');
                        this.fetchVideoDetail();
                        this.setState({
                            flag: this.state.flag + 1
                        });
                    } else {
                        message.error(res.errmsg);
                    }
                }).catch(({ res }) => {
                    message.error('更新失败！');
                });
        });
    }
    quickEdit() {
        this.setState({
            visible: true,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    handleEditSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let video = this.state.video;
            let videoToUpdate = {
                videoBaseId: video.videoBaseId,
                name: video.name,
                subName: video.subName,
                typeIds: video.typeIds,
                intro: video.intro,
                images: video.images,
            };
            if (video.categories !== 2) {
                videoToUpdate.originalUrl = this.trim(video.originalUrl);
            }
            if (!this.hasSpecifiedScale(video.images, 1)) {
                message.warn('请上传16:9的图片');
                return;
            }
            yxFetch(REQ_URL.QUICK_UPDATE_VIDEO_BASE, videoToUpdate)
                .then(res => {
                    if (res.code === 0) {
                        success('更新成功！');
                        this.fetchVideoDetail();
                        this.setState({
                            flag: this.state.flag + 1
                        });
                    } else {
                        message.error(res.errmsg);
                    }
                }).catch(({ res }) => {
                    message.error('更新失败！');
                });
        });
    }
    handleEdit(e) {
        e.preventDefault();
        this.refs.form.props.onSubmit();
        this.setState({
            visible: false
        });
    }
    // 上架
    putaway() {
    // if (this.state.imgUrl3) {
        yxFetch(REQ_URL.PUT_VIDEO_ON_SHELF, {
            videoBaseId: this.state.video.videoBaseId,
        }).then(res => {
            if (res.code === 0) {
                success('上架成功！');
                this.setState({
                    displayUp: 'none',
                    displayDown: 'inline-block'
                });
                // this.fetchVideoDetail()
            } else {
                warning(res.errmsg);
            }
        }).catch((e) => {
            console.log(e);
        });
    // } else {
    //   warning('2:3图片必填!')
    // }
    }
    // 下架
    putoff() {
        yxFetch(REQ_URL.VIDEO_SHORT_PUT, {
            videoBaseId: this.state.video.videoBaseId,
        }).then(res => {
            if (res.code === 0) {
                success('下架成功！');
                this.setState({
                    displayUp: 'inline-block',
                    displayDown: 'none'
                });
                // this.fetchVideoDetail()
            } else {
                warning(res.errmsg);
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    // 转码
    transcoding() {
        yxFetch(REQ_URL.VIDEO_PROCESS, {
            videoDetailId: this.state.videoDetailId,
            originalURL: this.state.video.vVideoDetailRspVos[0].originalUrl
        }).then(res => {
            if (res.code === 0) {
                this.fetchVideoDetail();
                this.setState({
                    flag: this.state.flag + 1
                });
            } else {
                warning(res.errmsg);
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    render() {
        let formTitle = null; // form的标题
        let episodesRow = null; // 期数、集数、‘’
        if (this.state.video.bizType === 1) { // 电视剧
            formTitle = <h3>更新电视剧基本信息</h3>;
            episodesRow = <InputRow
                id = 'episodes'
                required = { false }
                label = '集数'
                wrapperCol = { 2 }
                formEle = { Form }
                maxlength = { 10 }
                formMethods = { this.props.form }
                initialValue = { this.state.video.episodes }
                message = '请输入集数'
                onChangeHandle = {this.episodesChange}
            />;
        } else if (this.state.video.bizType === 2) { // 综艺
            formTitle = <h3>更新综艺基本信息</h3>;
            episodesRow = <InputRow
                id = 'episodes'
                required = { false }
                label = '期数'
                wrapperCol = { 2 }
                formEle = { Form }
                maxlength = { 10 }
                formMethods = { this.props.form }
                initialValue = { this.state.video.episodes }
                message = '请输入期数'
                onChangeHandle = {this.episodesChange}
            />;
        } else { // 单视频
            formTitle = <h3>更新单视频</h3>;
        }

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 6 },
        };

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <div className={style.up}>
                    <Button type='primary' onClick={this.putaway.bind(this)} style = {{ 'display': this.state.displayUp }} className={style.right}>上架</Button>
                    <Button type='primary' onClick={this.putoff.bind(this)} style = {{ 'display': this.state.displayDown }} className={style.right}>下架</Button>
                    <Button type='primary' onClick={this.quickEdit.bind(this)} style = {{ 'display': this.state.displayDown }} className={style.right}>快速编辑</Button>
                </div>
                {(
                    this.state.video.categories === 2 ? <Card className={style.card} bodyStyle={bodyStyle}>
                        <h3>选集</h3>
                        <div className={style['rep-box']}>
                            <div className={style['rep-item']}>播放源有更新：<span className={style['bg-yellow']}></span></div>
                            <div className={style['rep-item']}>新增剧集：<span className={style['bg-red']}></span></div>
                        </div>
                        <div className={style['grid-box']}>
                            {this.state.video.vVideoDetailRspVos.map((subVideo, index) => (
                                <Link
                                    to = {`${urls.VIDEO_LIST}/VideoDetail/${this.state.video.videoBaseId}/videoSubDetail?videoDetailId=${subVideo.videoDetailId}`}
                                    key = { index }
                                >
                                    <Grid
                                        value = { subVideo.episodeDisplay }
                                        tag = { subVideo.hasNewSource ? 'yellow' : ''}
                                    />
                                </Link>
                            ))}
                            {(
                                this.state.video.vVideoDetailRspVos.length < this.state.video.episodes ? <Link to = {`${urls.VIDEO_LIST}/VideoDetail/${this.state.video.videoBaseId}/videoSubDetail`}><Button type='primary'>+ 新增</Button></Link> : ''
                            )}
                        </div>
                        <div className={style['grid-box']}>
                            {this.state.video.newVideoDetails.map((subVideo, index) => (
                                <Link
                                    key = { index }
                                    /* to = {`/addCrawler/${this.state.video.videoBaseId}?tpVideoId=${subVideo.thirdpartyDetailId}&bizType=${this.state.video.bizType}`}*/
                                    to = {`${urls.VIDEO_LIST}/VideoDetail/${this.state.video.videoBaseId}/addCrawler?tpVideoId=${subVideo.thirdpartyDetailId}`}
                                >
                                    <Grid
                                        value = { subVideo.displayEpisode }
                                        tag = { 'red' }
                                    />
                                </Link>
                            ))}
                        </div>
                    </Card> : <SourceCard flag={this.state.flag} update={this.fetchVideoDetail.bind(this)} oldvideoDetailId = {this.state.videoDetailId} videoBaseId = {this.state.video.videoBaseId} />
                )}
                <Modal title='快速编辑'
                    visible={ this.state.visible }
                    onOk={this.handleEdit}
                    onCancel={this.handleCancel}
                    width='800'
                >
                    <Form className={style['form']} onSubmit={this.handleEditSubmit} ref='form'>
                        <InputRow
                            id = 'name'
                            label = '名称'
                            maxlength = { 40 }
                            wrapperCol = { 6 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.name }
                            message = '请输入名称'
                            onChangeHandle = {this.nameChange}
                        />
                        <InputRow
                            id = 'subName'
                            required = { false }
                            label = '二级标题'
                            wrapperCol = { 6 }
                            maxlength = { 40 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入二级标题'
                            initialValue = { this.state.video.subName }
                            onChangeHandle = {this.subNameChange}
                        />
                        <SelRow
                            id = 'typeList'
                            mode = 'multiple'
                            label = '类型'
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加类型'
                            initialValue = { this.state.video.typeIds }
                            selList = { this.state.typeList }
                            optVal = 'id'
                            optLabel = 'name'
                            onChange = { this.typeListChange }
                        />
                        <InputRow
                            maxlength = { 2000 }
                            id = 'intro'
                            wrapperCol = { 14 }
                            label = '简介'
                            required = { false }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入简介'
                            initialValue = { this.state.video.intro }
                            autosize = {{ minRows: 6, maxRows: 8 }}
                            type= 'textarea'
                            onChangeHandle = { this.introChange }
                        />
                        <h3>封面</h3>
                        <div className={style['img-upload-container']}>
                            <ImageUpload
                                imgScale = { 3 }
                                imgScaleText = '图片比例2:3'
                                showImgUrl = { this.state.imgUrl3 }
                                figureWidth = { 200 }
                                figureHeight = { 300 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 1 }
                                imgScaleText = '图片比例16:9'
                                showImgUrl = { this.state.imgUrl1 }
                                figureWidth = { 200 }
                                figureHeight = { 112 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 2 }
                                imgScaleText = '图片比例4:3'
                                showImgUrl = { this.state.imgUrl2 }
                                figureWidth = { 200 }
                                figureHeight = { 150 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 5 }
                                imgScaleText = '图片比例1:1'
                                showImgUrl = { this.state.imgUrl5 }
                                figureWidth = { 200 }
                                figureHeight = { 200 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 4 }
                                imgScaleText = '图片比例3:2'
                                showImgUrl = { this.state.imgUrl4 }
                                figureWidth = { 200 }
                                figureHeight = { 133 }
                                uploadDone = { this.uploadDone }
                            />
                        </div>
                    </Form>
                </Modal>
                <Card className={`${style['card']} ${style['clearfix']}`} bodyStyle={bodyStyle}>
                    <Form className={style['form']} onSubmit={this.updateVideo}>
                        { formTitle }
                        <InputRow
                            id = 'videoBaseId'
                            label = 'videoBaseId'
                            wrapperCol = { 6 }
                            formEle = { Form }
                            disabled = { true }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.videoBaseId }
                        />

                        {(
                            this.state.video.categories !== 2 ? <InputRow
                                id = 'originalUrl'
                                label = '视频源'
                                wrapperCol = { 12 }
                                formEle = { Form }
                                formMethods = { this.props.form }
                                message = '请输入视频源'
                                onChangeHandle = {this.originalUrlChange}
                                initialValue = { this.state.video.originalUrl }
                            /> : ''
                        )}
                        <InputRow
                            id = 'name'
                            label = '名称'
                            maxlength = { 40 }
                            required = { true }
                            wrapperCol = { 6 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.name }
                            message = '请输入名称'
                            onChangeHandle = {this.nameChange}
                        />
                        <FormItem
                            {...formItemLayout}
                            label='评分'>
                            {getFieldDecorator('score', {
                                initialValue: this.state.video.score || 0
                            })(
                                <Rate allowHalf count={10} />
                            )}
                        </FormItem>
                        <InputRow
                            id = 'subName'
                            required = { false }
                            label = '二级标题'
                            wrapperCol = { 6 }
                            maxlength = { 40 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入二级标题'
                            initialValue = { this.state.video.subName }
                            onChangeHandle = {this.subNameChange}
                        />
                        <InputRow
                            id = 'foreignName'
                            required = { false }
                            label = '外文片名'
                            maxlength = { 100 }
                            wrapperCol = { 6 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入外文片名'
                            initialValue = { this.state.video.foreignName }
                            onChangeHandle = {this.foreignNameChange}
                        />
                        <InputRow
                            id = 'anotherName'
                            required = { false }
                            label = '别名'
                            wrapperCol = { 6 }
                            maxlength = { 100 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.anotherName }
                            message = '请输入别名'
                            onChangeHandle = {this.anotherNameChange}
                        />
                        <InputRow
                            id = 'director'
                            required = { false }
                            label = '导演'
                            wrapperCol = { 6 }
                            maxlength = { 100 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.director }
                            message = '请输入导演'
                            onChangeHandle = { this.directorChange }
                        />
                        <InputRow
                            id = 'actor'
                            required = { false }
                            label = '主演'
                            wrapperCol = { 10 }
                            maxlength = { 200 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.actor }
                            message = '请输入主演'
                            onChangeHandle = { this.actorChange }
                        />
                        <DPRow
                            id = 'releaseAt'
                            required = { false }
                            label = '发行时间'
                            wrapperCol = { 4 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.releaseAt }
                            message = '请输入发行时间'
                        />
                        <InputRow
                            id = 'licence'
                            required = { false }
                            label = 'licence'
                            wrapperCol = { 4 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入licence'
                            initialValue = { this.state.video.licence }
                        />
                        <DPRow
                            id = 'copyrightStart'
                            required = { false }
                            label = '版权开始时间'
                            wrapperCol = { 4 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.copyrightStart }
                            message = '请输入版权开始时间'
                        />
                        <DPRow
                            id = 'copyrightEnd'
                            required = { false }
                            label = '版权结束时间'
                            wrapperCol = { 4 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.copyrightEnd }
                            message = '请输入版权结束时间'
                        />
                        { episodesRow }
                        <SelRow
                            id = 'classifyList'
                            mode = 'multiple'
                            label = '分类'
                            required = { true }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加分类'
                            initialValue = { this.state.video.classificationIds }
                            selList = { this.state.classifyList }
                            optVal = 'id'
                            optLabel = 'name'
                            onChange = { this.classifyListChange }
                        />
                        <SelRow
                            id = 'areaList'
                            mode = 'multiple'
                            label = '地区'
                            required = { false }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加地区'
                            initialValue = { this.state.video.areaIds }
                            selList = { this.state.areaList }
                            optVal = 'id'
                            optLabel = 'name'
                            onChange = { this.areaListChange }
                        />
                        <SelRow
                            id = 'yearList'
                            mode = 'multiple'
                            label = '年代'
                            required = { false }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加年代'
                            initialValue = { this.state.video.yearIds }
                            selList = { this.state.yearList }
                            optVal = 'id'
                            optLabel = 'name'
                            onChange = { this.yearListChange }
                        />
                        <SelRow
                            id = 'typeList'
                            mode = 'multiple'
                            label = '类型'
                            required = { true }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加类型'
                            initialValue = { this.state.video.typeIds }
                            selList = { this.state.typeList }
                            optVal = 'id'
                            optLabel = 'name'
                            onChange = { this.typeListChange }
                        />
                        <SingleSelRow
                            id = 'firstCategory'
                            label = 'OTT一级分类'
                            required = { false }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加分类'
                            initialValue = { this.state.video.firstCategory }
                            selList = { this.state.firstCategorys }
                            optVal = 'topId'
                            optLabel = 'name'
                            onChange = { this.firstCateChange }
                        />
                        <SingleSelRow
                            id = 'secondCategory'
                            label = 'OTT二级分类'
                            required = { false }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请添加分类'
                            initialValue = { this.state.video.secondCategory }
                            selList = { this.state.secondCategorys }
                            optVal = 'filmType'
                            optLabel = 'name'
                        />
                        <InputRow
                            id = 'keyword'
                            label = '关键词'
                            maxlength = { 30 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入关键词'
                            onChangeHandle = { this.keywordChange }
                            initialValue = { this.state.video.keyword }
                        />
                        <InputRow
                            id = 'cmsDuration'
                            label = '配置时长'
                            formEle = { Form }
                            maxlength = { 10 }
                            formMethods = { this.props.form }
                            initialValue = { this.state.video.cmsDuration }
                            message = '请输入配置时长'
                            onChangeHandle = { this.cmsDurationChange }
                        />
                        <RadioRow
                            id = 'clarity'
                            radioMap = { this.state.clarityMap }
                            label = '清晰度'
                            formEle = { Form }
                            initialValue = { this.state.video.extMap.clarity }
                            formMethods = { this.props.form }
                            onChange = { this.clarityChange }
                            wrapperCol = { 6 }
                        />
                        <RadioRow
                            id = 'cornerMark'
                            initialValue = { this.state.video.extMap.sign }
                            label = '标记'
                            wrapperCol = { 14 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            radioMap = { this.state.signMap }
                            onChange = { this.cornerMarkChange }
                        />
                        <InputRow
                            maxlength = { 2000 }
                            id = 'intro'
                            wrapperCol = { 14 }
                            label = '简介'
                            required = { false }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入简介'
                            initialValue = { this.state.video.intro }
                            autosize = {{ minRows: 6, maxRows: 8 }}
                            type= 'textarea'
                            onChangeHandle = { this.introChange }
                        />
                        <div className={style['actions']}>
                            <Button type='primary' htmlType='submit' style={{ marginRight: '10px' }}>更新</Button>
                            <Button type='primary' disabled={this.state.ZMstate} onClick={this.transcoding.bind(this)} style = {{ 'display': this.state.displayZM }} >转码</Button>
                            <Button type='primary' disabled='disabled' style = {{ 'display': this.state.displayYZM }} >已转码</Button>
                            <Button type='disabled' disabled='disabled' style = {{ 'display': this.state.displayBKZM }} >不可转码</Button>
                            <Button type='primary' disabled='disabled' style = {{ 'display': this.state.displayZZCL }} >正在处理</Button>
                            <Button type='danger' style = {{ 'display': this.state.displayCLSB }} >处理失败</Button>
                        </div>
                        <h3>标签</h3>
                        {this.state.labelGroupList.filter(function(labelGroup, index) {
                            return labelGroup.enable === 1;
                        }).map((labelGroup, index) => (
                            <SelRow
                                key = { index }
                                initialValue = { this.getLabelGroupValue(labelGroup.id) }
                                id = { 'labelGroup' + labelGroup.id }
                                mode = 'multiple'
                                label = { labelGroup.groupName}
                                formEle = { Form }
                                formMethods = { this.props.form }
                                selList = { labelGroup.labels }
                                optVal = 'id'
                                optLabel = 'labelName'
                                onChange = { (labelIds) => { this.labelIdsChange(labelIds, labelGroup); } }
                            />
                        ))}
                        <h3>封面</h3>
                        <div className={style['img-upload-container']}>
                            <ImageUpload
                                imgScale = { 3 }
                                imgScaleText = '图片比例2:3'
                                showImgUrl = { this.state.imgUrl3 }
                                figureWidth = { 200 }
                                figureHeight = { 300 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 1 }
                                imgScaleText = '图片比例16:9'
                                showImgUrl = { this.state.imgUrl1 }
                                figureWidth = { 200 }
                                figureHeight = { 112 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 2 }
                                imgScaleText = '图片比例4:3'
                                showImgUrl = { this.state.imgUrl2 }
                                figureWidth = { 200 }
                                figureHeight = { 150 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 5 }
                                imgScaleText = '图片比例1:1'
                                showImgUrl = { this.state.imgUrl5 }
                                figureWidth = { 200 }
                                figureHeight = { 200 }
                                uploadDone = { this.uploadDone }
                            />
                            <ImageUpload
                                imgScale = { 4 }
                                imgScaleText = '图片比例3:2'
                                showImgUrl = { this.state.imgUrl4 }
                                figureWidth = { 200 }
                                figureHeight = { 133 }
                                uploadDone = { this.uploadDone }
                            />
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
    getLabelGroupValue(labelGroupId) {
        let labels = this.state.video.labels;
        let crtLabelGroup = labels[labelGroupId];
        let ids = [];
        if (!crtLabelGroup) return [];
        for (let i = 0; i < crtLabelGroup.length; i++) {
            if (crtLabelGroup[i].enable === 1) {
                ids.push(crtLabelGroup[i].id + '');
            }
        }
        return ids;
    }
    originalUrlChange(originalUrl) {
        let video = this.state.video;
        video.originalUrl = originalUrl;
        this.setState({
            video
        });
    }
    labelIdsChange(labelIds, labelGroup) {
        let video = this.state.video;
        for (let i = 0; i < labelGroup.labels.length; i++) {
            let idToRemove = labelGroup.labels[i].id + '';
            if (video.labelIds.indexOf(idToRemove) > -1) {
                video.labelIds.splice(video.labelIds.indexOf(idToRemove), 1);
            }
        }

        for (let i = 0; i < labelIds.length; i++) {
            if (video.labelIds.indexOf(labelIds[i]) === -1) {
                video.labelIds.push(labelIds[i]);
            }
        }
        this.setState({
            video
        });
    }
    firstCateChange(firstCate) {
        this.fetchSecondCategory(firstCate);
    }
    classifyListChange(classificationIds) {
        let video = this.state.video;
        video.classificationIds = classificationIds;
        this.setState({
            video
        });
    }
    areaListChange(areaIds) {
        let video = this.state.video;
        video.areaIds = areaIds;
        this.setState({
            areaIds
        });
    }
    yearListChange(yearIds) {
        let video = this.state.video;
        video.yearIds = yearIds;
        this.setState({
            video
        });
    }
    typeListChange(typeIds) {
        let video = this.state.video;
        video.typeIds = typeIds;
        this.setState({
            video
        });
    }
    nameChange(name) {
        let video = this.state.video;
        video.name = name;
        this.setState({
            video
        });
    }
    subNameChange(subName) {
        let video = this.state.video;
        video.subName = subName;
        this.setState({
            video
        });
    }
    foreignNameChange(foreignName) {
        let video = this.state.video;
        video.foreignName = foreignName;
        this.setState({
            video
        });
    }
    anotherNameChange(anotherName) {
        let video = this.state.video;
        video.anotherName = anotherName;
        this.setState({
            video
        });
    }
    directorChange(director) {
        let video = this.state.video;
        video.director = director;
        this.setState({
            video
        });
    }
    actorChange(actor) {
        let video = this.state.video;
        video.actor = actor;
        this.setState({
            video
        });
    }
    releaseAtChange(releaseAt) {
        let video = this.state.video;
        video.releaseAt = releaseAt;
        this.setState({
            video
        });
    }
    keywordChange(keyword) {
        let video = this.state.video;
        video.keyword = keyword;
        this.setState({
            video
        });
    }
    episodesChange(episodes) {
        let video = this.state.video;
        video.episodes = episodes;
        this.setState({
            video
        });
    }
    cmsDurationChange(cmsDuration) {
        let video = this.state.video;
        video.cmsDuration = cmsDuration;
        this.setState({
            video
        });
    }
    introChange(intro) {
        let video = this.state.video;
        video.intro = intro;
        this.setState({
            video
        });
    }
    clarityChange(clarity) {
        let video = this.state.video;
        video.extMap.clarity = clarity;
        this.setState({
            video
        });
    }
    cornerMarkChange(cornerMark) {
        let video = this.state.video;
        video.extMap.sign = cornerMark;
        this.setState({
            video
        });
    }
}
const Detail = Form.create({})(DetailComponent);
export default Detail;
