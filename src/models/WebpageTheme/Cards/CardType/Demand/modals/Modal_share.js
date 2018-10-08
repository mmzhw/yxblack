import React, { Component } from 'react';
import { Card, Table } from 'antd';

class ModalShareTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }
    _columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        }, {
            title: '缩略图',
            render: () => {
                return (
                    <div>这是个缩略图</div>
                );
            }
        }, {
            title: '标题',
            dataIndex: 'name',
        }, {
            title: '操作',
            render: (value, data, index) => {
                console.log(value, data, index);
            }
        }
    ];
    render() {
        const { dataSource, columns } = this.state;
        return (
            <Card>
                <Table
                    columns={columns || this._columns}
                    dataSource={dataSource}
                    rowKey='id'
                />
            </Card>
        );
    }
}

export { ModalShareTable };
