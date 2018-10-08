import React, { Component } from 'react';
import { Input, Table, Button, message, Menu, Dropdown, Icon, Radio, Modal, Row, Col, DatePicker, Form } from 'antd';
import moment from 'moment';
import { handleImgUrl } from '../../../src/utils/util';
import yxFetch from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { Link } from 'react-router-dom';
import style from './index.module.css';
import { REQ_URL } from '../../constants/constants';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

let columns = [{
    title: '序号',
    dataIndex: 'NO',
    width: 45,
}, {
    title: '视频封面图',
    dataIndex: 'picUrl',
    width: 100,
    render: (text, record, index) => {
        return (<img alt='' key={index} width='50px' src={handleImgUrl(text)} />);
    }
}, {
    title: '标题',
    dataIndex: 'title',
}, {
    title: '昵称',
    dataIndex: 'nickName',
}, {
    title: '推荐位置',
    dataIndex: 'showType',
    width: 100,
    render: (text, record, index) => {
        let result = '';
        if (record.showStatus === 0) {
            result = '未推荐';
        } else {
            if (text === 0) {
                result = '普通展示';
            } else if (text === 1) {
                result = '首页展示';
            } else if (text === 2) {
                result = '置顶展示';
            }
        }
        return (<span key={index}>{result}</span>);
    }
}, {
    title: '审核结果',
    dataIndex: 'auditStatus',
    width: 100,
    render: (text, record, index) => {
        let result = '';
        if (text === 0) {
            result = '未审核';
        } else if (text === 1) {
            result = '审核通过';
        } else if (text === 2) {
            result = '审核不通过';
        }
        return (<span key={index}>{result}</span>);
    }
}, {
    title: '创建时间',
    dataIndex: 'gmtCreated',
    render: (text, record, index) => {
        return (<span key={index}>{moment(text).format('YYYY-MM-DD hh:mm')}</span>);
    }
}, {
    title: '评论数',
    dataIndex: 'commentCount',
    width: 70,
}, {
    title: '分享数',
    dataIndex: 'shareCount',
    width: 70,
}, {
    title: '点赞数',
    dataIndex: 'likeCount',
    width: 70,
}, {
    title: '播放总量',
    dataIndex: 'playCountTotal',
    width: 70,
}, {
    title: '操作',
    render: (text, record, index) => {
        return (
            <Button key={index} type='primary'><Link
                to={`${urls.USER_VIDEO_MANAGE}/UserVideoDetail/${record.id}`}>详情</Link></Button>
        );
    }
}];

class VideoManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSources: [],
            total: 0,
            visible: false,
            confirmLoading: false,
            commentVisible: false,
            videosReqType: 3, // 查询视频列表类型
        };
        this.pageSize = 10; // 每页显示数量
        this.operationVideoIds = []; // 操作视频id
        this.showType = ''; // 推荐位置
        this.currentPage = 1;
    }

    componentDidMount() {
        this.fetchUserVideos(1, this.state.videosReqType);
    }

    tableChange(pagination) {
        this.fetchUserVideos(pagination.current, this.state.videosReqType);
    }

    async fetchUserVideos(page, type) {
        const { getFieldValue } = this.props.form;
        const timeArray = getFieldValue('time');
        let res = await yxFetch(REQ_URL.GET_UN_AUDIT_VIDEOS, {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type: type,
            startCreateDate: (timeArray && timeArray[0]) ? (new Date(timeArray[0].format())).getTime() : undefined,
            endCreateDate: (timeArray && timeArray[0]) ? (new Date(timeArray[1].format())).getTime() : undefined,
        });
        if (res.code === 0) {
            let videoShortVos = [];
            res.data.videoShortVos.forEach((videoShortVo, index) => {
                let baseNum = this.pageSize * (page - 1);
                videoShortVo.NO = index + baseNum;
                videoShortVos.push(videoShortVo);
            });
            this.setState({
                dataSources: videoShortVos,
                total: res.data.pager.records,
            });
        }
    }

    // 取消推荐
    async cancelCommentClick() {
        if (this.operationVideoIds.length === 0) {
            message.warn('请选择需要进行操作的视频');
            return;
        }
        let requestData = {
            type: 0,
            ids: this.operationVideoIds
        };
        let res = await yxFetch(REQ_URL.VIDEO_RECOMMOND, requestData);
        if (res.code === 0) {
            let datas = this.state.dataSources;
            datas.forEach((data, index) => {
                this.operationVideoIds.forEach((operationVideoId) => {
                    if (operationVideoId === data.id) {
                        datas[index].showStatus = 0;
                    }
                });
            });
            this.setState({
                dataSources: datas,
                commentVisible: false,
            });
            message.success('仅审核通过，不推荐');
        } else {
            this.setState({
                commentVisible: false,
            });
            message.error('取消失败');
        }
    }

    // 推荐
    async commentClick(state) {
        if (this.operationVideoIds.length === 0) {
            message.warn('请选择需要进行操作的视频');
            return;
        }
        state = Number(state);
        let requestData = {
            type: 1,
            showType: Number(state),
            ids: this.operationVideoIds,
        };
        let res = await yxFetch(REQ_URL.VIDEO_RECOMMOND, requestData);
        if (res.code === 0) {
            let datas = this.state.dataSources;
            datas.forEach((data, index) => {
                this.operationVideoIds.forEach((operationVideoId) => {
                    if (operationVideoId === data.id) {
                        datas[index].showStatus = 1;
                        datas[index].showType = state;
                    }
                });
            });
            this.setState({
                dataSources: datas,
                commentVisible: false,
            });
            message.success('推荐完成');
        } else {
            this.setState({
                commentVisible: false,
            });
            message.error('推荐失败');
        }
    }

    singleCommentClick(state, id) {
        this.operationVideoIds = [id];
        state = Number(state);
        if (state === 3) {
            this.cancelCommentClick();
        } else {
            this.commentClick(state);
        }
    }

    // 审核
    async revieweClick(state) {
        if (this.operationVideoIds.length === 0) {
            message.warn('请选择需要进行操作的视频');
            return;
        }
        state = Number(state);
        let reason = '';
        if (this.refs.unPassReason) {
            reason = this.refs.unPassReason.value;
        }
        if (!state && !reason) {
            message.warn('请输入审核失败原因');
            return;
        }
        let requestData = {
            type: state,
            list: []
        };
        this.operationVideoIds.map((operationVideoId) => {
            requestData.list.push({
                id: operationVideoId,
                unPassReason: reason
            });
            return operationVideoId;
        });

        let res = await yxFetch(REQ_URL.VIDEO_CHECK, requestData);
        if (res.code === 0) {
            let datas = this.state.dataSources;
            datas.forEach((data, index) => {
                this.operationVideoIds.forEach((operationVideoId) => {
                    if (operationVideoId === data.id) {
                        datas[index].auditStatus = state;
                        datas[index].unPassReason = state === 1 ? '' : reason;
                    }
                });
            });

            this.setState({
                dataSources: datas,
                visible: false,
                confirmLoading: false,
            });
            if (state === 1) { // 审核通过弹出推荐
                this.setState({
                    commentVisible: true,
                });
            }
            message.success('审核完成');
        } else {
            this.setState({
                confirmLoading: false,
            });
            message.error('审核失败');
        }
    }

    filterSources(event) {
        this.setState({
            videosReqType: Number(event.target.value),
        });

        let date = {};
        if (event.target.value === 1) {
            date = {
                title: '推荐操作',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => {
                    let menus = (
                        <Menu onClick={
                            (event) => {
                                this.singleCommentClick(event.key, text);
                            }
                        }>
                            <Menu.Item key={2}>置顶</Menu.Item>
                            <Menu.Item key={1}>首页</Menu.Item>
                            <Menu.Item key={0}>普通</Menu.Item>
                            <Menu.Item key={3}>不推荐</Menu.Item>
                        </Menu>
                    );
                    return (
                        <Dropdown key={index} overlay={menus}>
                            <Button type='primary'>
                                推荐 <Icon type='down' />
                            </Button>
                        </Dropdown>
                    );
                }
            };
            columns.splice(columns.length - 1, 0, date);
        } else {
            columns = columns.filter((column) => {
                return column.key !== 'id';
            });
        }

        this.fetchUserVideos(1, event.target.value);
    }

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        this.revieweClick(2);
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    showModal = () => {
        if (this.operationVideoIds.length === 0) {
            message.warn('请选择需要进行操作的视频');
            return;
        }
        this.setState({
            visible: true,
        });
    }
    search = () => {
        this.fetchUserVideos(1, this.state.videosReqType);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const pagination = {
            showQuickJumper: true,
            pageSize: this.pageSize,
            total: this.state.total,
        };
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.operationVideoIds = [];
                selectedRows.forEach((selectedRow) => {
                    this.operationVideoIds.push(selectedRow.id);
                });
            },
        };
        const menu = (
            <Menu onClick={
                (event) => {
                    this.commentClick(event.key);
                }
            }>
                <Menu.Item key={2}>置顶</Menu.Item>
                <Menu.Item key={1}>首页</Menu.Item>
                <Menu.Item key={0}>普通</Menu.Item>
            </Menu>
        );

        return (
            <div>
                <div className={style['fillter']}>
                    <Row>
                        <Col span={2} style={{ height: '32px', lineHeight: '32px' }}>筛选：</Col>
                        <Col span={2} style={{ height: '32px', lineHeight: '32px' }}>状态选择：</Col>
                        <Col span={20}>
                            <RadioGroup onChange={this.filterSources.bind(this)} defaultValue={3}>
                                <RadioButton value={3}>全部</RadioButton>
                                <RadioButton value={0}>未审核</RadioButton>
                                <RadioButton value={1}>审核通过</RadioButton>
                                <RadioButton value={2}>审核不通过</RadioButton>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col span={2} offset={2} style={{ height: '32px', lineHeight: '32px' }}>时间选择：</Col>
                        <Col span={8}>
                            {
                                getFieldDecorator('time')(
                                    <RangePicker
                                        showTime={{ format: 'HH:mm' }}
                                        format='YYYY-MM-DD HH:mm'
                                        placeholder={['开始时间', '结束时间']}
                                    />
                                )
                            }
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Button type='primary' onClick={this.search}>查询</Button>
                        </Col>
                    </Row>
                </div>
                {
                    this.state.videosReqType === 1 ? (
                        <div>
                            <Dropdown overlay={menu}>
                                <Button type='primary'>
                                    推荐 <Icon type='down' />
                                </Button>
                            </Dropdown>
                            <Button style={{ margin: '0 0 20px 20px' }}
                                onClick={this.cancelCommentClick.bind(this, 0)}>不推荐</Button>
                        </div>
                    ) : null
                }
                {
                    this.state.videosReqType === 0 ? (
                        <div className={style['videoDetailControl']}>
                            <Button onClick={this.revieweClick.bind(this, 1)} type='primary'>审核通过</Button>
                            <Modal
                                title='推荐'
                                visible={this.state.commentVisible}
                                closable={false}
                                width={350}
                                footer={[
                                    <Button className={style['right']}
                                        onClick={this.cancelCommentClick.bind(this, 0)}>不推荐</Button>,
                                    <Dropdown overlay={menu}>
                                        <Button type='primary'>
                                            推荐 <Icon type='down' />
                                        </Button>
                                    </Dropdown>
                                ]}
                            >
                                <p>推荐到APP“活动”中的“有象故事”展示，注意仅限选择一种状态：</p>
                                <p>1、置顶：在“有象故事”的第一条位置</p>
                                <p>2、首页：在“有象故事”的前六条位置</p>
                                <p>3、普通：在“有象故事”前六条以外的位置</p>
                            </Modal>
                            <Button onClick={this.showModal}>审核不通过</Button>
                            <Modal title='审核不通过原因'
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                confirmLoading={this.state.confirmLoading}
                                onCancel={this.handleCancel}
                            >
                                <TextArea ref='unPassReason' rows={4} />
                            </Modal>
                        </div>
                    ) : null
                }
                <Table
                    dataSource={this.state.dataSources}
                    columns={columns} pagination={pagination}
                    onChange={this.tableChange.bind(this)}
                    rowSelection={rowSelection}
                    rowKey={record => record.id}
                />
            </div>

        );
    }
}

export default Form.create()(VideoManage);
