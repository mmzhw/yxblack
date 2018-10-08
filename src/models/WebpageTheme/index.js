// 专题管理首页
import React, { Component } from 'react';
import { Button, Table, message, Divider } from 'antd';
import ConfirmButton from '../../components/ConfirmButton';
import { Link } from 'react-router-dom';
import { getBaseUrl } from './url';
import fetcher from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { REQ_URL } from '../../constants/constants';
import { isArray } from 'util';

class WebpageTheme extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            themeList: [],
            pagination: {}
        };
    }
    componentDidMount() {
        this.getThemeList(this.getArgs());
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '专题名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'url',
            dataIndex: 'url',
            key: 'url',
            render: (text, record, index) => {
                return (<a style={{ textDecoration: 'none' }} target='_blank' href={text}>{text}</a>);
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, index) => {
                return (
                    <div>
                        <Link to={`${urls.WEBPAGE_THEME}/${record.id}`}>编辑</Link>
                        <Divider type='vertical' />
                        <a onClick={() => { this.updateThemeState(record); }}>{record.enable ? '禁用' : '启用'}</a>
                        <Divider type='vertical' />
                        <ConfirmButton
                            content={`确认删除${record.id}专题？`}
                            onClick={() => this.removeTheme(record.id)}
                            type='link'
                        >删除
                        </ConfirmButton>
                    </div>
                );
            }
        }
    ]
    // 获取参数
    getArgs = (currentPage = 1, pageSize = 10) => ({ currentPage, pageSize });
    // 获取主题列表
    getThemeList = async (params) => {
        let res = await fetcher(REQ_URL.SPECIAL_CHANNEL_PAGE, params);
        if (res.code === 0) {
            this.setState({
                themeList: res.data.channels.map(subject => {
                    return {
                        key: subject.id,
                        url: getBaseUrl('www') + `/${subject.id}`,
                        ...subject
                    };
                }),
                pagination: {
                    ...res.data.pagerVo,
                    total: res.data.pagerVo.records
                },
            });
        } else {
            console.error(res.errmsg);
        }
    }
    // 更改主题状态（禁用，启用）
    updateThemeState = async (record) => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_UPDATE, {
            ...record,
            enable: Number(!record.enable)
        });
        if (res.code === 0) {
            message.success('更新成功');
            this.getThemeList(this.state.pagination);
        } else {
            message.error(res.errmsg);
        }
    }
    // 删除主题
    removeTheme = async (record) => {
        this.setState({ selectedRowKeys: [] });
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DELETE_BATCH, {
            ids: isArray(record) ? record : [record],
        });
        res.code === 0 && (() => {
            this.getThemeList(this.getArgs(1, this.state.pagination.pageSize));
            return message.success('删除成功!');
        })();
        message.error(res.errmsg);
    }
    render() {
        const { pagination, selectedRowKeys } = this.state;
        return (
            <div>
                <div style={{ paddingBottom: '20px' }}>
                    <Button type='primary' style={{ marginRight: '20px' }}>
                        <Link to={`${urls.WEBSUBJECT}/add`}>新增专题</Link>
                    </Button>
                    <ConfirmButton
                        content='确认删除选中的专题？'
                        onClick={() => this.removeTheme(selectedRowKeys)}
                        disabled={!selectedRowKeys.length}
                    >删除
                    </ConfirmButton>
                </div>
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedRowKeys) => { this.setState({ selectedRowKeys }); },
                    }}
                    dataSource={this.state.themeList}
                    columns={this.columns}
                    pagination={{
                        ...pagination,
                        onChange: (currentPage, pageSize) => {
                            this.getThemeList(this.getArgs(currentPage, pageSize));
                        }
                    }}
                >
                </Table>
            </div>
        );
    }
}

export default WebpageTheme;
