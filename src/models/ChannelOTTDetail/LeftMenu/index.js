import React, { Component } from 'react';
import style from './style.module.css';
import { Button, message } from 'antd';
import Sortable from 'sortablejs';

export default class LayoutMenus extends Component {
    componentDidUpdate() {
        let self = this;

        Sortable.create(this.refs.groups, {
            animation: 150,
            filter: '.filterMenu',
            onEnd: (e) => {
                if (e.oldIndex === 0 || e.newIndex === 0) {
                    message.error('不支持修改第一个模块的顺序，即将刷新页面', 2, () => {
                        window.location.reload();
                    });
                    return;
                }
                if (e.oldIndex >= self.props.cards.length || e.newIndex >= self.props.cards.length) {
                    return;
                }
                self.props.dragChannel(e.oldIndex, e.newIndex, self.props.cards);
            }
        });
    }

    render() {
        return (
            <div className={style.leftMenu}>
                <div className={style.title}>
                    <p>页面布局</p>
                    <span>点击激活组件</span>
                </div>
                <div className={style.content}>
                    <div className={style.cardList} ref='groups'>
                        {
                            this.props.cards && this.props.cards.map((item, index) => {
                                return (
                                    <div key={index} className={index === 0 ? 'filterMenu' : ''}>
                                        <Button
                                            key={index}
                                            type='default'
                                            className={this.props.currentCardsIndex === index ? style.buttonActive : style.buttonNotActive }
                                            onClick={() => { this.props.changeItem(index); }}
                                        >
                                            {item.layoutName.length > 10 ? item.layoutName.slice(0, 10) + '...' : item.layoutName}
                                        </Button>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={style.cardOperation}>
                        <Button className={style.buttonActive} type='default' onClick={this.props.addCard}>添加模块</Button>
                    </div>
                </div>
            </div>
        );
    }
}
