// 专题管理首页
import React, { Component } from 'react';
import { Button, Table, Modal, message, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { getBaseUrl } from './url';
import fetcher from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { REQ_URL } from '../../constants/constants';

export default class WebSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // 多选选中数据
            subjectList: [], // 列表数据
            pageInfo: {
                currentPage: 1,
                records: 0
            }
        };
        this.pageSize = 10;
    }
    componentDidMount() {
        this.fetchSubjectList({
            currentPage: 1,
            pageSize: this.pageSize,
        });
    }

    columns = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '专题名称',
        dataIndex: 'title',
        key: 'title',
    }, {
        title: 'url',
        dataIndex: 'url',
        key: 'url',
        render: (text, record, index) => {
            return (
                <a style={{ textDecoration: 'none' }} target='_blank' href={text}>{text}</a>
            );
        }
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
            return (
                <div>
                    <Link to={`${urls.WEBSUBJECT}/${record.id}`}>编辑</Link>
                    <Divider type='vertical' />
                    {
                        record.enable ? (<a onClick={() => { this.updateEnable(record); }}>禁用</a>)
                            : (<a onClick={() => { this.updateEnable(record); }}>启用</a>)
                    }
                    <Divider type='vertical' />
                    <a onClick={() => { this.deleteMarqBtnClicked(record.id); }}>删除</a>
                </div>
            );
        }
    }]

    updateEnable = async(record) => {
        record = {
            ...record,
            enable: Number(!record.enable)
        };
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_UPDATE, record);
        if (res.code === 0) {
            message.success('更新成功');
            const { currentPage } = this.state.pageInfo;
            this.fetchSubjectList({
                currentPage,
                pageSize: this.pageSize,
            });
        } else {
            message.error(res.errmsg);
        }
    }

    deleteMarqBtnClicked = (item) => {
        let isWarn = item.length > 1 ? '选中的' : item;
        Modal.confirm({
            title: '',
            content: `确认删除"${isWarn}"专题"？`,
            onOk: () => { this.deletePage(item); },
            onCancel() {},
        });
    }

    deletePage = async (record) => {
        this.setState({ selectedRowKeys: [] });
        let res;
        if (Object.prototype.toString.call(record) === '[object Array]') {
            res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DELETE_BATCH, { ids: record });
        } else {
            res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DELETE, { id: record });
        }
        if (res.code === 0) {
            message.success('删除成功!');
            this.fetchSubjectList({
                currentPage: 1,
                pageSize: this.pageSize
            });
        } else {
            message.error(res.errmsg);
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    // 配置多个路由
    render() {
        const { pageInfo, selectedRowKeys } = this.state;
        let pagination = {
            pageSize: this.pageSize,
            total: pageInfo.records,
            current: pageInfo.currentPage,
            onChange: (currentPage, pageSize) => {
                this.fetchSubjectList({
                    currentPage,
                    pageSize: this.pageSize,
                });
            }
        };
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div style={{ paddingBottom: '20px' }}>
                    <Button type='primary' style={{ marginRight: '20px' }}><Link to={`${urls.WEBSUBJECT}/add`}>新增专题</Link></Button>
                    <Button onClick={this.deleteMarqBtnClicked.bind(this, selectedRowKeys)} disabled={!hasSelected} type='primary'>删除</Button>
                </div>
                <Table
                    rowSelection={rowSelection}
                    dataSource={this.state.subjectList}
                    columns={this.columns}
                    pagination={pagination}
                >
                </Table>
            </div>
        );
    }

    fetchSubjectList = async (params) => {
        let res = await fetcher(REQ_URL.SPECIAL_CHANNEL_PAGE, params);
        if (res.code === 0) {
            let newSubjectList = res.data.channels.map(subject => {
                return {
                    key: subject.id,
                    url: getBaseUrl('www') + `/${subject.id}`,
                    ...subject
                };
            });
            this.setState({
                subjectList: newSubjectList,
                pageInfo: res.data.pagerVo,
            });
        } else {
            console.error(res.errmsg);
        }
    }
}
