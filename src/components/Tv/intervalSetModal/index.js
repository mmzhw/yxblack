import React, { Component } from 'react';
import { Modal, Form, Button, message } from 'antd';
import SelRow from '../../../components/FormRow/SelRow';
import yxFetch from '../../../utils/fetch';
import style from './index.module.css';
import { transPlayTime } from '../../../utils/time';
import { REQ_URL } from '../../../constants/constants';

const selectStyle = {
    width: '175px',
};

class IntervalSetModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            videoBaseId: '',
            videoDetailId: '',
            baseVideoSgs: [],
            detailList: [],
            detailVideo: {}
        };

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onInputTextChange = this.onInputTextChange.bind(this);
        this.fetchBaseVideoSgs = this.fetchBaseVideoSgs.bind(this);
        this.fetchDetailList = this.fetchDetailList.bind(this);
        this.onBaseVideoSelect = this.onBaseVideoSelect.bind(this);
        this.getVideoById = this.getVideoById.bind(this);
        this.onVideoDetailSelect = this.onVideoDetailSelect.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.resetStates = this.resetStates.bind(this);
    }

    handleOk() {
        this.props.handleOk();
    }

    handleCancel() {
        this.resetStates();
        this.props.handleCancel();
    }

    resetStates() {
        this.setState({
            keyword: '',
            videoBaseId: '',
            videoDetailId: '',
            baseVideoSgs: [],
            detailList: [],
            detailVideo: {}
        });
        this.props.form.resetFields();
    }

    onInputTextChange(videoBaseId) {
    }

    onBaseVideoSelect(videoBaseId) {
        this.setState({
            videoBaseId
        }, () => {
            // let baseVideo = this.getVideoById(videoBaseId)
            // if (baseVideo['categories'] === 2) { // 多剧集视频
            this.fetchDetailList(videoBaseId);
            // }
        });
    }

    onVideoDetailSelect(videoDetailId) {
        this.setState({
            videoDetailId
        });
    }

    getVideoById(videoBaseId) {
        let len = this.state.baseVideoSgs.length;
        for (let i = 0; i < len; i++) {
            if (videoBaseId === this.state.baseVideoSgs[i].videoBaseId) {
                return this.state.baseVideoSgs[i];
            }
        }

        return null;
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.resetStates();
            if (err) {
                return;
            }
            if (this.props.handleOk) {
                let params = { ...values, ...{ title: this.state.detailVideo.title, duration: this.state.detailVideo.duration }};
                this.props.handleOk(params);
            }
        });
    }

    async fetchBaseVideoSgs(word) {
        if (word.trim().length === 0) return;
        let res = await yxFetch(REQ_URL.SELECT_QUERY, {
            word,
        });
        if (res.code === 0) {
            let baseVideoSgs = res.data.videos;
            this.setState({
                baseVideoSgs
            });
        }
    }

    async fetchDetailList(videoBaseId) {
        let res = await yxFetch(REQ_URL.VIDEO_DETAILS, {
            videoBaseId,
        });
        if (res.code === 0) {
            let detailList = res.data.vVideoDetailRspVos;
            this.setState({
                detailList,
                detailVideo: detailList[0],
                videoDetailId: detailList[0]['videoDetailId']
            });
        } else { // 单剧集
            this.setState({
                detailList: [],
                detailVideo: {},
                videoDetailId: ''
            });
            message.warn(res.errmsg);
        }
    }

    render() {
        return (
            <Modal
                title='间隔设置'
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={false}
            >
                <Form layout='inline' onSubmit={this.onFormSubmit} className={style['form']}>
                    <SelRow
                        required = { true }
                        label = '添加视频'
                        labelCol = { 8 }
                        message = '请选择要添加的视频'
                        selectStyle = { selectStyle }
                        initialValue = { this.state.videoBaseId ? this.state.videoBaseId : ''}
                        id = 'videoBaseId'
                        mode = 'combobox'
                        onChange = { this.onInputTextChange }
                        onSearch = { this.fetchBaseVideoSgs }
                        onSelect = { this.onBaseVideoSelect }
                        filterOption = { false }
                        selList = { this.state.baseVideoSgs }
                        optVal = 'videoBaseId'
                        optLabel = 'name'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        optionLabelProp = 'children'
                    />

                    <SelRow
                        required = { true }
                        selectStyle = { selectStyle }
                        ref = 'videoDetailId'
                        id = 'videoDetailId'
                        message = '请选择剧集'
                        wrapperCol = { 28 }
                        mode = 'combobox'
                        initialValue = { this.state.detailVideo ? this.state.detailVideo['videoDetailId'] : ''}
                        onChange = { this.onInputTextChange }
                        onSelect = { this.onVideoDetailSelect }
                        filterOption = { false }
                        selList = { this.state.detailList }
                        optVal = 'videoDetailId'
                        optLabel = 'title'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        optionLabelProp = 'children'
                    />

                    <p className={style['period-wrp']}>
                        <span className={style['period-label']}>视频时长:</span>
                        <span className={style['period-value']}>{ this.state.detailVideo.duration ? transPlayTime(this.state.detailVideo.duration) : 0}</span>
                    </p>

                    <div className={style['btn-wrp']}>
                        <Button type='primary' htmlType='submit'>保存</Button>
                    </div>
                </Form>
            </Modal>
        );
    }
}
const IntervalSetModal = Form.create()(IntervalSetModalComponent);
export default IntervalSetModal;
