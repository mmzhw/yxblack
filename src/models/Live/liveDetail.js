import React, { Component } from 'react';
import InputRow from '../../components/FormRow/InputRow';
import SelRow from '../../components/FormRow/SelRow';
import DPRow from '../../components/FormRow/DPRow';
import { Button, message, Popconfirm, Modal, Form } from 'antd';
import yxFetch from '../../utils/fetch';
// import YXVideo from '../../components/Video'
// import YXVideoM3u8 from '../../components/Video/videoM3u8'
// import { Player, BigPlayButton, LoadingSpinner, ControlBar, PlayToggle, VolumeMenuButton } from 'video-react'
import YXVideojs from '../../components/Video/video.js';
import style from './liveDetail.module.css';
import Upload from '../../components/Upload';
import { videoPrefix, imgPrefix } from '../../utils/index';
import { REQ_URL } from '../../constants/constants';
const confirm = Modal.confirm;

class LiveDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            edit: false,
            shelfVisible: false,
            playerVisible: false,
            updateVisible: false,
            roomId: this.props.match.match.params.id,
            liveValue: {
                rtmpPublishUrl: '',
                rtmpPlayUrl: '',
                hlsPlayUrl: '',
                hdlPlayUrl: '',
                playbackUrl: '',
                title: '',
                subTitle: '',
                organizer: '',
                partner: '',
                location: '',
                detail: '',
                schedule: '',
                scheduleTime: '',
                shareTitle: '',
                shareSubTitle: '',
                displayImageUrl: '',
                bigBackImageUrl: '',
                shareImageUrl: '',
                warmUpVideoBaseIds: [],
            },
            watching: '',
            videoSources: [{
                src: '',
                type: 'application/x-mpegURL',
            }],
            poster: '',
            suggestions: [], // 输入关键字搜索时 出现的list
        };
        // this.handleTitleChange = this.handleTitleChange.bind(this)
        // this.handleSubTitleChange = this.handleSubTitleChange.bind(this)
        // this.handleOrganizerChange = this.handleOrganizerChange.bind(this)
        // this.handleHLSPlayChange = this.handleHLSPlayChange.bind(this)
        // this.handleRTMPPlayChange = this.handleRTMPPlayChange.bind(this)
        // this.handleHDLPlayChange = this.handleHDLPlayChange.bind(this)
        // this.handlePartnerChange = this.handlePartnerChange.bind(this)
        // this.handleLocationChange = this.handleLocationChange.bind(this)
        // this.handleDetailChange = this.handleDetailChange.bind(this)
        // this.handleScheduleChange = this.handleScheduleChange.bind(this)
        this.handleScheduleTimeChange = this.handleScheduleTimeChange.bind(this);
        // this.handleShareTitleChange = this.handleShareTitleChange.bind(this)
        // this.handleShareSubTitleChange = this.handleShareSubTitleChange.bind(this)

        this.updateLiveDetail = this.updateLiveDetail.bind(this);
        this.subLiveDetail = this.subLiveDetail.bind(this);
        this.enterEdit = this.enterEdit.bind(this);
        this.exitEdit = this.exitEdit.bind(this);
        this.togglePlayBack = this.togglePlayBack.bind(this);
        this.liveManage = this.liveManage.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleLiveEnd = this.handleLiveEnd.bind(this);
        this.handlePlayerClose = this.handlePlayerClose.bind(this);
        this.toggleShelf = this.toggleShelf.bind(this);
        this.offShelfConfirm = this.offShelfConfirm.bind(this);
        this.offShelfCancel = this.offShelfCancel.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.warmUpVideoChange = this.warmUpVideoChange.bind(this);
        this.fetchSuggestions = this.fetchSuggestions.bind(this);
    }
    upWatch() {
        let watch = {
            liveRoomId: this.state.roomId,
            watching: Number(document.getElementById('liveDetail_watching').value),
        };
        console.log(watch.watching);
        if (watch.watching) {
            if (watch.watching > 900000000) {
                message.error('输入数字超过阈值！');
                return;
            }
            yxFetch('/m_web/liveRoom/addWatchingUsers', watch).then(res => {
                if (res.code === 0) {
                    message.success('更新成功');
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('更新失败！');
                }
            }).catch(({ res }) => {
                message.error('系统错误');
            });
        } else {
            message.error('请输入数字！');
        }
    }
    updateLiveDetail() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let liveDetail = this.state.liveValue;
            let liveToUpdate = {
                liveRoomId: this.state.roomId,
                title: values.title,
                subTitle: values.subTitle,
                organizer: values.organizer,
                partner: values.partner,
                location: values.location,
                detail: values.detail,
                schedule: values.schedule,
                scheduleTime: liveDetail.scheduleTime,
                shareTitle: values.shareTitle,
                shareSubTitle: values.shareSubTitle,
                displayImageUrl: liveDetail.displayImageUrl,
                bigBackImageUrl: liveDetail.bigBackImageUrl,
                shareImageUrl: liveDetail.shareImageUrl,
                hlsPlayUrl: values.hlsPlayUrl,
                rtmpPlayUrl: values.rtmpPlayUrl,
                hdlPlayUrl: values.hdlPlayUrl,
            };

            yxFetch(REQ_URL.UPDATE_LIVEROOM, liveToUpdate).then(res => {
                if (res.code === 0) {
                    this.setState({
                        edit: false,
                    });
                    message.success('编辑成功');
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('编辑失败！');
                }
            }).catch(({ res }) => {
                message.error('系统错误');
            });
        });
    }
    subLiveDetail(e) {
        e.preventDefault();
        let that = this;
        if (this.state.liveValue.roomStatus) {
            confirm({
                content: '直播视频信息发生变化，确认保存更新？',
                onOk() {
                    that.updateLiveDetail();
                },
                onCancel() {},
            });
        } else {
            this.updateLiveDetail();
        }
    }
    componentWillMount() {
        this.fetchLiveDetail(this.props.match.match.params.id);
    }
    // componentDidUpdate(prevProps, prevState) {
    //   if (this.state.videoUrl !== prevState.videoUrl) {
    //     this.refs.videoPlayer.load()
    //   }
    // }
    fetchLiveDetail(id) {
        yxFetch(REQ_URL.VIEW_LIVEROOM, {
            liveRoomId: id
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    liveValue: res.data
                }, this.appendSuggestions);
            }
        }).catch(({ res }) => {
            message.error('系统错误');
        });
    }
    // handleTitleChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.title = value
    //   this.setState({
    //     liveValue
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
    // handleRTMPPlayChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.rtmpPlayUrl = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleHLSPlayChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.hlsPlayUrl = value
    //   this.setState({
    //     liveValue
    //   })
    // }
    // handleHDLPlayChange(value) {
    //   let liveValue = this.state.liveValue
    //   liveValue.hdlPlayUrl = value
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
    handleScheduleTimeChange(value) {
        let liveValue = this.state.liveValue;
        liveValue.scheduleTime = value;
        this.setState({
            liveValue
        });
    }
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
    enterEdit() {
        this.setState({
            edit: true
        });
    }
    exitEdit() {
        this.setState({
            edit: false
        });
    }
    togglePlayBack() {
        if (!this.state.liveValue.playbackStatus) {
            yxFetch(REQ_URL.ENABLE_LIVEROOM, {
                liveRoomId: this.state.roomId
            }).then(res => {
                if (res.code === 0) {
                    let liveValue = this.state.liveValue;
                    liveValue.playbackStatus = 1;
                    this.setState({
                        liveValue
                    });
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('开启失败！');
                }
            }).catch(({ res }) => {
                message.error('系统错误！');
            });
        } else {
            yxFetch(REQ_URL.DIPLAY_LIVEROOM, {
                liveRoomId: this.state.roomId
            }).then(res => {
                if (res.code === 0) {
                    let liveValue = this.state.liveValue;
                    liveValue.playbackStatus = 0;
                    this.setState({
                        liveValue
                    });
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('关闭失败！');
                }
            }).catch(({ res }) => {
                message.error('系统错误！');
            });
        }
    }
    liveManage() {
    // 0-直播中，1-即将开始，2-直播结束
        if (this.state.liveValue.liveStatus === 1) {
            if (this.state.suggestions.length > 0) {
                this.setState({
                    videoSources: [{
                        src: videoPrefix + this.state.suggestions[0].vVideoDetailRspVos[0].videoResourceStatusVo.m3u8Clarity.url,
                        type: 'application/x-mpegURL',
                    }],
                });
            }
        } else if (this.state.liveValue.liveStatus === 0) {
            this.setState({
                videoSources: [{
                    src: this.state.liveValue.hlsPlayUrl,
                    type: 'application/x-mpegURL',
                }],
            });
        } else if (this.state.liveValue.liveStatus === 2) {
            this.setState({
                videoSources: [{
                    src: this.state.liveValue.playbackUrl,
                    type: 'application/x-mpegURL',
                }],
            });
        }
        this.setState({
            playerVisible: true,
            poster: imgPrefix + this.state.liveValue.shareImageUrl,
        });
    }
    handleLiveEnd() {
        let that = this;
        confirm({
            content: '确认要结束直播？',
            onOk() {
                yxFetch(REQ_URL.UPDATE_STATUS_TO_END, {
                    liveRoomId: that.state.roomId
                }).then(res => {
                    if (res.code === 0) {
                        let liveValue = that.state.liveValue;
                        liveValue.liveStatus = 2;
                        liveValue.playbackUrl = res.data.playbackUrl;
                        that.setState({
                            liveValue
                        });
                        if (that.state.liveValue.playbackStatus) {
                            that.setState({
                                videoSources: [{
                                    src: res.data.playbackUrl,
                                    type: 'application/x-mpegURL',
                                }],
                            });
                        } else {
                            that.setState({
                                videoSources: [{
                                    src: '',
                                    type: '',
                                }],
                            });
                        }
                    } else {
                        res.errmsg ? message.error(res.errmsg) : message.error('结束失败！');
                    }
                });
            },
            onCancel() {},
        });
    }
    handlePlay() {
    // 0-直播中，1-即将开始，2-直播结束
        if (this.state.liveValue.liveStatus === 1) {
            let that = this;
            confirm({
                content: '确认要开始直播？',
                onOk() {
                    yxFetch(REQ_URL.UPDATE_STATUS_TO_LIVING, {
                        liveRoomId: that.state.roomId
                    }).then(res => {
                        if (res.code === 0) {
                            let liveValue = that.state.liveValue;
                            liveValue.liveStatus = 0;
                            that.setState({
                                liveValue
                            });
                            that.liveManage();
                        } else {
                            res.errmsg ? message.error(res.errmsg) : message.error('开始失败！');
                        }
                    });
                }
            });
        } else if (this.state.liveValue.liveStatus === 0) {
            let that = this;
            confirm({
                content: '确认要暂停直播？',
                onOk() {
                    yxFetch(REQ_URL.UPDATE_STATUS, {
                        liveRoomId: that.state.roomId,
                        liveStatus: 1
                    }).then(res => {
                        if (res.code === 0) {
                            let liveValue = that.state.liveValue;
                            liveValue.liveStatus = 1;
                            that.setState({
                                liveValue
                            });
                            that.liveManage();
                        } else {
                            res.errmsg ? message.error(res.errmsg) : message.error('暂停失败！');
                        }
                    });
                }
            });
        }
    }
    handlePlayerClose() {
        this.setState({
            playerVisible: false,
            videoSources: [{
                src: '',
                type: 'application/x-mpegURL',
            }],
        });
    }
    toggleShelf() {
        if (this.state.liveValue.roomStatus === 0) {
            if (this.state.liveValue.displayImageUrl) {
                yxFetch(REQ_URL.ONSHELF_LIVEROOM, {
                    liveRoomId: this.state.roomId
                }).then(res => {
                    if (res.code === 0) {
                        let liveValue = this.state.liveValue;
                        liveValue.roomStatus = 1;
                        this.setState({
                            liveValue
                        });
                    } else {
                        res.errmsg ? message.error(res.errmsg) : message.error('上架失败！');
                    }
                }).catch(({ res }) => {
                    message.error('系统错误！');
                });
            } else {
                message.error('上架失败，封面没有上传');
            }
        } else {
            this.setState({
                shelfVisible: true
            });
        }
    }
    offShelfConfirm() {
        yxFetch(REQ_URL.OFFSHELF_LIVEROOM, {
            liveRoomId: this.state.roomId
        }).then(res => {
            if (res.code === 0) {
                let liveValue = this.state.liveValue;
                liveValue.roomStatus = 0;
                this.setState({
                    liveValue
                });
            } else {
                res.errmsg ? message.error(res.errmsg) : message.error('下架失败！');
            }
        }).catch(({ res }) => {
            message.error('系统错误！');
        });
        this.setState({
            shelfVisible: false
        });
    }
    offShelfCancel() {
        this.setState({
            shelfVisible: false
        });
    }
    warmUpVideoChange(videoIds) {
        let liveValue = this.state.liveValue;
        liveValue.warmUpVideoBaseIds = videoIds;
        this.setState({
            liveValue
        });
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
            videoBaseId
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
                //
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
                //
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
                <div className={ style['video-oper-wrap'] }>
                    <Button disabled={ this.state.liveValue.liveStatus !== 2 } onClick={ this.togglePlayBack }>{ this.state.liveValue.playbackStatus ? '关闭回放' : '开启回放' }</Button>
                    <Button onClick={ this.liveManage }>直播管理</Button>
                    <Popconfirm title='下架后，用户将无法再观看该直播视频！' visible={ this.state.shelfVisible } onConfirm={ this.offShelfConfirm } onCancel={ this.offShelfCancel } okText='确认' cancelText='取消'>
                        <Button type='primary' onClick={this.toggleShelf}>{ this.state.liveValue.roomStatus ? '下架' : '上架' }</Button>
                    </Popconfirm>
                    <Modal
                        title='直播管理'
                        visible={ this.state.playerVisible }
                        onCancel={ this.handlePlayerClose }
                        onOk={ this.handlePlay }
                        okText={ this.state.liveValue.liveStatus === 1 ? '开始' : this.state.liveValue.liveStatus === 2 ? '已结束' : '结束' }
                        maskClosable={ false }
                        width={ 800 }
                        footer={[
                            <Button size='large' onClick={this.handlePlayerClose}>关闭</Button>,
                            <Button type='primary' size='large' onClick={this.handlePlay}>{this.state.liveValue.liveStatus === 1 ? '开始' : this.state.liveValue.liveStatus === 2 ? '已结束' : '暂停'}</Button>,
                            <Button style={{ float: 'left' }} type='danger' size='large' onClick={this.handleLiveEnd}>结束</Button>,
                        ]}
                    >
                        <YXVideojs sources={this.state.videoSources} poster={this.state.poster} />
                    </Modal>
                </div>
                { this.state.edit ? '' : <div><Button type='primary' onClick={this.enterEdit}>编辑</Button><Button style={{ marginLeft: '20px' }} type='primary' onClick={this.upWatch.bind(this)}>更新观看人数</Button></div> }

                <Form className='' onSubmit={ this.subLiveDetail }>
                    { this.state.edit ? <div className={ style['video-detail-edit'] }>
                        <Button type='primary' htmlType='submit'>保存</Button>
                        <Button onClick={this.exitEdit}>取消</Button>
                    </div> : '' }
                    <div className={style['title']}>基础信息</div>
                    <div className={style['input-item']}>
                        <InputRow
                            id = 'roomId'
                            label = '房间号'
                            initialValue = { this.state.roomId }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { true }
                        />
                    </div>
                    <div className={style['input-item']}>
                        <InputRow
                            id = 'liveDetail_watching'
                            label = '观看人数'
                            initialValue = { this.state.watching }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { false }
                        />
                    </div>
                    <div className={ style['input-item'] }>
                        <InputRow
                            id = 'rtmpPublishUrl'
                            label = 'RTMP推流'
                            wrapperCol = { 12 }
                            initialValue = { this.state.liveValue.rtmpPublishUrl }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { true }
                        />
                    </div>
                    <div className={style['input-item']}>
                        <InputRow
                            id = 'rtmpPlayUrl'
                            label = 'RTMP播流'
                            wrapperCol = { 12 }
                            /* onChangeHandle = { this.handleRTMPPlayChange } */
                            initialValue = { this.state.liveValue.rtmpPlayUrl}
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { !this.state.edit }
                        />
                    </div>
                    <div className={ style['input-item'] }>
                        <InputRow
                            id = 'hlsPlayUrl'
                            label = 'HLS播流'
                            wrapperCol = { 12 }
                            /* onChangeHandle = { this.handleHLSPlayChange } */
                            initialValue = { this.state.liveValue.hlsPlayUrl }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { !this.state.edit }
                        />
                    </div>
                    <div className={ style['input-item'] }>
                        <InputRow
                            id = 'hdlPlayUrl'
                            label = 'HDL播流'
                            wrapperCol = { 12 }
                            /* onChangeHandle = { this.handleHDLPlayChange } */
                            initialValue = { this.state.liveValue.hdlPlayUrl }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { !this.state.edit }
                        />
                    </div>
                    <div className={ style['input-item'] }>
                        <InputRow
                            id = 'playbackUrl'
                            label = '回放地址'
                            wrapperCol = { 12 }
                            initialValue = { this.state.liveValue.playbackUrl }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { true }
                        />
                    </div>
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
                            disabled = { !this.state.edit }
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
                            disabled = { !this.state.edit }
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
                            disabled = { !this.state.edit }
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
                            disabled = { !this.state.edit }
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
                            disabled = { !this.state.edit }
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
                            disabled = { !this.state.edit }
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
                            disabled = { !this.state.edit }
                            maxlength = { 1000 }
                        />
                    </div>
                    <div className={ style['input-item'] }>
                        <DPRow
                            id = 'scheduleTime'
                            label = '预计时间'
                            style = {{ width: 170 }}
                            initialValue = { this.state.liveValue.scheduleTime }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            format = 'YYYY-MM-DD HH:mm:ss'
                            disabled = { !this.state.edit }
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
                            onChange = { this.warmUpVideoChange }
                            onSearch = { this.fetchSuggestions }
                            filterOption = { false }
                            selList = { this.state.suggestions }
                            optVal = 'videoBaseId'
                            optLabel = 'name'
                            formEle = { Form }
                            formMethods = { this.props.form }
                            disabled = { true }
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
                            disabled = { !this.state.edit }
                            maxlength = { 40 }
                            required = { true }
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
                            disabled = { !this.state.edit }
                            maxlength = { 40 }
                            required = { true }
                        />
                    </div>
                    <div className={ style['title'] }>封面图</div>
                    <div className={ style['']}>
                        <Upload
                            showImgUrl={ this.state.liveValue.shareImageUrl }
                            uploadDone = { this.uploadDone }
                            imgScale = { 1 }
                            imgScaleText = '图片比例1:1'
                            figureWidth = { 260 }
                            figureHeight = { 260 }
                            disabled = { !this.state.edit }
                            maxlength = { 40 }
                        />
                        <Upload
                            showImgUrl={ this.state.liveValue.displayImageUrl }
                            uploadDone = { this.uploadDone }
                            imgScale = { 2 }
                            imgScaleText = '图片比例16:9'
                            figureWidth = { 260 }
                            figureHeight = { 146 }
                            disabled = { !this.state.edit }
                        />
                        <Upload
                            showImgUrl={ this.state.liveValue.bigBackImageUrl }
                            uploadDone = { this.uploadDone }
                            imgScale = { 7 }
                            imgScaleText = '图片高度790px，宽度不低于1280px'
                            disabled = { !this.state.edit }
                        />
                    </div>
                </Form>
            </div>
        );
    }
}

const Detail = Form.create({})(LiveDetail);
export default Detail;
