import React, { Component } from 'react';
import { Switch, Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import yxFetch from '../../../utils/fetch.js';
import style from './style.module.css';
import { REQ_URL } from '../../../constants/constants';
import { SUBJECT_MAP } from '../../../constants';

const tplArr = [{
    name: 'A1',
    icon: 'A1',
    id: 2,
}, {
    name: 'A2（有二级标题）',
    icon: 'A1',
    id: 7,
}, {
    name: 'B1',
    icon: 'B',
    id: 5,
}, {
    name: 'B2（有二级标题）',
    icon: 'B',
    id: 6,
}, {
    name: 'C',
    icon: 'C',
    id: 1,
}, {
    name: 'D',
    icon: 'D',
    id: 3,
}, {
    name: 'E',
    icon: 'E',
    id: 4,
}];

// 对于每个专题自己的配置
class Config extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.props, {
            title: this.props.cards[this.props.currentCardsIndex].title,
            isEnable: this.props.cards[this.props.currentCardsIndex].isEnable,
            isMore: this.props.cards[this.props.currentCardsIndex].isMore,
            layoutId: this.props.cards[this.props.currentCardsIndex].layoutId,
            moreUrl: this.props.cards[this.props.currentCardsIndex].moreUrl
        });
    }

    componentWillReceiveProps = (nextProps) => { // 更改组件的props从而重新渲染组件
        this.setState({
            cards: nextProps.cards,
            currentCardsIndex: nextProps.currentCardsIndex,
            title: nextProps.cards[nextProps.currentCardsIndex].title,
            isEnable: nextProps.cards[nextProps.currentCardsIndex].isEnable,
            isMore: nextProps.cards[nextProps.currentCardsIndex].isMore,
            layoutId: nextProps.cards[nextProps.currentCardsIndex].layoutId,
            moreUrl: nextProps.cards[nextProps.currentCardsIndex].moreUrl,
        });
    }
    // 切换是否启用
    handleChange = (isEnable) => {
        this.setState({
            isEnable: +isEnable
        });
    }
    // 切换更多
    onChange = (isMore) => {
        this.setState({
            isMore: +isMore
        });
    }
    // 改变模板类型
    handleSelectChange = (selected) => {
        this.setState({
            layoutId: +selected
        });
        this.props.handleLayoutChange(+selected);
        this.props.handleTitleChange(this.state.title);
    }
    // 改变标题
    handleTitleChange = (event) => {
        const text = event.target.value;
        if (text.length <= 20) {
            this.setState({
                title: text
            });
        }
    }
    // url改变的时候
    handleMoreUrlChange = (event) => {
        const text = event.target.value;
        this.setState({
            moreUrl: text.trim()
        });
    }
    cleanData (cards) {
        cards.forEach((card) => {
            let layoutId = Number(card.layoutId);
            card.videos = card.videos.slice(0, SUBJECT_MAP[layoutId]);
        });
        return cards;
    }
    // 保存配置
    saveConfig = () => {
        const {
            title,
            isMore,
            moreUrl,
            cards,
            currentCardsIndex,
            layoutId
        } = this.state;
        if (title.length === 0) {
            message.error('标题不能为空！');
            return;
        }

        if (isMore && moreUrl === '') {
            message.error('url不能为空');
            return;
        }

        this.props.handleTitleChange(title);
        const videos = cards[currentCardsIndex].videos;

        const length = SUBJECT_MAP[layoutId];
        let _videos = videos.slice(0, length);

        Object.assign(cards[this.state.currentCardsIndex], {
            isEnable: this.state.isEnable,
            isMore: this.state.isMore,
            layoutId: this.state.layoutId,
            moreUrl: this.state.moreUrl,
            title: this.state.title,
            videos: _videos,
        });
        let resultCards = this.cleanData(this.state.cards); // 防止数量超过限定
        yxFetch(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: this.props.channelId,
            version: '1.0.0',
            json: JSON.stringify({
                version: 1,
                timestamp: '',
                cards: resultCards,
            })
        }).then(() => {
            message.info('保存成功！');
            this.props.getChannelList(this.props.channelId);
        }).catch(() => {
            message.error('保存失败！');
        });
    }

    render() {
        const { title, isMore, isEnable, layoutId, moreUrl } = this.state;

        let enableSwitch = null;
        let moreSwitch = null;

        if (isEnable) {
            enableSwitch = <Switch checked={true} onChange={this.handleChange} />;
        } else {
            enableSwitch = <Switch checked={false} onChange={this.handleChange} />;
        }

        if (isMore) {
            moreSwitch = <Switch checked={true} onChange={this.onChange} />;
        } else {
            moreSwitch = <Switch checked={false} onChange={this.onChange} />;
        }
        return (
            <div>
                <div className={style['config']}>
                    <p className={style['config-title']}>组件类型</p>
                    <p className={style['config-detail']}>专题卡片</p>
                </div>
                <div className={style['config']}>
                    <p className={style['config-title']}>专题名称</p>
                    <Input
                        className={style['config-input']}
                        placeholder='标题'
                        onChange={this.handleTitleChange}
                        value={title}
                    />
                </div>
                <div className={style['config']}>
                    <p className={style['config-title']}>模板类型</p>
                    <div className={style['template-type-wrap']}>
                        {
                            tplArr && tplArr.map(tpl => {
                                return (
                                    <div
                                        key={tpl.id}
                                        className={layoutId === tpl.id ? style['active'] : ''}
                                        onClick={() => this.handleSelectChange(tpl.id)}
                                    >
                                        <img alt='' src={require(`../../../assets/${tpl.icon}.png`)} />
                                        <p>{tpl.name}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={style['config-switch']}>
                    {enableSwitch}
                    <span style={{ marginLeft: '10px' }}>启用组件</span>
                </div>
                <div className={style['config-switch']}>
                    {moreSwitch}
                    <span style={{ marginLeft: '10px' }}>更多</span>
                    {
                        isMore ? (
                            <Input
                                className={style['config-input']}
                                placeholder='URL'
                                value={moreUrl}
                                onChange={this.handleMoreUrlChange}
                            />
                        ) : null
                    }
                </div>
                <Button type='primary' onClick={this.saveConfig.bind(this)} className={style['config-save']}>保存</Button>
            </div>
        );
    }
}
Config.propTypes = {
    cards: PropTypes.array.isRequired,
    currentCardsIndex: PropTypes.number.isRequired,
};

export default Config;
