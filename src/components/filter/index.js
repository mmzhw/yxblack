import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';

class YXFilter extends Component {
    constructor(props) {
        super(props);
        const { callback } = this.props;
        this.callback = callback;

        this.state = this.props;
    }
    handleItemClick(typeKey, optionKey) {
        this.state.conditions.forEach((item) => {
            if (item.title.name === typeKey) {
                item.activeKey = optionKey;
            }
        });

        this.setState({
            conditions: this.state.conditions
        });
        this.callback(typeKey, optionKey);
    }
    render() {
        return (
            <div className={`${style['filter-container']} ${style['clearfix']}`}>
                {
                    this.state.conditions.length > 0 ? this.state.conditions.map((item, i) => {
                        return (
                            <div key={i} className={`${style['filter-itemwrap']} ${style['clearfix']}`}>
                                <div className={style['label-name']}>{ item.title.name }：</div>
                                <ul className={`${style['filter-item']} ${style['clearfix']}`}>
                                    {
                                        item.content.length > 0 ? item.content.map((subItem, j) => {
                                            return (
                                                <li className={`${style['filter-sub-item']} ${item.activeKey === subItem.key ? style['highlight'] : ''}`} key={j} onClick={this.handleItemClick.bind(this, item.title.key, subItem.key)}>
                                                    <span>{ subItem.name }</span>
                                                </li>
                                            );
                                        }) : ''
                                    }
                                </ul>
                            </div>
                        );
                    }) : ''
                }
            </div>
        );
    }
}

YXFilter.propTypes = {
    conditions: PropTypes.array.isRequired,
    callback: PropTypes.func.isRequired
};

export default YXFilter;
