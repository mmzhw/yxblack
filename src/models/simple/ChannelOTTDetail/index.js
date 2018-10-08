import React, { Component } from 'react';
import style from './style.module.css';
import yxFetch from '../../../utils/tvFetch';
import LeftMenu from './LeftMenu';
import ModuleFirst from './Template/ModuleFirst';
import ModuleSec from './Template/ModuleSec';
import ModuleThird from './Template/ModuleThird';
import ModuleFourth from './Template/ModuleFourth';
import ConfigModule from './Config/ConfigModule';
import ConfigVideo from './Config/ConfigVideo';
import { REQ_URL } from '../../../constants/constants';
import { message } from 'antd';

// 获取相应模板的数目(作用於OTT)
const handleModuleType = (index) => {
    let num = 5;
    switch (Number(index)) {
        case 1:
            num = 4;
            break;
        case 2:
            num = 5;
            break;
        case 3:
            num = 2;
            break;
        case 4:
            num = 5;
            break;
    }
    return num;
};

let emptyVideo = {
    name: '',
    subName: '',
    videoId: '',
    url: '',
};

let emptyCard = {
    cardId: '',
    layoutName: '专辑名称',
    layoutId: '', // 模板类型
    itemCount: 4, // 模板默认video数目
    sort: 1,
    isEnable: 0,
    isMore: 0,
    moreUrl: '',
    loop: 1, // 模板循环显示
    videos: [emptyVideo, emptyVideo, emptyVideo, emptyVideo],
};

const OTT_MODULE = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FOURTH: 4,
};

class ChannelOTTDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            channelName: '',
            currentCardsIndex: Number(props.match.location.search.replace(/\?/g, '')) || 0, // 当前编辑的卡片在数组中的位置
            configVideoState: false, // 是否开始编辑视频信息
            currentVideoIndex: 0, // 当前编辑的视频在数组中的位置
            currentEditImgType: 1, // 当前编辑的视频封面图类型
        };
        this.tempCards = null;
        this.channelId = Number(props.match.match.params.id); // 获得channelId
    }

    componentDidMount () {
        this.getChannelList();
        this.findChannelInfo();
    }

    formatSort(cards) {
        cards = cards.map((card, index) => {
            card.sort = index + 1;
            return card;
        });
        return cards;
    }

    dragChannel(oldIndex, newIndex, cards) {
        cards.splice(newIndex, 0, ...cards.splice(oldIndex, 1));
        cards = this.formatSort(cards);
        this.updataChannelReq(cards);
    }

    async getChannelList() {
        let data = await this.fetchSubjectList(this.channelId);
        if (data) {
            this.setState({
                cards: data.cards,
            });
        }
    }

    // 获取所有的专题 --- done
    async fetchSubjectList (channelId) {
        try {
            const res = await yxFetch(REQ_URL.OTT_SEARCH_CHANNEL, {
                channelId: channelId,
                version: '1.0.0',
            });
            if (Number(res.code) === 0) {
                return res.data || [];
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            message.error(e.message || e);
        }
    }

    // 点击频道配置按钮(一级/二级) --- done
    handleClickSetBtn (channel) {
        this.props.match.history.push('/app/channelOTTDetail/' + channel.id, channel);
    }

    activateVideoConfig(index, imgType) {
        this.setState({
            configVideoState: true,
            currentVideoIndex: index,
            currentEditImgType: imgType,
        });
    }

    saveModuleData(values) {
        let { cards, currentCardsIndex } = this.state;
        let card = cards[currentCardsIndex];
        cards[currentCardsIndex] = {
            ...card,
            ...values
        };
        this.setState({
            cards: cards
        });
        this.updataChannelReq(cards);
    }

    deleteModule() {
        let self = this;
        let { cards, currentCardsIndex } = this.state;
        cards = cards.filter((card, index) => {
            return self.state.currentCardsIndex !== index;
        });
        this.setState({
            cards: cards,
            currentCardsIndex: currentCardsIndex - 1
        });
        this.updataChannelReq(cards);
    }

    // 修改，保存频道数据
    async updataChannelReq(cards) {
        try {
            const res = await yxFetch(REQ_URL.OTT_CARDS_CHANNEL, {
                channelId: this.channelId,
                version: '1.0.0',
                json: JSON.stringify({
                    cards: cards
                })
            });
            if (res.code === 0) {
                message.success('保存成功');
                this.tempCards = null;
                return res;
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            message.error(e.message || e);
        }
    }

    // 修改，保存频道数据
    async findChannelInfo() {
        try {
            const res = await yxFetch(REQ_URL.OTT_SEARCH_CHANNEL_BYID, {
                channelId: this.channelId,
            });
            if (res.code === 0) {
                this.setState({
                    channelName: res.data.name,
                });
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            message.error(e.message || e);
        }
    }

    saveVideoData(values) {
        let { cards, currentVideoIndex, currentCardsIndex } = this.state;
        cards[currentCardsIndex].videos[currentVideoIndex] = { ...values };
        this.setState({
            cards: cards
        });
        return this.updataChannelReq(cards);
    }

    // 左侧导航切换
    changeItem(index) {
        // 切换还原
        let { cards } = this.state;
        if (this.tempCards) {
            cards = this.tempCards;
        }
        this.tempCards = null;

        this.setState({
            currentCardsIndex: index,
            cards: cards,
            configVideoState: false,
        });
    }

    // 切换模板
    changeModule(value) {
        value = Number(value);
        let { cards, currentCardsIndex } = this.state;
        let card = cards[currentCardsIndex];

        if (!this.tempCards) { // 先保存临时的，并且点击保存要清除临时保存的数据,切换的时候需要还原
            this.tempCards = JSON.parse(JSON.stringify(cards));
        }

        card.videos = [];
        card.layoutId = value;
        card.itemCount = handleModuleType(card.layoutId);
        for (let i = 0; i < card.itemCount * card.loop; i++) {
            let tempVideo = this.tempCards[currentCardsIndex].videos[i] || emptyVideo;
            card.videos.push(tempVideo);
        }
        this.setState({
            cards: cards,
        });
    }

    // 修改视频个数，以循环为单位
    changeLoop(value) {
        value = Number(value);
        let { cards, currentCardsIndex } = this.state;
        let card = cards[currentCardsIndex];

        if (!this.tempCards) { // 修改视频个数，注意先保存临时的，并且点击保存要清除临时保存的数据,切换的时候需要还原
            this.tempCards = JSON.parse(JSON.stringify(cards));
        }

        let num = handleModuleType(card.layoutId) * value;
        card.videos = [];
        card.itemCount = handleModuleType(card.layoutId);
        card.loop = value;
        for (let i = 0; i < num; i++) {
            let tempVideo = this.tempCards[currentCardsIndex].videos[i] || emptyVideo;
            card.videos.push(tempVideo);
        }

        this.setState({
            cards: cards,
        });
    }

    // 增加模块
    addCard() {
        let { cards } = this.state;
        cards.push(JSON.parse(JSON.stringify(emptyCard)));
        this.setState({
            cards: cards,
            currentCardsIndex: cards.length - 1,
        });
    }

    render() {
        let modulePre = null;
        let { cards, currentCardsIndex, configVideoState, currentEditImgType } = this.state;
        if (cards.length > 0) {
            switch (cards[currentCardsIndex].layoutId) {
                case OTT_MODULE.FIRST:
                    modulePre = (<ModuleFirst card={cards[currentCardsIndex]} activateVideoConfig={this.activateVideoConfig.bind(this)} currentVideoIndex={this.state.currentVideoIndex} />);
                    break;
                case OTT_MODULE.SECOND:
                    modulePre = (<ModuleSec card={cards[currentCardsIndex]} activateVideoConfig={this.activateVideoConfig.bind(this)} currentVideoIndex={this.state.currentVideoIndex}/>);
                    break;
                case OTT_MODULE.THIRD:
                    modulePre = (<ModuleThird card={cards[currentCardsIndex]} activateVideoConfig={this.activateVideoConfig.bind(this)} currentVideoIndex={this.state.currentVideoIndex}/>);
                    break;
                case OTT_MODULE.FOURTH:
                    modulePre = (<ModuleFourth card={cards[currentCardsIndex]} activateVideoConfig={this.activateVideoConfig.bind(this)} currentVideoIndex={this.state.currentVideoIndex}/>);
                    break;
            }
        }

        return (
            <div className={style.OTTWrapper}>
                <div className={style.leftMenu}>
                    <LeftMenu
                        cards={cards}
                        dragChannel={this.dragChannel.bind(this)}
                        currentCardsIndex={currentCardsIndex}
                        changeItem={this.changeItem.bind(this)}
                        addCard={this.addCard.bind(this)}
                    />
                </div>
                <div className={style.rightPre}>
                    <div className={style.top}>
                        <div className={style.title}>
                            <p>页面布局</p>
                            <span>点击相应区域，可配置内容</span>
                        </div>
                        <div className={style.content}>
                            {modulePre}
                        </div>
                    </div>
                    <div className={style.config}>
                        {
                            configVideoState ? (
                                <ConfigVideo
                                    card={cards[currentCardsIndex].videos[this.state.currentVideoIndex] || {}}
                                    channelName={this.state.channelName}
                                    imgType={currentEditImgType}
                                    saveVideoData={this.saveVideoData.bind(this)}
                                    layoutId={this.state.cards[currentCardsIndex].layoutId}
                                />
                            ) : (
                                cards[currentCardsIndex] ? (
                                    <ConfigModule
                                        card={cards[currentCardsIndex]}
                                        currentCardsIndex={currentCardsIndex}
                                        channelName={this.state.channelName}
                                        changeLoop={this.changeLoop.bind(this)}
                                        changeModule={this.changeModule.bind(this)}
                                        deleteModule={this.deleteModule.bind(this)}
                                        saveModuleData={this.saveModuleData.bind(this)}
                                    />
                                ) : null
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ChannelOTTDetail;
