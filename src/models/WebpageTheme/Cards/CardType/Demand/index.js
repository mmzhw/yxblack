import React, { Component } from 'react';

// 每个模板都设置了一个js文件，目的防止以后改变模板内容。这是增大空间来避免混乱
import Modal1x1 from './modals/Modal_1x1';
import Modal2x6 from './modals/Modal_2x6';
import Modal1x6 from './modals/Modal_1x6';
import Modal2x3x2 from './modals/Modal_2x3+2x3';
import Modal1x4 from './modals/Modal_1x4';
import Modal3x2 from './modals/Modal_3x2';
import Modal1and2x2 from './modals/Modal_1+2x2';

import styles from '../style.module.css';

const modalMap = {
    1: Modal1x1,
    2: Modal2x6,
    3: Modal1x6,
    4: Modal2x3x2,
    5: Modal1x4,
    6: Modal3x2,
    7: Modal1and2x2,
};

class Demand extends Component {
    _callBack = () => {

    }
    render() {
        const RenderModal = modalMap[this.props.detail.layoutId];
        return (
            <div>
                <header className={ styles['card-detail-header']}>点播</header>
                <RenderModal callback={this._callBack} detail={this.props.detail} />
            </div>
        );
    }
}

export default Demand;
