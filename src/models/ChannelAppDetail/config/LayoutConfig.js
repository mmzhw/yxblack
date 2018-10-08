import React, { Component } from 'react';
import style from './style.module.css';

export default class ChannelConfig extends Component {
    render() {
        return (
            <div className={style['channel-config']}>
                <div className={style['card-header']}>
                    <div className={style['card-header-title']}>配置</div>
                    <div className={style['card-header-sub']}></div>
                </div>
            </div>
        );
    }
}
