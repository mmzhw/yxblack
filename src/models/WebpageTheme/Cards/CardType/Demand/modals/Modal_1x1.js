import React, { Component } from 'react';
import { Card, Table } from 'antd';

class Modal1x1 extends Component {
    componentDidMount () {
        console.log(this.props);
    }
    render() {
        return (
            <div>
                <Card>
                    <Table
                        dataSource = { (this.props.detail && this.props.detail.mdata) ? this.props.detail.mdata.videos : [] }
                        rowKey = 'id'
                    />
                </Card>
            </div>
        );
    }
}

export default Modal1x1;
