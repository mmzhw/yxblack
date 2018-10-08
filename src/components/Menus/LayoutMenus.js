import React, { Component } from 'react';
import { Button } from 'antd';
import style from './LayoutMenus.module.css';
import PropTypes from 'prop-types';
import Sortable from 'sortablejs';

export default class LayoutMenus extends Component {
    static PropTypes = {
        menus: PropTypes.func,
        changeMenuItem: PropTypes.object,
        curMenuIndex: PropTypes.number,
        dragMenuItem: PropTypes.func,
        handleSaveOrder: PropTypes.func,
        buttons: PropTypes.array
    }

    componentWillReceiveProps(nextProps) { // 更改组件的props从而重新渲染组件
    // const self = this
        if (!nextProps.menus || nextProps.menus.length === 0) {
            return;
        }
        Sortable.create(document.getElementById('btnList'), {
            onEnd: (event) => {
                this.props.dragMenuItem(event.newIndex, event.oldIndex);
            }
        });
    }

    saveList = () => {
        const menus = this.props.menus.slice();
        this.props.sortMenus(menus);
    }

    render() {
        const { menus, buttons } = this.props;
        return (
            <div className={style['channel-layout']}>
                <div className={style['card-header']}>
                    <div className={style['card-header-title']}>页面布局</div>
                    {/* <div className={style['card-header-sub']}>点击激活组件</div> */}
                </div>
                <div className={style['card-content']}>
                    <div className={style['channel-topic-container']}>
                        <div className={style['btn-container']}>
                            {/* <Button type='default' className={style[this.props.curMenuIndex === -1 ? 'current-button' : '']} onClick={this.props.bannerBtnClick}>banner</Button> */}
                            <div id='btnList'>
                                {
                                    menus && menus.map((item, index) => {
                                        return (
                                            <div key={item.id}>
                                                <Button type='default'
                                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                    className={`${style['topic-btn']} ${style[this.props.curMenuIndex === index ? 'current-button' : '']}`}
                                                    onClick={this.props.changeMenuItem.bind(null, index)}
                                                >{item.menuName}</Button>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className={style['channel-btn-container']}>
                                { buttons }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
