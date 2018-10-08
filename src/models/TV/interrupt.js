import React, { Component } from 'react';
import style from './queueSet.module.css';
import InputRow from '../../components/FormRow/InputRow';
import RadioRow from '../../components/FormRow/RadioRow';
import DPRow from '../../components/FormRow/DPRow';
import { Form, Button, message } from 'antd';
import fetch from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { REQ_URL } from '../../constants/constants';

class Interrupt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interrupt: {
                name: '',
                url: '',
                onlineWay: 'handle',
                replay: 'yes',
            },
            scheduleTime: (Date.parse(new Date())) + 86400000,
            onlineWayMap: {
                'handle': '手动上线',
                'time': '定时上线'
            },
            replayMap: {
                'yes': '是',
                'no': '否'
            }
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.onlineWayChange = this.onlineWayChange.bind(this);
        this.replayChange = this.replayChange.bind(this);
        this.handleSetTimeChange = this.handleSetTimeChange.bind(this);
        this.submitInfo = this.submitInfo.bind(this);
    }

    componentWillMount() {
        this.props.match.match.params.id && this.fetchInterrupt(this.props.match.match.params.id);
    }

    fetchInterrupt(id) {
        fetch(REQ_URL.TV_VIDEO, {
            cutVideoId: id
        }).then(res => {
            if (res.code === 0) {
                let interrupt = this.state.interrupt;
                interrupt.name = res.data.cutVideoName;
                interrupt.url = res.data.cutResourceUrl;
                interrupt.onlineWay = res.data.onlineType === 1 ? 'handle' : 'time';
                interrupt.replay = res.data.carouselFlag === 1 ? 'yes' : 'no';
                this.setState({
                    interrupt,
                });
                if (res.data.scheduleTime) {
                    const scheduleTime = res.data.scheduleTime;
                    this.setState({
                        scheduleTime,
                    });
                }
            }
        }).catch((res) => {
            message.error('系统错误');
        });
    }

    handleNameChange(value) {
        let interrupt = this.state.interrupt;
        interrupt.name = value;
        this.setState({
            interrupt
        });
    }
    handleUrlChange(value) {
        let interrupt = this.state.interrupt;
        interrupt.url = value;
        this.setState({
            interrupt
        });
    }
    onlineWayChange(value) {
        let interrupt = this.state.interrupt;
        interrupt.onlineWay = value;
        this.setState({
            interrupt
        });
    }
    replayChange(value) {
        let interrupt = this.state.interrupt;
        interrupt.replay = value;
        this.setState({
            interrupt
        });
    }
    handleSetTimeChange(value) {
        if (value <= Date.parse(new Date())) {
            message.error('不能选择过去的时间');
        } else {
            this.setState({
                scheduleTime: value
            });
        }
    }
    submitInfo() {
        const reqUrl = this.props.match.match.params.id ? REQ_URL.EDIT_TV_VIDEO : REQ_URL.ADD_TV_VIDEO;
        this.props.form.validateFields((err, values) => {
            if (err) return;
            fetch(reqUrl, {
                cutVideoId: this.props.match.match.params.id,
                cutVideoName: this.state.interrupt.name,
                cutResourceUrl: this.state.interrupt.url,
                onlineType: this.state.interrupt.onlineWay === 'handle' ? 1 : 2,
                scheduleTime: this.state.scheduleTime,
                carouselFlag: this.state.interrupt.replay === 'yes' ? 1 : 0,
            }).then(res => {
                if (res.code === 0) {
                    this.props.match.history.push(`${urls.TV_ADMIN}`);
                } else {
                    res.errmsg ? message.error(res.errmsg) : message.error('提交失败！');
                }
            }).catch(e => {});
        });
    }

    render() {
        return (
            <div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'title'
                        label = '插播名称'
                        wrapperCol = { 16 }
                        initialValue = { this.state.interrupt.name }
                        onChangeHandle = { this.handleNameChange }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入插播名称'
                        required = { true }
                        maxlength = { 50 }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <InputRow
                        id = 'url'
                        label = '视频源'
                        wrapperCol = { 16 }
                        initialValue = { this.state.interrupt.url }
                        onChangeHandle = { this.handleUrlChange }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入视频源'
                        required = { true }
                    />
                </div>
                <div className={ style['input-item'] }>
                    <RadioRow
                        id = 'onlineWay'
                        radioMap = { this.state.onlineWayMap }
                        label = '上线方式'
                        formEle = { Form }
                        initialValue = { this.state.interrupt.onlineWay }
                        formMethods = { this.props.form }
                        onChange = { this.onlineWayChange }
                        wrapperCol = { 6 }
                    />
                </div>
                {
                    this.state.interrupt.onlineWay === 'handle' ? null : <div className={ style['input-item'] }>
                        <DPRow
                            id = 'scheduleTime'
                            initialValue = { this.state.scheduleTime }
                            label = '定时时间'
                            formEle = { Form }
                            formMethods = { this.props.form }
                            format = 'YYYY-MM-DD HH:mm:ss'
                            showTime = { true }
                            onChange = { this.handleSetTimeChange }
                            allowClear = { false }
                        />
                    </div>
                }
                <div className={ style['input-item'] }>
                    <RadioRow
                        id = 'replay'
                        radioMap = { this.state.replayMap }
                        label = '轮播'
                        formEle = { Form }
                        initialValue = { this.state.interrupt.replay }
                        formMethods = { this.props.form }
                        onChange = { this.replayChange }
                        wrapperCol = { 6 }
                    />
                </div>
                <div>
                    <Button type='primary' onClick={this.submitInfo}>提交</Button>
                </div>
            </div>
        );
    }
}

const interrupt = Form.create({})(Interrupt);
export default interrupt;
