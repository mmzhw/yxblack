import React, { Component } from 'react';
import { message, Button, Table, Modal, Input, Row, Col, Popover } from 'antd';
import {
    Link,
} from 'react-router-dom';
import YXFilter from '../../components/filter';
import yxFetch from '../../utils/fetch';
import { getColumns } from './column';
import style from './index.module.css';
import * as urls from '../../constants/urls';
import QuickAddModal from './quickAddModal';
import { REQ_URL } from '../../constants/constants';

const Search = Input.Search;

class VideoManage extends Component {
    constructor(props) {
        super(props);
        this.columns = getColumns.call(this);
        this.state = {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            list: [],
            keywords: '',
            addVisible: false,
            quickModalVisible: false,
            mainConditions: [{
                title: { name: '状态', key: '状态' },
                content: [
                    { name: '全部', key: 0 },
                    { name: '未上架', key: 1 },
                    { name: '已上架', key: 2 },
                ],
                activeKey: 0
            }, {
                title: { name: '视频分类', key: 'type' },
                content: [
                    { name: '全部', key: 'all' },
                ],
                activeKey: 'all'
            }, {
                title: { name: '视频信息', key: 'updateType' },
                content: [
                    { name: '全部', key: 'all' },
                    { name: '有新的剧集', key: 2 },
                    { name: '有新的播放源', key: 1 },
                    { name: '无更新', key: 0 },
                ],
                activeKey: 'all'
            }, {
                title: { name: '平台', key: 'platformsType' },
                content: [
                    { name: '全部', key: 'all' },
                    { name: '有象', key: 0 },
                    { name: '乐视', key: 1 },
                    { name: '腾讯', key: 2 },
                    { name: '爱奇艺', key: 3 },
                    { name: '优酷', key: 4 },
                    { name: '搜狐', key: 5 },
                    { name: '风行', key: 6 },
                    { name: '新浪', key: 7 },
                    { name: '土豆', key: 8 },
                    { name: '哔哩', key: 9 },
                    { name: '弹幕', key: 10 },
                    { name: '芒果TV', key: 11 },
                    { name: 'PPTV', key: 12 },
                    { name: '华数TV', key: 13 },
                    { name: '其他', key: 99 },
                ],
                activeKey: 'all'
            }],
        };
        this.operationVideoIds = [];
        this.pushing = false;
        this.handleMainFilter = this.handleMainFilter.bind(this);
        this.putOff = this.putOff.bind(this);
        this.quickAddVideo = this.quickAddVideo.bind(this);
        this.searchList = this.searchList.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.openQuickModal = this.openQuickModal.bind(this);
        this.closeQuicklModal = this.closeQuicklModal.bind(this);
        this.quickAddConfirm = this.quickAddConfirm.bind(this);
    }

    componentDidMount() {
        this.fetchList(this.state.currentPage);
        this.fetchTypeFilter();
    }
    openQuickModal() {
        this.setState({
            quickModalVisible: true,
        });
    }
    closeQuicklModal() {
        this.setState({
            quickModalVisible: false,
        });
    }
    handleVisibleChange(visible) {
        this.setState({
            addVisible: visible
        });
    }
    quickAddConfirm(params, resetFields) {
        this.quickAddVideo(params, resetFields);
    }
    handleMainFilter(key, value) {
        const mainConditions = this.state.mainConditions;
        for (let i = 0, j = mainConditions.length; i < j; i++) {
            if (this.state.mainConditions[i].title.key === key) {
                mainConditions[i].activeKey = value;
            }
        }
        this.setState({
            mainConditions,
            currentPage: 1,
        }, () => { this.fetchList(1); });
    }

    // 推送OTT数据
    async pushOtt(item) {
        if (this.pushing) {
            message.error('推送中，请稍后。。。');
            return false;
        }
        let data = {
            videoIds: []
        };
        if (item) {
            data.videoIds = [item.videoBaseId];
        } else {
            data.videoIds = this.operationVideoIds;
        }
        if (data.videoIds.length === 0) {
            message.error('存在不需要推送的视频或没有选择需要推送的视频！');
            return;
        }

        let lists = this.state.list.concat();
        let canPush = true;
        lists.forEach((list) => {
            data.videoIds.forEach((videoId) => {
                if (list.videoBaseId === videoId && !list.licence) {
                    canPush = false;
                    message.error('许可证不存在，无法推送');
                }
            });
        });

        if (canPush) {
            this.pushing = true;
            let res = await yxFetch(REQ_URL.SYNCVIDEO, data);
            this.pushing = false;
            if (res.code === 0) {
                lists.forEach((list) => {
                    data.videoIds.forEach((videoId) => {
                        if (list.videoBaseId === videoId) {
                            list.syncFlag = 1;
                        }
                    });
                });
                this.setState({ lists });
                message.success('推送成功');
            } else {
                message.error('推送失败');
            }
        }
    }

