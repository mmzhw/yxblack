import React, { Component } from 'react';
import { ModalShareTable } from './Modal_share';

class Modal1x6 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        };
    }
    componentDidMount() {
        console.log(this.props.detail.mdata.videos);
    }
    render() {
        return (
            <div>
                <ModalShareTable
                    dataSource={(this.props.detail && this.props.detail.mdata) ? this.props.detail.mdata.videos : []}
                />
            </div>
        );
    }
}

export default Modal1x6;
