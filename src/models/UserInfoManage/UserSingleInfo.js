// 专题管理首页
import React, { Component } from 'react';
import { Button, Table, message, Divider, Popover, Col, Modal } from 'antd';
import PointDetail from './PointDetail';
import ExperDetail from './ExperDetail';
import moment from 'moment';
import { Link } from 'react-router-dom';
import fetcher from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { REQ_URL } from '../../constants/constants';

class UserSingleInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoMap: [],
            list: [], // 列表数据
            pagination: {},
            visible: false,
            expirVisible: false
        };
    }
    componentDidMount() {
        this.getList(this._getArgs());
        this.getUserInfo();
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '推荐位置',
            dataIndex: 'showType',
            key: 'showType',
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
        },
        {
            title: '审核结果',
            dataIndex: 'auditStatus',
            key: 'auditStatus',
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
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            render: (text, record, index) => {
                return (<span key={index}>{moment(text).format('YYYY-MM-DD HH:mm')}</span>);
            }
        },
        {
            title: '评论数',
            key: 'commentCount',
            dataIndex: 'commentCount',
        },
        {
            title: '分享',
            key: 'shareCount',
            dataIndex: 'shareCount',
        },
        {
            title: '点赞数',
            key: 'likeCount',
            dataIndex: 'likeCount',
        },
        {
            title: '播放总量',
            key: 'playCountTotal',
            dataIndex: 'playCountTotal',
        },
        {
            title: '视频状态',
            key: 'status',
            dataIndex: 'status',
            render: (value) => {
                return (<span>{value === 0 && '无效'}{value === -1 && '删除'}{value === 1 && '有效'}</span>);
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, index) => {
                return (
                    <Link to={`${urls.USER_SINGLE_INFO}/${this.props.match.match.params.id}/${record.id}`}>查看</Link>
                );
            }
        }
    ]
    // 获取主题列表
    getList = async (params) => {
        let res = await fetcher(REQ_URL.USER_VIDEOS, params);
        if (res.code === 0) {
            this.setState({
                list: res.data.videoShortVos,
                pagination: {
                    ...res.data.pager,
                    curret: res.data.pager.pageNo,
                    total: res.data.pager.records
                },
            });
        } else {
            console.error(res.errmsg);
        }
    }

    // 获取用户信息
    getUserInfo = async () => {
        try {
            let res = await fetcher(REQ_URL.USER_INFO, {
                uid: this.props.match.match.params.id
            });
            let pointConfig = [];
            try {
                const config = await fetcher(REQ_URL.POINTS_CONFIG, {});
                pointConfig = config.data;
            } catch (error) {
                message.error('获取积分');
            }
            const Head = ({ headPic, isHasHead }) => {
                return (
                    isHasHead ? <Popover content={
                        <img
                            src={headPic}
                            alt='用户头像'
                            style={{ maxHeight: '300px', maxWidth: '300px' }}
                        />
                    }
                    placement='rightTop'>
                        <img
                            src={headPic}
                            alt='用户头像'
                            style={{ maxHeight: '120px', maxWidth: '120px' }}
                        />
                    </Popover> : <img
                        src={headPic}
                        alt='用户头像'
                        style={{ maxHeight: '120px', maxWidth: '120px' }}
                    />
                );
            };
            if (res.code === 0) {
                this.setState({
                    infoMap: [
                        {
                            key: '头像',
                            type: 'head',
                            value: <Head headPic={res.data.avatar || require('../../assets/none.png')} isHasHead={!!res.data.avatar}></Head>
                        },
                        { key: '昵称', value: res.data.nickName },
                        { key: '用户ID', value: res.data.uid },
                        { key: '用户状态', value: !res.data.status ? '正常' : '黑名单' },
                        { key: '用户等级', value: (() => {
                            const array = pointConfig.filter((obj) => {
                                return obj.level === res.data.level;
                            });
                            return (array && array[0]) ? array[0].userLevel : '';
                        })() },
                        { key: '粉丝数', value: res.data.fansNumber },
                        { key: '性别', value: res.data.sex === '1' ? '男' : '女' },
                        { key: '生日', value: res.data.birthday ? moment(res.data.birthday).format('YYYY-MM-DD') : '' },
                        { key: '手机号', value: res.data.mobileNo },
                        { key: '地区', value: res.data.area },
                        { key: '注册时间', value: res.data.registerTime ? moment(res.data.registerTime).format('YYYY-MM-DD HH:mm') : '' },
                        { key: '最后到访时间', value: res.data.lastVisitDate ? moment(res.data.lastVisitDate).format('YYYY-MM-DD HH:mm') : '' },
                        {
                            key: '金币',
                            value: <span>{res.data.points} <Button type='primary' size='small' onClick={this._handleModal}>金币明细</Button></span>
                        },
                        // {
                        //     key: '经验',
                        //     value: <span>{res.data.experience} <Button type='primary' size='small' onClick={this._handleExpirModal}>经验明细</Button></span>
                        // },
                    ]
                });
            } else {
                console.error(res.errmsg);
            }
        } catch (error) {
            message.error('请求接口延迟');
        }
    }

    _getArgs = (current = 1, pageSize = 10) => {
        return {
            offset: (current - 1) * pageSize,
            limit: pageSize,
            uid: this.props.match.match.params.id
        };
    }

    _handleModal = () => {
        this.setState({
            visible: !this.state.visible
        });
    }

    _handleExpirModal = () => {
        this.setState({
            expirVisible: !this.state.expirVisible
        });
    }

    render() {
        const { pagination } = this.state;
        return (
            <div>
                <div style={{ paddingBottom: '20px' }}>
                    <Col span={6}>
                        {
                            this.state.infoMap.map((info, index) => {
                                if (info.type === 'head') {
                                    return (
                                        <Col span={24} style={{ padding: '10px 0' }} key={index}>
                                            <Col span={4}>{info.key}：</Col>
                                            <Col span={20}>{info.value}</Col>
                                        </Col>
                                    );
                                } else { return ''; }
                            })
                        }
                    </Col>
                    <Col span={18}>
                        {
                            this.state.infoMap.map((info, index) => {
                                if (info.type !== 'head') {
                                    return (
                                        <Col span={8} style={{ padding: '10px 0' }} key={index}>
                                            <Col span={9} style={{ width: '100px' }}>{info.key}：</Col>
                                            <Col span={15}>{info.value}</Col>
                                        </Col>
                                    );
                                } else { return ''; }
                            })
                        }
                    </Col>
                </div>
                <Divider type='horizontal' />
                <Table
                    dataSource={this.state.list}
                    title={() => <p style={{ fontWeight: 700 }}>所有作品</p>}
                    columns={this.columns}
                    rowKey='id'
                    pagination={{
                        showQuickJumper: true,
                        ...pagination,
                        onChange: (currentPage, pageSize) => {
                            this.getList(this._getArgs(currentPage, pageSize));
                        }
                    }}
                />
                <Modal
                    title='积分（金币）列表'
                    visible={this.state.visible}
                    onCancel={this._handleModal}
                    destroyOnClose={true}
                    footer={false}
                >
                    <PointDetail uid={this.props.match.match.params.id} />
                </Modal>
                <Modal
                    title='经验值列表'
                    visible={this.state.expirVisible}
                    onCancel={this._handleExpirModal}
                    destroyOnClose={true}
                    footer={false}
                >
                    <ExperDetail uid={this.props.match.match.params.id} />
                </Modal>
            </div>
        );
    }
}

export default UserSingleInfo;
