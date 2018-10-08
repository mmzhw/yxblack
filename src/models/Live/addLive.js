import React, { Component } from 'react';
import style from './liveDetail.module.css';
import InputRow from '../../components/FormRow/InputRow';
import SelRow from '../../components/FormRow/SelRow';
import DPRow from '../../components/FormRow/DPRow';
import yxFetch from '../../utils/fetch';
import { Button, Form, message } from 'antd';
import Upload from '../../components/Upload';
import * as urls from '../../constants/urls';
import { REQ_URL } from '../../constants/constants';

class Addlive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            liveValue: {
                title: '',
                subTitle: '',
                organizer: '',
                partner: '',
                location: '',
                detail: '',
                schedule: '',
                shareTitle: '',
                shareSubTitle: '',
                scheduleTime: Date.parse(new Date()),
                displayImageUrl: '',
                bigBackImageUrl: '',
                shareImageUrl: '',
                warmUpVideo: {},
                warmUpVideoBaseIds: [],
            },
            suggestions: [], // 输入关键字搜索时 出现的list
        };
        // this.handleOrganizerChange = this.handleOrganizerChange.bind(this)
        // this.handleTitleChange = this.handleTitleChange.bind(this)
        // this.handleSubTitleChange = this.handleSubTitleChange.bind(this)
        // this.handlePartnerChange = this.handlePartnerChange.bind(this)
        // this.handleLocationChange = this.handleLocationChange.bind(this)
        // this.handleDetailChange = this.handleDetailChange.bind(this)
        // this.handleScheduleChange = this.handleScheduleChange.bind(this)
        // this.handleShareTitleChange = this.handleShareTitleChange.bind(this)
        // this.handleShareSubTitleChange = this.handleShareSubTitleChange.bind(this)
        this.handleScheduleTimeChange = this.handleScheduleTimeChange.bind(this);
        this.submitInformation = this.submitInformation.bind(this);
        this.warmUpVideoChange = this.warmUpVideoChange.bind(this);
        this.idInSuggestions = this.idInSuggestions.bind(this);
        this.appendSuggestions = this.appendSuggestions.bind(this);
        this.appendSuggestion = this.appendSuggestion.bind(this);
        this.fetchSuggestions = this.fetchSuggestions.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.setWarmUpVideos = this.setWarmUpVideos.bind(this);
        this.setWarmUpVideo = this.setWarmUpVideo.bind(this);
        this.getWarmUpVideo = this.getWarmUpVideo.bind(this);
    }
    // handleTitleChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.title = value
    //   this.setState({
    //     liveValue,
    //   })
    // }
    // handleSubTitleChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.subTitle = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleOrganizerChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.organizer = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handlePartnerChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.partner = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleLocationChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.location = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleDetailChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.detail = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleScheduleChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.schedule = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleShareTitleChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.shareTitle = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleShareSubTitleChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.shareSubTitle = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    handleScheduleTimeChange(value) {
        let liveValue = this.state.liveValue;
        liveValue.scheduleTime = value;
        this.setState({
            liveValue
        });
    }
    submitInformation() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let liveDetail = this.state.liveValue;
            yxFetch(REQ_URL.CREATE_LIVEROOM, {
                title: values.title,
                subTitle: values.subTitle,
                organizer: values.organizer,
                partner: values.partner,
                location: values.location,
                detail: values.detail,
                schedule: values.schedule,
                shareTitle: values.shareTitle,
                shareSubTitle: values.shareSubTitle,
                scheduleTime: liveDetail.scheduleTime,
                displayImageUrl: liveDetail.displayImageUrl,
                bigBackImageUrl: liveDetail.bigBackImageUrl,
                shareImageUrl: liveDetail.shareImageUrl,
                warmUpVideo: liveDetail.warmUpVideo,
            }).then(res => {
                if (res.code === 0) {
                    this.setState({
                        roomId: res.data
                    });
                    this.props.match.history.push(`${urls.LIVE_LIST}/liveDetail/${res.data}`);
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('上架失败！');
                }
            }).catch(e => {
                console.log(e);
            });
        });
    }
    warmUpVideoChange(videoIds) {
        let liveValue = this.state.liveValue;
        liveValue.warmUpVideoBaseIds = videoIds;
        this.setWarmUpVideos(videoIds);
        this.setState({
            liveValue
        });
    }
    setWarmUpVideos(videoIds) {
        let len = videoIds.length;
        for (let i = 0; i < len; i++) {
            this.setWarmUpVideo(videoIds[i]);
        }
    }
    setWarmUpVideo(videoId) {
        let liveValue = this.state.liveValue;
        let warmUpVideo = liveValue.warmUpVideo;
        warmUpVideo[videoId.key] = this.getWarmUpVideo(videoId)['name'];
        this.setState({
            liveValue
        });
    }
    getWarmUpVideo(videoId) {
        let suggestions = this.state.suggestions;
        let len = suggestions.length;
        for (let i = 0; i < len; i++) {
            if (suggestions[i].videoBaseId === videoId.key) return suggestions[i];
        }
    }
    idInSuggestions(id) {
        let suggestions = this.state.suggestions;
        let len = suggestions.length;
        for (let i = 0; i < len; i++) {
            if (suggestions[i].videoBaseId === id) return true;
        }
        return false;
    }
    appendSuggestions() {
        let warmUpIds = this.state.liveValue.warmUpVideoBaseIds;
        let idLen = warmUpIds.length;
        for (let i = 0; i < idLen; i++) {
            if (!this.idInSuggestions(warmUpIds[i])) {
                this.appendSuggestion(warmUpIds[i]);
            }
        }
    }
    appendSuggestion(videoBaseId) {
        yxFetch(REQ_URL.GET_VIDEO_INFO, {
            videoBaseId: videoBaseId.key
        })
            .then(res => {
                if (res.code === 0) {
                    let suggestions = this.state.suggestions;
                    suggestions.push(res.data);
                    this.setState({
                        suggestions
                    });
                }
            }).catch(({ res }) => {
                message.error('系统错误');
            });
    }
    fetchSuggestions(word) {
        const keyword = word;
        if (keyword.trim().length === 0) return;
        yxFetch(REQ_URL.SEARCH_VIDEO_LISTS, {
            page: 1,
            size: 200,
            status: 2,
            name: keyword
        })
            .then(res => {
                if (res.code === 0) {
                    let suggestions = res.data.videoBaseCards;
                    this.setState({
                        suggestions
                    }, this.appendSuggestions);
                }
            }).catch(({ res }) => {
                message.error('系统错误');
            });
    }
    uploadDone(scale, url) {
        let liveValue = this.state.liveValue;
        if (scale === 1) {
            liveValue.shareImageUrl = url;
        } else if (scale === 2) {
            liveValue.displayImageUrl = url;
        } else if (scale === 7) {
            liveValue.bigBackImageUrl = url;
        }
        this.setState({
            liveValue
        });
    }
    render() {
        return (
            <div>
                <div className={style['title']}>基础信息</div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'title'
                        label = '标题'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.title }
                        /* onChangeHandle = { this.handleTitleChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入标题'
                        required = { true }
                        maxlength = { 100 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'subTitle'
                        label = '二级标题'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.subTitle }
                        /* onChangeHandle = { this.handleSubTitleChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入二级标题'
                        maxlength = { 100 }
                    />
                </div>
                <div className={style['input-item']}>
                    <InputRow
                        id = 'organizer'
                        label = '主办单位'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.organizer }
                        /* onChangeHandle = { this.handleOrganizerChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        maxlength = { 200 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'partner'
                        label = '合作单位'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.partner }
                        /* onChangeHandle = { this.handlePartnerChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        maxlength = { 200 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'location'
                        label = '活动地点'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.location }
                        /* onChangeHandle = { this.handleLocationChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        maxlength = { 200 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'detail'
                        label = '活动详情'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.detail }
                        /* onChangeHandle = { this.handleDetailChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        maxlength = { 1000 }
                    />
                </div>
                <div className={style['input-item']}>
                    <InputRow
                        id = 'schedule'
                        label = '活动时间表'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.schedule }
                        /* onChangeHandle = { this.handleScheduleChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        maxlength = { 1000 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <DPRow
                        id = 'scheduleTime'
                        label = '预计时间'
                        initialValue = { this.state.liveValue.scheduleTime }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        format = 'YYYY-MM-DD HH:mm:ss'
                        showTime = { true }
                        onChange = { this.handleScheduleTimeChange }
                        required = { true }
                    />
                </div>
                <div className={ style['title'] }>预热视频</div>
                <div className={ style['input-item'] }>
                    <SelRow
                        id = 'warmUpVideoBaseIds'
                        label = '预热视频'
                        wrapperCol = { 12 }
                        mode = 'multiple'
                        initialValue = { this.state.liveValue.warmUpVideoBaseIds }
                        labelInValue
                        onChange = { this.warmUpVideoChange }
                        onSearch = { this.fetchSuggestions }
                        filterOption = { false }
                        selList = { this.state.suggestions }
                        optVal = 'videoBaseId'
                        optLabel = 'name'
                        formEle = { Form }
                        formMethods = { this.props.form }
                    />
                </div>
                <div className={ style['title'] }>分享配置</div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'shareTitle'
                        label = '一级标题'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.shareTitle }
                        /* onChangeHandle = { this.handleShareTitleChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入一级标题'
                        required = { true }
                        maxlength = { 40 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'shareSubTitle'
                        label = '二级标题'
                        wrapperCol = { 12 }
                        initialValue = { this.state.liveValue.shareSubTitle }
                        /* onChangeHandle = { this.handleShareSubTitleChange } */
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入二级标题'
                        required = { true }
                        maxlength = { 40 }
                    />
                </div>
                <p className={ style['title']}>封面图</p>
                <Upload
                    uploadDone = {this.uploadDone}
                    showImgUrl = {this.state.liveValue.shareImageUrl}
                    imgScale = { 1 }
                    imgScaleText = '图片比例1:1'
                    figureWidth = { 260 }
                    figureHeight = { 260 }
                />
                <Upload
                    uploadDone = {this.uploadDone}
                    showImgUrl = {this.state.liveValue.displayImageUrl}
                    imgScale = { 2 }
                    imgScaleText = '图片比例16:9'
                    figureWidth = { 260 }
                    figureHeight = { 146 }
                />
                <Upload
                    uploadDone = {this.uploadDone}
                    showImgUrl = {this.state.liveValue.bigBackImageUrl}
                    imgScale = { 7 }
                    imgScaleText = '图片高度790px，宽度不低于1280px'
                />
                <br/>
                <div>
                    <Button type='primary' onClick={ this.submitInformation } >提交信息</Button>
                </div>
            </div>
        );
    }
}

const add = Form.create({})(Addlive);
export default add;

