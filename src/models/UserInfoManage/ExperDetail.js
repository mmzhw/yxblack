// 专题管理首页
import React, { Component } from 'react';
import { Table, message } from 'antd';
import moment from 'moment';
import fetcher from '../../utils/fetch';
import { REQ_URL } from '../../constants/constants';

const pointResourceMap = {
    1: '每日打开app',
    2: '累计观看超过15分钟',
    3: '分享和点赞',
};

class PointDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [], // 列表数据
            pagination: {}
        };
    }
    componentDidMount() {
        this.getList(this._getArgs());
    }

    columns = [
        {
            title: '经验来源',
            dataIndex: 'experienceType',
            key: 'experienceType',
            render: (value) => {
                return (<span>{pointResourceMap[value]}</span>);
            }
        },
        {
            title: '经验值',
            dataIndex: 'incrExperience',
            key: 'incrExperience',
        },
        {
            title: '时间',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            render: (value, recode, index) => {
                return (
                    <span>{moment(value).format('YYYY-MM-DD HH:mm')}</span>
                );
            }
        },
    ]
    // 获取列表
    getList = async (params) => {
        let res = await fetcher(REQ_URL.USER_EXPER_LIST, params);
        if (res.code === 0) {
            this.setState({
                list: res.data.userExperVos,
                pagination: {
                    ...res.data.pager,
                    curret: res.data.pager.pageNo,
                    total: res.data.pager.records
                },
            });
        } else {
            message.error('获取列表失败！！');
            console.error(res.errmsg);
        }
    }

    _getArgs = (current = 1, pageSize = 10) => {
        return {
            currentPage: current,
            pageSize: pageSize,
            uid: this.props.uid
        };
    }

    render() {
        const { pagination } = this.state;
        return (
            <div>
                <Table
                    size='small'
                    dataSource={this.state.list}
                    columns={this.columns}
                    rowKey={record => record.gmtCreated + Math.floor(Math.random() * 1000)}
                    pagination={{
                        ...pagination,
                        onChange: (currentPage, pageSize) => {
                            this.getList(this._getArgs(currentPage, pageSize));
                        }
                    }}
                />
            </div>
        );
    }
}

export default PointDetail;
