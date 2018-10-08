// 直播间配置
import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import Sortable from 'sortablejs';
import PropTypes from 'prop-types';

export default class LiveStreamConfig extends Component {
    static PropTypes = {
        tableData: PropTypes.array,
        handleEdit: PropTypes.func
    }

    columns = [{
        title: '直播间',
        dataIndex: 'circuit',
        key: 'circuit',
    }, {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
            return (
                <div>
                    <a onClick={() => this.props.handleEdit(record)} style={{ display: 'inline-block', marginRight: '10px' }}>编辑</a>
                    <Popconfirm title='你确定要删除这条记录吗?' onConfirm={() => this.props.handleDeleteLiveStreamRecord(record.id)} okText='是' cancelText='否'>
                        <a key='delete'>删除</a>
                    </Popconfirm>
                </div>
            );
        }
    }]

    transformIdToKey = (data) => {
        return data && data.map((item, index) => {
            return {
                key: item.id,
                circuit: `直播间${item.id}`,
                ...item,
            };
        });
    }

    componentDidMount() {
        const { tableData } = this.props;
        const elm = document.querySelector('.ant-table-tbody');
        new Sortable(elm, {
            onEnd: (event) => {
                this.props.hanleLiveStreamSortEnd(event.newIndex, event.oldIndex, tableData);
            }
        });
    }

    render() {
        const { tableData, saveLiveRoomOrder, showModal } = this.props;
        const dataSource = this.transformIdToKey(tableData);
        return (
            <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                />
                <Button type='primary' style={{ marginRight: '10px' }} onClick={saveLiveRoomOrder}>保存排序</Button>
                <Button type='primary' disabled = {dataSource.length >= 4} onClick={() => showModal({})}>新增直播线路</Button>
            </div>
        );
    }
}
