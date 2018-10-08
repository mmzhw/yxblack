import React, { Component } from 'react';
import { Switch, Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import yxFetch from '../../../utils/fetch.js';
import style from './style.module.css';
import { handleImgUrl } from '../../../utils/util';
import Upload from '../../../components/Upload/index.js';
import { REQ_URL } from '../../../constants/constants';
import { SUBJECT_MAP } from '../../../constants';

// 可配置模块
export const SUBJECT_TPL_ARR = [{
    name: 'A1',
    icon: 'A1',
    id: 2,
}, /*, {
  name: 'A2（有二级标题）',
  icon: 'A1',
  id: 7,
}*/ {
    name: 'B1',
    icon: 'B',
    id: 5,
}, /*, {
  name: 'B2（有二级标题）',
  icon: 'B',
  id: 6,
}*/ {
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
}, {
    name: 'F',
    icon: 'F',
    id: 8,
}, {
    name: 'G',
    icon: 'G',
    id: 9,
}];

class Config extends Component {
    constructor(props) {
        super(props);
        let adTempEnable = this.props.cards[this.props.currentCardsIndex].adEnable;
        this.state = Object.assign({}, this.props, {
            title: this.props.cards[this.props.currentCardsIndex].title,
            isEnable: this.props.cards[this.props.currentCardsIndex].isEnable,
            adEnable: adTempEnable === undefined ? 0 : adTempEnable,
            isMore: this.props.cards[this.props.currentCardsIndex].isMore,
            layoutId: this.props.cards[this.props.currentCardsIndex].layoutId,
            moreUrl: this.props.cards[this.props.currentCardsIndex].moreUrl,
            moreId: this.props.cards[this.props.currentCardsIndex].moreId || '',
            iconImgUrl: this.props.cards[this.props.currentCardsIndex].iconImgUrl || '',
            appids: [],
        });
        this.selectChange = this.selectChange.bind(this);
        this.getGroupsData();
    }

    componentWillReceiveProps(nextProps) { // 更改组件的props从而重新渲染组件
        let self = this;
        let adTempEnable = nextProps.cards[nextProps.currentCardsIndex].adEnable;
        this.setState({
            cards: nextProps.cards,
            currentCardsIndex: nextProps.currentCardsIndex,
            title: nextProps.cards[nextProps.currentCardsIndex].title,
            isEnable: nextProps.cards[nextProps.currentCardsIndex].isEnable,
            adEnable: adTempEnable === undefined ? 0 : adTempEnable,
            isMore: nextProps.cards[nextProps.currentCardsIndex].isMore,
            layoutId: nextProps.cards[nextProps.currentCardsIndex].layoutId,
            moreUrl: nextProps.cards[nextProps.currentCardsIndex].moreUrl,
            moreId: nextProps.cards[nextProps.currentCardsIndex].moreId || '',
            iconImgUrl: nextProps.cards[nextProps.currentCardsIndex].iconImgUrl || '',
        }, () => {
            self.upSelectOption();
        });
    }

    selectChange(e) {
        this.setState({
            moreId: e.currentTarget.value
        });
    }

    upSelectOption() {
        let self = this;
        this.state.appids.forEach((appid, index) => {
            if (appid.id === self.state.moreId && self.refs.subSel) {
                self.refs.subSel.selectedIndex = index;
            }
        });
    }

    // 获取频道列表
    getGroupsData() {
        let self = this;
        yxFetch(REQ_URL.GET_CHANNEL_CACHE, {}).then(res => {
            if (res.code === 0) {
                if (res.code === 0) {
                    if (res.data && res.data.length > 0) { // 如果缓存中有数据
                        let temp = [];
                        JSON.parse(res.data).forEach((appid, index) => {
                            if (appid.enable) {
                                temp.push({
                                    id: appid.id,
                                    name: appid.name,
                                });
                            }
                        });
                        self.setState({
                            appids: temp,
                            moreId: self.state.moreId && self.state.moreId !== 0 ? self.state.moreId : temp[0].id
                        }, () => {
                            self.upSelectOption();
                        });
                    }
                }
            } else {
                message.error(res.errmsg);
            }
        });
    }

    handleChange(isEnable) {
        this.setState({
            isEnable: +isEnable
        });
    }

    adChange(isEnable) {
        this.setState({
            adEnable: +isEnable
        });
    }

    onChange(isMore) {
        this.setState({
            isMore: +isMore
        });
    }

    handleSelectChange(selected) {
        this.setState({
            layoutId: +selected
        });
        this.props.handleLayoutChange.bind(this.props.parent, +selected)();
        this.props.handleTitleChange.bind(this.props.parent, this.state.title)();
    }

    handleTitleChange(event) {
        const text = event.target.value;
        if (text.length <= 20) {
            this.setState({
                title: text
            });
        }
    }

    handleMoreUrlChange(event) {
        const text = event.target.value;
        this.setState({
            moreUrl: text.trim()
        });
    }

    // 保存模版的時候更新scale類型
    updateCards() {
        let cards = this.state.cards;
        switch (cards[this.state.currentCardsIndex].layoutId) {
            case 9:
                cards[this.state.currentCardsIndex].videos.forEach((video, index) => {
                    if (index === 0 || index === 1) {
                        video.scale = 0;
                    } else if (index > 1 && index < 10) {
                        video.scale = 1;
                    } else if (index === 10) {
                        video.scale = 6;
                    }
                });
                break;
            case 8:
                cards[this.state.currentCardsIndex].videos.forEach((video, index) => {
                    if (index === 0) {
                        video.scale = 0;
                    } else if (index > 0 && index < 10) {
                        video.scale = 1;
                    }
                });
                break;
            default:
                break;
        }
        this.setState({ cards: cards });
        return cards[this.state.currentCardsIndex].videos;
    }

    // 保存卡片的时候，卡片类型
    saveConfig() {
        if (!this.state.title) {
            message.error('标题不能为空！');
            return;
        }
        if (this.state.isMore && this.state.moreUrl === '') {
            message.error('url不能为空');
            return;
        }
        this.props.handleTitleChange.bind(this.props.parent, this.state.title)();
        const videos = this.updateCards();
        const length = SUBJECT_MAP[this.state.layoutId]; // 根據layoutID獲取此模版video個數
        let _videos = videos.slice(0, length);
        Object.assign(this.state.cards[this.state.currentCardsIndex], {
            isEnable: this.state.isEnable,
            isMore: this.state.isMore,
            adEnable: this.state.adEnable,
            layoutId: this.state.layoutId,
            moreUrl: this.state.moreUrl,
            title: this.state.title,
            iconImgUrl: this.state.iconImgUrl,
            videos: _videos,
            moreId: window.parseInt(this.state.moreId),
        });
        yxFetch(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: this.props.parent.channelId,
            version: '1.0.0',
            json: JSON.stringify({
                version: 1,
                timestamp: '',
                cards: this.cleanData(this.state.cards)
            })
        }).then(() => {
            message.info('保存成功！');
            this.props.getChannelList();
        }).catch(() => {
            message.error('保存失败！');
        });
    }

    uploadDone(imgScale, key) {
        this.setState({
            iconImgUrl: key,
        });
    }

    cleanData = (cards) => {
        cards.map((card) => {
            switch (Number(card.layoutId)) {
                case 1:
                    card.videos = card.videos.slice(0, 1);
                    break;
                case 2:
                case 7:
                    card.videos = card.videos.slice(0, 4);
                    break;
                case 3:
                    card.videos = card.videos.slice(0, 6);
                    break;
                case 4:
                    card.videos = card.videos.slice(0, 7);
                    break;
                case 5:
                case 6:
                    card.videos = card.videos.slice(0, 5);
                    break;
                default:
                    break;
            }
            return card;
        });
        return cards;
    }

    render() {
        const title = this.state.title;
        const isMore = this.state.isMore;
        const isEnable = this.state.isEnable;
        const layoutId = this.state.layoutId;
        const moreUrl = this.state.moreUrl;
        const adEnable = this.state.adEnable;
        let enableSwitch = null;
        let moreSwitch = null;
        let adSwitch = null;
        if (isEnable) {
            enableSwitch = <Switch checked={true} onChange={this.handleChange.bind(this)}/>;
        } else {
            enableSwitch = <Switch checked={false} onChange={this.handleChange.bind(this)}/>;
        }
        if (isMore) {
            moreSwitch = <Switch checked={true} onChange={this.onChange.bind(this)}/>;
        } else {
            moreSwitch = <Switch checked={false} onChange={this.onChange.bind(this)}/>;
        }
        if (adEnable) {
            adSwitch = <Switch checked={true} onChange={this.adChange.bind(this)}/>;
        } else {
            adSwitch = <Switch checked={false} onChange={this.adChange.bind(this)}/>;
        }
        let moreConfig = null;
        let adAppear = null;
        if (layoutId === 9) {
            moreConfig = (<div className={style[['config']]}>
                <p className={style['config-title']} >跳转频道</p>
                <select onChange={this.selectChange} ref='subSel'>
                    {
                        this.state.appids.map((appid, index) => {
                            return (<option key={index} value={appid.id} >{appid.name}</option>);
                        })
                    }
                </select>
            </div>);
            adAppear = (<div className={style[['config-switch']]}>
                {adSwitch}
                <span style={{ marginLeft: '10px' }}>是否显示广告</span>
            </div>);
        }
        return (
            <div>
                <div className={style[['config']]}>
                    <p className={style['config-title']}>组件类型</p>
                    <p className={style['config-detail']}>专题卡片</p>
                </div>
                <div className={style[['config']]}>
                    <p className={style['config-title']}>专题名称</p>
                    <Input placeholder='标题' onChange={this.handleTitleChange.bind(this)} value={title}
                        className={style['config-input']}/>
                </div>
                <div className={style['config-upload']}>
                    <span>图标：</span>
                    <Upload
                        figureWidth={30}
                        figureHeight={30}
                        uploadDone={this.uploadDone.bind(this)}
                        showImgUrl={handleImgUrl(this.state.iconImgUrl)}
                    />
                </div>
                {moreConfig}
                <div className={style[['config']]}>
                    <p className={style['config-title']}>模板类型</p>
                    <div className={style['template-type-wrap']}>
                        {
                            SUBJECT_TPL_ARR.map(tpl => {
                                return (
                                    <div
                                        key={tpl.id}
                                        className={layoutId === tpl.id ? style['active'] : ''}
                                        onClick={() => this.handleSelectChange(tpl.id)}
                                    >
                                        <img alt='' src={require(`../../../assets/${tpl.icon}.png`)}/>
                                        <p>{tpl.name}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={style[['config-switch']]}>
                    {enableSwitch}
                    <span style={{ marginLeft: '10px' }}>启用组件</span>
                </div>
                <div className={style[['config-switch']]}>
                    {moreSwitch}
                    <span style={{ marginLeft: '10px' }}>更多</span>
                    {
                        isMore ? (
                            <Input placeholder='URL' value={moreUrl} onChange={this.handleMoreUrlChange.bind(this)}
                                className={style['config-input']}/>
                        ) : ('')
                    }
                </div>
                {adAppear}
                <Button type='primary' onClick={this.saveConfig.bind(this)} className={style['config-save']}>保存</Button>
            </div>
        );
    }
}

Config.propTypes = {
    cards: PropTypes.array.isRequired,
    currentCardsIndex: PropTypes.number.isRequired
};
export default Config;
