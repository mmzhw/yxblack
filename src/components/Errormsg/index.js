import React, { Component } from 'react';
import style from './style.module.css';

class YXErrorMsg extends Component {
    render() {
        return (
            <div className={style['error-container']}>
                <img alt='' src={require('../../assets/noResult.png')} />
                <p className={style['error-msg']}>{this.props.errorMessage}</p>
            </div>
        );
    }
}

export default YXErrorMsg;
