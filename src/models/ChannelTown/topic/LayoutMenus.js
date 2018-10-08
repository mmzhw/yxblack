import React, { Component } from 'react';
import { Button } from 'antd';
import style from './style.module.css';
import PropTypes from 'prop-types';
import Sortable from 'sortablejs';
import { sortElm } from '../../../utils/util';

export default class LayoutMenus extends Component {
    componentWillReceiveProps(nextProps) { // 更改组件的props从而重新渲染组件
        const self = this;
        // if (!this.cards || this.cards.length === 0) {
        //   this.cards = nextProps.cards
        // }
        // this.setState({
        //   cards: nextProps.cards
        // }, () => {
        if (!nextProps.cards || nextProps.cards.length === 0) {
            return;
        }
        Sortable.create(document.getElementById('btnList'), {
            onEnd: function(event) {
                const newIndex = event.newIndex;
                const oldIndex = event.oldIndex;
                // const _old = nextProps.cards.splice(oldIndex, 1)
                // self.props.cards.splice(newIndex, 0, _old[0])

                const cards = self.props.cards;
                const newCards = sortElm(newIndex, oldIndex, cards);
                self.props.sortByDrag(newCards);
            }
        });
    // })
    }
    // 擦  为什么要删除前缀
    saveList = () => {
        const cards = this.props.cards.slice();
        this.props.updateLego(cards);
    }
    render() {
        const { cards } = this.props;
        return (
            <div className={style['channel-layout']}>
                <div className={style['card-header']}>
                    <div className={style['card-header-title']}>页面布局</div>
                    <div className={style['card-header-sub']}>点击激活组件</div>
                </div>
                <div className={style['card-content']}>
                    <div className={style['channel-topic-container']}>
                        <div className={style['btn-container']}>
                            <Button type='default' className={style[this.props.currentCardsIndex === -1 ? 'current-button' : '']} onClick={this.props.bannerBtnClick}>banner</Button>
                            <div id='btnList'>
                                {
                                    cards && cards.map((item, index) => {
                                        return (
                                            <div key={item.id}>
                                                <Button
                                                    type='default'
                                                    className={`${style['topic-btn']} ${style[this.props.currentCardsIndex === index ? 'current-button' : '']}`}
                                                    onClick={this.props.changeItem.bind(null, index)}
                                                >
                                                    {item.title.length > 10 ? item.title.slice(0, 10) + '...' : item.title}
                                                </Button>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className={style['channel-btn-container']}>
                                <Button type='primary' onClick={this.props.addCard}>添加专辑</Button>
                                <Button type='primary' onClick={this.saveList}>保存排序</Button>
                                <Button type='primary' onClick={this.props.updateRelease}>发布更新</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LayoutMenus.propTypes = {
    cards: PropTypes.array,
    changeItem: PropTypes.func,
};
