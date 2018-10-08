import React, { Component } from 'react';
import style from './style.module.css';

class Corner extends Component {
    render() {
        return (
            <div className={ style['bookshelf-enable'] }>
                <span style={{ background: this.props.enable === -1 ? '#E95337' : (this.props.enable === 1 ? '#7ED41A' : '#CCC') }}>{this.props.enable === -1 ? '属性' : (this.props.enable === 1 ? '已启用' : '未启用')}</span>
            </div>
        );
    }
}

export default Corner;