    putOffClicked(record) {
        Modal.confirm({
            title: '提示',
            content: `确认下架: ${record.name} ？`,
            onOk: () => { this.putOff(record.videoBaseId); },
            onCancel() {},
        });
    }
    searchList(event) {
        this.setState({
            keywords: event.target.value
        }, () => {
            this.fetchList(1);
        });
    }
    render() {
        let pagination = {
            pageSize: this.state.pageSize,
            total: this.state.total,
            current: this.state.currentPage,
            onChange: (currentPage, pageSize) => {
                this.setState({
                    currentPage
                });
                this.fetchList(currentPage);
            },
        };

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.operationVideoIds = [];
                selectedRowKeys.forEach((selectedRowKey, index) => {
                    if (!Number(selectedRows[index].syncFlag)) {
                        this.operationVideoIds.push(selectedRowKey);
                    }
                });
            },
        };

        return (
            <div>
                <div style={{ marginTop: 20 }}>
                    <YXFilter conditions={this.state.mainConditions} callback={this.handleMainFilter}/>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Row>
                        <Col span={8}>
                            <Popover
                                content={
                                    <div>
                                        <Link className={style['add-link']} to={`${urls.VIDEO_ADD}?categories=2&bizType=2`}>综艺</Link>
                                        <Link className={style['add-link']} to={`${urls.VIDEO_ADD}?categories=2&bizType=1`}>剧集</Link>
                                        <Link className={style['add-link']} to={`${urls.VIDEO_ADD}?categories=1`}>视频</Link>
                                    </div>
                                }
                                trigger='click'
                                visible={this.state.addVisible}
                                onVisibleChange={this.handleVisibleChange}
                            >
                                <Button type='primary' style={ { marginRight: '20px' } }>新增视频</Button>
                            </Popover>
                            <Button style={ { marginRight: '20px' } } onClick={this.openQuickModal} >快速新增</Button>
                            <Button onClick={() => { this.pushOtt(); }} >OTT批量推送</Button>
                        </Col>
                        <Col span={4} offset={12}>
                            <Search
                                placeholder='请输入要搜索的视频'
                                size='large'
                                onChange={ this.searchList }
                            />
                        </Col>
                    </Row>
                </div>
                <Table
                    pagination={pagination}
                    style={{ marginTop: 20 }}
                    dataSource={this.state.list}
                    columns={this.columns}
                    rowKey={'videoBaseId'}
                    rowSelection={rowSelection}
                />
                <QuickAddModal
                    visible={this.state.quickModalVisible}
                    handleOk={ this.quickAddConfirm }
                    handleCancel={ this.closeQuicklModal }
                />
            </div>
        );
    }
    async quickAddVideo(params, resetFields) {
        let res = await yxFetch(REQ_URL.VIDEO_SHORT_ADD, params);
        if (res.code === 0) {
            message.success('快速添加成功！');
            resetFields(); // 清空表单数据
            this.closeQuicklModal();
            setTimeout(this.fetchList.bind(this, 1), 1000);
        } else {
            message.warning(res.errmsg);
        }
    }
    async putOff(videoBaseId) {
        let res = await yxFetch(REQ_URL.VIDEO_SHORT_PUT, {
            videoBaseId,
        });
        if (res.code === 0) {
            message.success('下架成功！');
            setTimeout(this.fetchList.bind(this, this.state.currentPage), 1000);
        } else {
            message.warning(res.errmsg);
        }
    }
    async fetchList(page) {
        const data = {
            currentPage: page,
            pageSize: this.state.pageSize,
            word: this.state.keywords,
        };
        if (this.state.mainConditions[0].activeKey !== 0) {
            data['status'] = this.state.mainConditions[0].activeKey;
        }
        if (this.state.mainConditions[1].activeKey !== 'all') {
            data['labels'] = [this.state.mainConditions[1].activeKey];
        }
        if (this.state.mainConditions[2].activeKey !== 'all') data['updateType'] = this.state.mainConditions[2].activeKey;
        // TODO: 目前单选
        if (this.state.mainConditions[3].activeKey !== 'all') data['platformsType'] = [this.state.mainConditions[3].activeKey];
        let res = await yxFetch(REQ_URL.SELECT_QUERY, data);
        console.log('labelid:', data.labels);
        if (res.code === 0) {
            this.setState({
                total: res.data.records,
                list: res.data.videos
            });
        }
    }
    // FIXME:获取检索标签, 暂时只筛选分类
    async fetchTypeFilter() {
        let res = await yxFetch(REQ_URL.SEARCH_GROUP_LABELS, {});
        if (res.code === 0) {
            for (let i = 0, j = res.data.groups.length; i < j; i++) {
                if (res.data.groups[i].groupName === '分类') {
                    const mainConditions = this.state.mainConditions;
                    mainConditions[1].title.key = res.data.groups[i].id;
                    this.setState({
                        mainConditions: Object.assign([], mainConditions)
                    });
                }
            }
            this.fetchClassifyList();
        } else {
            message.error(res.errmsg);
        }
    }
    async fetchClassifyList() {
        let res = await yxFetch(REQ_URL.CLASS_LIST, {});
        if (res.code === 0) {
            const mainConditions = this.state.mainConditions;
            for (let i = 0, j = res.data.length; i < j; i++) {
                if (!res.data[i].enable) continue;
                mainConditions[1].content.push({
                    name: res.data[i].name,
                    key: res.data[i].id,
                });
            }
            this.setState({
                mainConditions: Object.assign([], mainConditions)
            });
        } else {
            message.error(res.errmsg);
        }
    }
}

export default VideoManage;
