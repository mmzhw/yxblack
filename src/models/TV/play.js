import React, { Component } from 'react';
import style from './play.module.css';
import yxFetch from '../../utils/fetch';
import { Button, Table, Card, Modal, message } from 'antd';
import * as urls from '../../constants/urls';
import { Link } from 'react-router-dom';
import { getCutColumns, getQueueColumns, getPlayColumns } from './playData';
import IntervalSetModal from '../../components/Tv/intervalSetModal';
import QueueDetailModal from '../../components/Tv/queueDetailModal';
import SetPreModal from '../../components/Tv/setPreModal';
import { REQ_URL } from '../../constants/constants';

class tvPlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playQueueList: [], // 播放详情列表
            queueList: [], // 列表队列
            cutList: [], // 插播队列
            queueDetailList: [], // 一个队列的详情
            intervalSetModalVisible: false,
            queueDetailModalVisible: false,
            setPreModalVisible: false,
            cutVideoId: '', // 插播id
            queueId: '', // 队列id
            cutPageInfo: { // 插播分页信息
                // pageNo: 1,
                // pageSize: 5,
                // pages: 2,
                // records: 6,
            },
            queuePageInfo: { // 队列分页信息
            }
        };
        this.pageSize = 5; // set global pageSize

        this.playColumns = getPlayColumns.call(this);
        this.queueColumns = getQueueColumns.call(this);
        this.cutColumns = getCutColumns.call(this);
        // 队列详情
        this.fetchQueueDetail = this.fetchQueueDetail.bind(this);
        this.openQueueDetailModal = this.openQueueDetailModal.bind(this);
        this.closeQueueDetailModal = this.closeQueueDetailModal.bind(this);
        // 间隔设置
        this.openIntervalSetModal = this.openIntervalSetModal.bind(this);
        this.closeIntervalSetModal = this.closeIntervalSetModal.bind(this);
        this.intervalSetModalConfirm = this.intervalSetModalConfirm.bind(this);
        // 前置设置
        this.openSetPreModal = this.openSetPreModal.bind(this);
        this.closeSetPreModal = this.closeSetPreModal.bind(this);
        this.setPreModalConfirm = this.setPreModalConfirm.bind(this);
    }
    componentDidMount() {
        this.fetchPlayDetail();
        this.fetchCutList(1); // pageNo: 1
        this.fetchQueueList(1);
    }
    /* ----- 间隔设置modal操作 ----- */
    // 打开间隔设置modal
    openIntervalSetModal() {
        this.setState({
            intervalSetModalVisible: true,
        });
    }
    // 关闭间隔设置modal
    closeIntervalSetModal() {
        this.setState({
            intervalSetModalVisible: false,
        });
    }
    openSetPreModal() {
        this.setState({
            setPreModalVisible: true
        });
    }
    closeSetPreModal() {
        this.setState({
            setPreModalVisible: false
        });
    }
    /* ----- 列表详情modal操作 ----- */
    // 打开列表详情modal
    openQueueDetailModal() {
        this.setState({
            queueDetailModalVisible: true,
        });
    }
    // 关闭列表详情modal
    closeQueueDetailModal() {
        this.setState({
            queueDetailModalVisible: false,
        });
    }
    render() {
        let queuePagination = {
            pageSize: this.pageSize,
            total: this.state.queuePageInfo.totalCount,
            current: this.state.queuePageInfo.pageNo,
            onChange: (currentPage, pageSize) => {
                this.fetchQueueList(currentPage);
            },
            // onShowSizeChange: (currentPage, pageSize) => {
            //   console.log(currentPage, pageSize)
            // },
        };

        let cutPagination = {
            pageSize: this.pageSize,
            total: this.state.cutPageInfo.records,
            current: this.state.cutPageInfo.pageNo,
            onChange: (currentPage, pageSize) => {
                this.fetchCutList(currentPage);
            },
        };

        return (
            <div>
                <Card title='队列管理' className={style['card']} bodyStyle={{ padding: 10, paddingBottom: 0 }}>
                    <Link to={`${urls.TV_ADMIN}/queueSet/`}>
                        <Button className={style['add-btn']} type='primary' onClick={ this.submitInformation } >新建队列</Button>
                    </Link>
                    <Table dataSource={this.state.queueList} columns={this.queueColumns} rowKey={'queueId'} pagination={queuePagination}/>
                </Card>
                <Card title='播放详情' className={style['card']} bodyStyle={{ padding: 10, paddingBottom: 0 }}>
                    <Table dataSource={this.state.playQueueList} columns={this.playColumns} rowKey={'name'} showHeader={false}/>
                </Card>
                <Card title='插播管理' className={style['card']} bodyStyle={{ padding: 10, paddingBottom: 0 }}>
                    <Link to={`${urls.TV_ADMIN}/interrupt/`}>
                        <Button className={style['add-btn']} type='primary' onClick={ this.submitInformation } >新建插播</Button>
                    </Link>
                    <Table dataSource={this.state.cutList} columns={this.cutColumns} rowKey={'cutVideoId'} pagination={cutPagination}/>
                </Card>
                <IntervalSetModal
                    visible={ this.state.intervalSetModalVisible }
                    handleOk={ this.intervalSetModalConfirm }
                    handleCancel={ this.closeIntervalSetModal }
                />
                <QueueDetailModal
                    visible={ this.state.queueDetailModalVisible }
                    handleCancel={ this.closeQueueDetailModal }
                    queueDetailList={ this.state.queueDetailList }
                />
                <SetPreModal
                    visible={ this.state.setPreModalVisible }
                    handleOk={ this.setPreModalConfirm }
                    handleCancel={ this.closeSetPreModal }
                />
            </div>
        );
    }
    /* ----- 播放详情 ----- */
    async fetchPlayDetail() {
        let res = await yxFetch(REQ_URL.TV_OTT_DETAIL, {
        });
        if (res.code === 0) {
            if (res.data.playingQueue || (res.data.waitingQueues && res.data.waitingQueues.length > 0)) {
                if (!res.data.playingQueue) {
                    res.data.waitingQueues.unshift({
                        queueId: null,
                        scheduleTime: null,
                        name: null,
                    });
                } else {
                    res.data.waitingQueues.unshift(res.data.playingQueue);
                }
                this.setState({
                    playQueueList: res.data.waitingQueues
                });
            }
        }
    }

    /* ----- 队列有关 ----- */
    deleteQueueBtnClicked(queue) {
        Modal.confirm({
            title: '提示',
            content: `确认删除: ${queue.name} ？`,
            onOk: () => { this.deleteQueue(queue.queueId); },
            onCancel() {},
        });
    }
    onlineQueueBtnClicked(queue) {
        Modal.confirm({
            title: '提示',
            content: `确认上线: ${queue.name} ？`,
            onOk: () => { this.onlineQueue(queue.queueId); },
            onCancel() {},
        });
    }
    cancelScheduleBtnClick(queue) {
        Modal.confirm({
            title: '提示',
            content: `确认取消定时播放: ${queue.name} ？`,
            onOk: () => { this.cancelSchedule(queue.queueId); },
            onCancel() {},
        });
    }
    queueDetailBtnClicked(queue) {
        this.openQueueDetailModal();
        this.fetchQueueDetail(queue.queueId);
    }
    intervalSetBtnClicked(queue) {
        this.openIntervalSetModal();
        this.setState({
            queueId: queue.queueId
        });
    }
    // 保存间隔设置
    intervalSetModalConfirm(params) {
        this.setQueueInterval(params);
    }
    async setQueueInterval(params) {
        let res = await yxFetch(REQ_URL.TV_OTT_SET, {
            queueId: this.state.queueId,
            ...params,
        });
        if (res.code === 0) {
            this.closeIntervalSetModal();
            message.success('间隔设置成功!');
        } else {
            message.error(res.errmsg);
        }
    }
    async deleteQueue(queueId) { // 删除
        let res = await yxFetch(REQ_URL.TV_OTT_DELETE, {
            queueId,
        });
        if (res.code === 0) {
            message.success('删除成功!');
            this.fetchPlayDetail();
            this.fetchQueueList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async onlineQueue(queueId) { // 上线
        let res = await yxFetch(REQ_URL.TV_OTT_ONLINE, {
            queueId,
        });
        if (res.code === 0) {
            message.success('上线成功!');
            this.fetchPlayDetail();
            this.fetchQueueList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async cancelSchedule(queueId) { // 取消定时播放
        let res = await yxFetch(REQ_URL.TV_OTT_CANCEL, {
            queueId,
        });
        if (res.code === 0) {
            message.success('已取消定时播放!');
            this.fetchPlayDetail();
            this.fetchQueueList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    // 获取队列列表
    async fetchQueueList(pageNo) {
        let res = await yxFetch(REQ_URL.TV_OTT_LIST, {
            pageNo,
            pageSize: this.pageSize,
        });
        if (res.code === 0) {
            this.setState({
                queueList: res.data.queueList,
                queuePageInfo: res.data.pager
            });
        } else {
            message.error(res.errmsg);
        }
    }
    // 获取queue的详情(列表)
    async fetchQueueDetail(queueId) {
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_DETAIL, {
            queueId,
        });
        if (res.code === 0) {
            this.setState({
                queueDetailList: res.data.videos
            });
        } else {
            message.error(res.errmsg);
        }
    }

    /* ----- 插播有关 ----- */
    setPreModalConfirm(values) {
        this.setPreCutVideo(values);
    }
    cancelScheduleCutVideoBtnClicked(cutVideo) {
        Modal.confirm({
            title: '提示',
            content: `确认取消定时播放: ${cutVideo.cutVideoName} ？`,
            onOk: () => { this.cancelScheduleCutVideo(cutVideo.cutVideoId); },
            onCancel() {},
        });
    }
    deleteCutVideoBtnClicked(cutVideo) {
        Modal.confirm({
            title: '提示',
            content: `确认删除: ${cutVideo.cutVideoName} ？`,
            onOk: () => { this.deleteCutVideo(cutVideo.cutVideoId); },
            onCancel() {},
        });
    }
    onlineCutVideoBtnClicked(cutVideo) {
        Modal.confirm({
            title: '提示',
            content: `确认上线: ${cutVideo.cutVideoName} ？`,
            onOk: () => { this.onlineCutVideo(cutVideo.cutVideoId); },
            onCancel() {},
        });
    }
    offlineCutVideoBtnClicked(cutVideo) {
        Modal.confirm({
            title: '提示',
            content: `确认下线: ${cutVideo.cutVideoName} ？`,
            onOk: () => { this.offlineCutVideo(cutVideo.cutVideoId); },
            onCancel() {},
        });
    }
    setPreCutVideoBtnClicked(record) {
        this.openSetPreModal();
        this.setState({
            cutVideoId: record.cutVideoId
        });
    }
    async deleteCutVideo(cutVideoId) { // 插播删除
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_DELETE, {
            cutVideoId,
        });
        if (res.code === 0) {
            message.success('删除成功!');
            this.fetchCutList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async onlineCutVideo(cutVideoId) { // 插播上线
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_ONLINE, {
            cutVideoId,
        });
        if (res.code === 0) {
            message.success('上线成功!');
            this.fetchCutList(1);
            this.fetchPlayDetail();
            this.fetchQueueList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async offlineCutVideo(cutVideoId) { // 插播下线
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_OFFLINE, {
            cutVideoId,
        });
        if (res.code === 0) {
            message.success('下线成功!');
            this.fetchCutList(1);
            this.fetchPlayDetail();
            this.fetchQueueList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async cancelScheduleCutVideo(cutVideoId) { // 取消插播
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_CANCEL, {
            cutVideoId,
        });
        if (res.code === 0) {
            message.success('取消插播成功!');
            this.fetchCutList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async setPreCutVideo(ids) { // 插播前置
        let { videoDetailId } = ids;
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_SET, {
            cutVideoId: this.state.cutVideoId,
            videoDetailId,
        });
        if (res.code === 0) {
            this.closeSetPreModal();
            message.success('前置视频成功!');
            this.fetchCutList(1);
        } else {
            message.error(res.errmsg);
        }
    }
    async fetchCutList(pageNo) { // 获取插播列表
        let res = await yxFetch(REQ_URL.TV_OTT_QUEUE_LIST, {
            pageNo,
            pageSize: this.pageSize,
        });
        if (res.code === 0) {
            this.setState({
                cutPageInfo: res.data,
                cutList: res.data.data,
            });
        } else {
            message.error(res.errmsg);
        }
    }
}

export default tvPlay;
