import React, { Component } from 'react';
// import InputRow from '../../components/FormRow/InputRow'
import style from './queueSet.module.css';
// import DPRow from '../../components/FormRow/DPRow'
import { Form, AutoComplete, Checkbox, Row, Col, Button, message, DatePicker, Input } from 'antd';
import fetch from '../../utils/fetch';
import { imgPrefix } from '../../utils/index';
import * as urls from '../../constants/urls';
import { transPlayTime } from '../../utils/time';
import moment from 'moment';
import { REQ_URL } from '../../constants/constants';

const Option = AutoComplete.Option;

class QueueSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            queueSet: {
                name: '',
                scheduleTime: this.props.match.location.state ? this.props.match.location.state.scheduleTime : undefined,
            },
            videoData: [],
            secondVideoData: [],
            checkedVideo: [],
            selectedVideo: [],
            checkAll: false,
            indeterminate: false,
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.onVideoSelect = this.onVideoSelect.bind(this);
        this.videoSearch = this.videoSearch.bind(this);
        this.onSecondVideoChange = this.onSecondVideoChange.bind(this);
        this.onSelectVideo = this.onSelectVideo.bind(this);
        this.deleteVideo = this.deleteVideo.bind(this);
        this.moveupVideo = this.moveupVideo.bind(this);
        this.movedownVideo = this.movedownVideo.bind(this);
        this.submitInfo = this.submitInfo.bind(this);
        this.handleSetTimeChange = this.handleSetTimeChange.bind(this);
        this.onCheckAllChange = this.onCheckAllChange.bind(this);
    }

    componentWillMount() {
        this.props.match.match.params.id && this.fetchQueueSet(this.props.match.match.params.id);
    }

    fetchQueueSet(id) {
        fetch(REQ_URL.TV_OTT_QUEUE_DETAIL, {
            queueId: id
        }).then(res => {
            if (res.code === 0) {
                let queueSet = this.state.queueSet;
                queueSet.name = res.data.name;
                if (res.data.scheduleTime) {
                    queueSet.scheduleTime = res.data.scheduleTime;
                }
                this.setState({
                    queueSet,
                    selectedVideo: res.data.videos,
                    totalTime: res.data.totalDuration,
                });
            } else {
                res.errmsg && message.error(res.errmsg);
            }
        }).catch((res) => {
            message.error('系统错误');
        });
    }

    handleNameChange(e) {
        let queueSet = this.state.queueSet;
        queueSet.name = e.target.value;
        this.setState({
            queueSet,
        });
    }

    onCheckAllChange(e) {
        this.setState({
            checkedVideo: e.target.checked ? this.state.secondVideoData : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    onVideoSelect(value) {
        this.setState({
            keyword: value,
        });
        fetch(REQ_URL.VIDEO_DETAILS, {
            videoBaseId: value
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    secondVideoData: res.data.vVideoDetailRspVos
                });
            } else {
                res.errmsg && message.error(res.errmsg);
            }
        }).catch(e => {
            message.error('系统错误');
        });
    }

    videoSearch(value) {
        this.setState({
            keyword: value,
        });
        fetch(REQ_URL.SELECT_QUERY, {
            word: value
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    videoData: res.data.videos,
                    checkedVideo: [],
                });
            } else {
                res.errmsg && message.error(res.errmsg);
            }
        }).catch(e => {
            message.error('系统错误');
        });
    }

    onSecondVideoChange(checkedVideo) {
        this.setState({
            checkedVideo: checkedVideo,
            indeterminate: !!checkedVideo.length && (checkedVideo.length < this.state.secondVideoData.length),
            checkAll: checkedVideo.length === this.state.secondVideoData.length,
        });
    }

    onSelectVideo() {
        const tempVideo = this.state.selectedVideo.concat(this.state.checkedVideo);
        this.setState({
            selectedVideo: tempVideo,
            secondVideoData: [],
            checkAll: false,
            indeterminate: false,
            keyword: '',
        });
    }

    totalPlayTime() {
        let sum = 0;
        if (this.state.selectedVideo.length > 0) {
            this.state.selectedVideo.forEach((item) => {
                sum += item.duration;
            });
        }
        return sum;
    }

    deleteVideo(index) {
        this.state.selectedVideo.splice(index, 1);
        this.setState({
            selectedVideo: this.state.selectedVideo
        });
    }
    moveupVideo(index) {
        let selectedVideo = this.state.selectedVideo;
        let temp = selectedVideo[index];
        selectedVideo[index] = selectedVideo[index - 1];
        selectedVideo[index - 1] = temp;
        this.setState({
            selectedVideo: selectedVideo
        });
    }
    movedownVideo(index) {
        let selectedVideo = this.state.selectedVideo;
        let temp = selectedVideo[index];
        selectedVideo[index] = selectedVideo[index + 1];
        selectedVideo[index + 1] = temp;
        this.setState({
            selectedVideo: selectedVideo
        });
    }
    handleSetTimeChange(value, dataString) {
        if (Date.parse(dataString) <= Date.parse(new Date())) {
            message.error('不能选择过去的时间');
        } else {
            let queueSet = this.state.queueSet;
            queueSet.scheduleTime = Date.parse(dataString);
            this.setState({
                queueSet
            });
        }
    }

    transImg(images) {
        if (images.imageUrl) {
            return imgPrefix + images.imageUrl;
        } else if (images.images && images.images.length > 0) {
            let imgIndex;
            images.images.forEach((item, index) => {
                if (item.scale === 1) {
                    imgIndex = index;
                }
            });
            if (imgIndex || imgIndex === 0) {
                return imgPrefix + images.images[imgIndex].url;
            } else {
                return require('../../assets/none-16-9.png');
            }
        }
        return require('../../assets/none-16-9.png');
    }

    submitInfo() {
        const reqUrl = this.props.match.match.params.id ? REQ_URL.TV_OTT_QUEUE_UPDATE : REQ_URL.TV_OTT_QUEUE_CREATE;
        if (!this.state.queueSet.name) {
            message.error('请填写队列名称');
            return false;
        }
        if (this.state.selectedVideo.length === 0) {
            message.error('还没选择视频呢！');
            return false;
        }
        this.props.form.validateFields((err, values) => {
            if (err) return;
            this.state.selectedVideo.forEach((item) => {
                if (!item.type) {
                    item.type = 1;
                }
            });
            fetch(reqUrl, {
                queueId: this.props.match.match.params.id,
                name: this.state.queueSet.name,
                videos: this.state.selectedVideo,
                scheduleTime: this.state.queueSet.scheduleTime,
            }).then(res => {
                if (res.code === 0) {
                    this.props.match.history.push(`${urls.TV_ADMIN}`);
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('提交失败！');
                }
            }).catch(e => {
            });
        });
    }

    render() {
        return (
            <div>
                <div className={ style['input-item'] }>
                    <label className={ style['label'] }><strong className={ style['red'] }>*</strong>队列名称：</label>
                    <Input
                        id='title'
                        style={{ width: 400 }}
                        placeholder='请输入队列名称'
                        value={ this.state.queueSet.name }
                        maxLength = { 50 }
                        onChange = { this.handleNameChange }
                    />
                    {/* <InputRow
            id = 'title'
            label = '队列名称'
            initialValue = { this.state.queueSet.name }
            onChangeHandle = { this.handleNameChange }
            formEle = { Form }
            formMethods = { this.props.form }
            message = '请输入队列名称'
            required = { true }
            maxlength = { 50 }
          /> */}
                </div>
                <div className={ style['input-item'] }>
                    <label className={ style['label'] }>视频添加：</label>
                    <AutoComplete
                        value={this.state.keyword}
                        style={{ width: 400 }}
                        placeholder='搜索你想添加的视频'
                        onSelect={this.onVideoSelect}
                        onSearch={this.videoSearch}
                    >
                        {
                            this.state.videoData.map((item) => {
                                return <Option key={item.videoBaseId}>{item.name}</Option>;
                            })
                        }
                    </AutoComplete>
                </div>
                {
                    this.state.secondVideoData.length !== 0 ? <div className={ style['input-item'] }>
                        <label className={ style['label'] }>视频选择：</label>
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                        >全选</Checkbox>
                        <div style={{ marginLeft: 100 }}>
                            <Checkbox.Group onChange={this.onSecondVideoChange} value={this.state.checkedVideo}>
                                <Row>
                                    {
                                        this.state.secondVideoData.map((item, index) => {
                                            return <Col span={8} key={index}><Checkbox value={item}>{item.title}</Checkbox></Col>;
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                            <Button className={style['episode-submit']} onClick={this.onSelectVideo}>确定</Button>
                        </div>
                    </div> : null
                }
                {
                    this.state.selectedVideo.length !== 0 ? <div className={ style['input-item'] }>
                        <label className={ style['label'] }><strong className={ style['red'] }>*</strong>视频内容：</label>
                        <div className={ style['select-video-wrap'] }>
                            {
                                this.state.selectedVideo.map((item, index) => {
                                    return <div className={ style['select-video-item'] } key={index}>
                                        <img alt='' src={this.transImg(item)} width={200}/>
                                        <p style={{ textAlign: 'center' }}>{item.title}</p>
                                        <p style={{ textAlign: 'center' }}>{transPlayTime(item.duration)}</p>
                                        <div className={ style['video-oper'] }>
                                            <Button className={ style['video-oper-move'] } shape='circle' icon='arrow-up' onClick={this.moveupVideo.bind(null, index)} disabled={index === 0}></Button>
                                            <Button type='danger' shape='circle' icon='close' onClick={this.deleteVideo.bind(null, index)}></Button>
                                            <Button className={ style['video-oper-move'] } shape='circle' icon='arrow-down' onClick={this.movedownVideo.bind(null, index)} disabled={index === (this.state.selectedVideo.length - 1)}></Button>
                                        </div>
                                    </div>;
                                })
                            }
                        </div>
                    </div> : null
                }
                <div className={ style['input-item'] }>
                    <label className={ style['label'] }>总时长：</label>
                    <div style={{ display: 'inline-block' }}>{transPlayTime(this.totalPlayTime())}</div>
                </div>
                <div className={ style['input-item'] }>
                    <label className={ style['label'] }>定时播放：</label>
                    {
                        this.state.queueSet.scheduleTime ? <DatePicker
                            format = 'YYYY-MM-DD HH:mm:ss'
                            onChange = { this.handleSetTimeChange }
                            showTime = { true }
                            defaultValue = { moment(this.state.queueSet.scheduleTime) }
                        /> : <DatePicker
                            format = 'YYYY-MM-DD HH:mm:ss'
                            onChange = { this.handleSetTimeChange }
                            showTime = { true }
                        />
                    }
                    {/* <DPRow
            id = 'scheduleTime'
            label = '定时播放'
            initialValue = { this.state.queueSet.scheduleTime }
            formEle = { Form }
            formMethods = { this.props.form }
            format = 'YYYY-MM-DD HH:mm:ss'
            showTime = { true }
            onChange = { this.handleSetTimeChange }
          /> */}
                </div>
                <div>
                    <Button type='primary' onClick={this.submitInfo}>提交</Button>
                </div>
            </div>
        );
    }
}

const queue = Form.create({})(QueueSet);
export default queue;
