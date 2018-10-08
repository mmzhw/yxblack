// 专题管理首页
import React, { Component } from 'react';
import { Table, message } from 'antd';
import moment from 'moment';
import fetcher from '../../utils/fetch';
import { REQ_URL } from '../../constants/constants';

const pointResourceMap = {
    1: '签到',
    2: '观看一个视频',
    3: '观看5个视频及以上',
    4: '首次上传短视频且审核通过',
    5: '分享视频',
    6: '完善我的资料',
    7: '分享app',
    8: '当日点赞视频3次及以上',
    9: '上传视频且审核通过（非首次上传）',
    11: '其它'
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
            title: '积分（金币）来源',
            dataIndex: 'pointsType',
            key: 'pointsType',
            render: (value) => {
                return (<span>{pointResourceMap[value]}</span>);
            }
        },
        {
            title: '积分（金币）',
            dataIndex: 'incrementPoints',
            key: 'incrementPoints',
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
        let res = await fetcher(REQ_URL.USER_POINTS_LIST, params);
        if (res.code === 0) {
            this.setState({
                list: res.data.userPointsVos,
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
