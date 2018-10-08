import React, { Component } from 'react';
import Banner from './Banner';
import style from './style.module.css';
import LayoutMenus from './topic/LayoutMenus.js';
import Template from './template/index.js';
import Config from './config/index.js';
import VideoConfig from './videoConfig/index.js';
import BannerConfig from './Banner/BannerConfig';
import yxFetch from '../../utils/fetch';
import { message } from 'antd';
import alterBreadItemName from '../../utils/alterBreadItemName.js';
import { REQ_URL } from '../../constants/constants';
import { SUBJECT_MAP } from '../../constants';

class ChannelAppDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerOn: false,
            bannerListLength: 1, // banner的个数(默认1个)
            bannerWidth: 375, // 整个banner的长度(默认1个的长度)
            bannerList: [
                {
                    channelId: null,
                    id: null,
                    imageId: null,
                    imageUrl: null,
                    schemeUrl: '',
                    secondTitle: '',
                    sort: 0,
                    title: ''
                }
            ], // banner内容 （默认一个）
            bannerIndex: 1, // 滑动到的bannerIndex
            translateX: 0, // 滑动的距离
            isBannerEnabled: false, // banner 是否启用
            addBannerEnabled: false,
            layoutStatus: 0, // 0-banner,1-bannerItem,2-card,3-cardItem
            editBannerItemIndex: 0,
            cards: [], // 专题列表
            currentCardsIndex: -1, // -1-banner, 大于0，当前专题index
            currentVideoIndex: null, // 当前视频index
            currentVideoScale: 1
        };
        this.addCard = this.addCard.bind(this);
        this.getBannerIndex = this.getBannerIndex.bind(this); // 从子组件获得bannerIndex
        this.addBanner = this.addBanner.bind(this); // 子组件点击添加按钮
        this.changeTranslateX = this.changeTranslateX.bind(this); // 子组件改变banner
        this.isBannerEnabledChange = this.isBannerEnabledChange.bind(this); // config组件控制banner是否启用
        this.editBannerItem = this.editBannerItem.bind(this); // 在编辑的banner图片
        this.refreshBanner = this.refreshBanner.bind(this); // 新增，修改，删除之后页面刷新
        this.bannerBtnClick = this.bannerBtnClick.bind(this); // 左边banner按钮
        this.channelId = Number(props.match.match.params.id); // 获得channelId
    }

    // banner方法
    // 从子组件获取bannerIndex
    getBannerIndex(event) {
        this.setState({
            bannerIndex: event
        });
    }
    // 获取banner列表
    getBannerList() {
        yxFetch(REQ_URL.BANNER, { channelId: this.channelId }).then((res) => {
            if (res.code === 0) {
                if (res.data.length !== 0) {
                    if (this.state.bannerIndex > res.data.length) {
                        this.setState({
                            bannerIndex: res.data.length,
                            translateX: -(res.data.length - 1) * 375
                        });
                    }
                    this.setState({
                        bannerList: res.data,
                        bannerWidth: res.data.length * 375,
                        bannerListLength: res.data.length,
                        addBannerEnabled: (res.data.length === 10)
                    });
                }
            } else {
                message.error(res.errmsg);
            }
        }).catch(() => {
            message.error('系统错误！');
        });
    }

    // 防止超出每个模板限制的数目
    cleanData (cards) {
        cards.forEach((card) => {
            let layoutId = Number(card.layoutId);
            card.videos = card.videos.slice(0, SUBJECT_MAP[layoutId]);
        });
        return cards;
    }

    // 获取所有的专题 --- done
    fetchSubjectList = async (channelId, version = '1.0.0') => {
        try {
            const res = await yxFetch(REQ_URL.QUERY_LEGO, {
                version,
                channelId,
            });
            if (Number(res.code) === 0) {
                return (res.data && res.data.cards) || [];
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            message.error(e.message || e);
        }
    }
    // 从外面一级频道过来，定位到对应的专题
    changeToTargetSubject = () => {
        const match = this.props.match.location.search.match(/\?lego=(\d)/i);
        let lego;
        if (match) {
            lego = match[1];
            this.changeItem(+lego);
        } else {
            lego = null;
        }
    }
    getChannelList = async (callback) => {
        const cards = await this.fetchSubjectList(this.channelId);
        cards.forEach(card => {
            card.videos.forEach((vidoe, i) => {
                vidoe.scale = this.chargeScale(card.layoutId, i);
            });
        });
        // debugger
        this.setState({
            cards: cards
        }, () => {
            if (callback) {
                callback();
            }
        });
    }
    changeItem = (index) => {
        this.setState({
            currentCardsIndex: index,
            layoutStatus: 2,
            currentVideoIndex: null,
        });
    }
    // 根据 layoutid 和 videoIndex 来判断视频的scale
    chargeScale = (layoutId, index) => {
    // scale 1 rate= 16:9
    // scale 2 rate=4:3
    // scale 3 rate=2:3（竖)
    // scale 4 rate 3:2 (横)
    // 只有 1 和 3 两种
        let scale = 1;
        switch (Number(layoutId)) {
            case 1: // 专题C，一张大图, 16 ：9
            case 2: // 专题 A1，四张横图
            case 5: // 模板 B1，一张大图，四张横图
            case 6: // 模板 B2，一张大图，四张横图
            case 7: // 模板 A2，四张横图
            default:
                break;
            case 3:
                // 模板 D，六张竖图
                scale = 3;
                break;
            case 4:
                // 模板E，一张大图六张竖图
                scale = (index === 0 ? 1 : 3);
                break;
            case 8:
                if (index === 0) {
                    scale = 0;
                } else {
                    scale = 1;
                }
                break;
            case 9:
                if (index === 0 || index === 1) {
                    scale = 0;
                } else if (index > 1 && index < SUBJECT_MAP[layoutId] - 1) {
                    scale = 1;
                } else if (index === SUBJECT_MAP[layoutId] - 1) {
                    scale = 6;
                }
                break;
        }
        return scale;
    }
    addCard = () => {
        const videos = [];

        for (let i = 0; i < 6; i++) {
            videos.push({
                scale: this.chargeScale(3, i),
                imageId: '',
                imageUrl: '',
                name: '',
                sort: '',
                subName: '',
                url: '',
                videoId: ''
            });
        }

        this.state.cards.push({
            isEnable: 0,
            isMore: 0,
            layoutId: 3,
            moreUrl: '',
            title: '专题名称',
            videos,
        });

        this.setState({
            cards: this.state.cards
        }, () => {
            this.changeItem(this.state.cards.length - 1);
        });
    }
    configVideosDetail(index, scale) {
        this.changeLayoutStatus(3); // 3?魔鬼数字，啥意思
        this.setState({
            currentVideoIndex: index,
            currentVideoScale: scale
        });
    }
    handleImgUrlChange(imageUrl, name, subName, url, videoId, extMap, scale) {
        let type = this.state.currentVideoScale;
        if (this.state.cards[this.state.currentCardsIndex].videos[this.state.currentVideoIndex]) {
            Object.assign(this.state.cards[this.state.currentCardsIndex].videos[this.state.currentVideoIndex], {
                imageUrl,
                name,
                subName,
                url,
                videoId,
                extMap,
                scale,
            });
        } else {
            this.state.cards[this.state.currentCardsIndex].videos.push({
                imageUrl,
                name,
                subName,
                url,
                videoId,
                extMap,
                type
            });
        }
        this.setState({
            cards: this.state.cards
        });
    }
    handleTitleChange(title) {
        Object.assign(this.state.cards[this.state.currentCardsIndex], {
            title,
        });
        this.setState({
            cards: this.state.cards
        });
    }
    // 改变模板类型
    handleLayoutChange(layoutId) {
        const length = SUBJECT_MAP[layoutId];
        const videos = this.state.cards[this.state.currentCardsIndex].videos;
        const _length = videos.length;
        if (length > _length) {
            const gap = length - _length;

            for (let i = 0; i < gap; i++) {
                videos.push({
                    imageUrl: '',
                    name: '',
                    subName: '',
                    url: '',
                });
            }
        }
        videos.forEach((video, i) => {
            video.scale = this.chargeScale(layoutId, i, videos.length);
        });
        Object.assign(this.state.cards[this.state.currentCardsIndex], {
            layoutId,
            videos,
        });

        this.setState({
            cards: this.state.cards
        });
    }
    addBanner() {
        let bannerItem = {
            title: '',
            schemeUrl: '',
            imageId: null,
            sort: this.state.bannerList[this.state.bannerList.length - 1].sort + 100,
            secondTitle: '',
            channelId: this.channelId
        };
        let list = this.state.bannerList;
        list[list.length] = bannerItem;
        this.setState({
            bannerList: list,
            bannerWidth: list.length * 375,
            bannerListLength: list.length,
            bannerIndex: list.length,
            translateX: -this.state.bannerWidth,
            addBannerEnabled: (list.length === 10)
        });
    }
    changeTranslateX(event) {
        this.setState({
            translateX: event
        });
    }
    // banner方法结束
    // bannerConfig方法
    // 获取子组件的switch变化
    isBannerEnabledChange(event) {
        this.setState({
            isBannerEnabled: event
        });
    }
    editBannerItem(index) {
        this.changeLayoutStatus(1);
    }
    // 增加，删除，修改之后更新列表
    refreshBanner(event) {
        if (event === 'save') {
            this.getBannerList();
        } else if (event === 'delete') {
            if (this.state.bannerList.length === 1) { // 删除最后一个banner
                this.setState({
                    bannerList: [
                        {
                            channelId: null,
                            id: null,
                            imageId: null,
                            imageUrl: null,
                            schemeUrl: '',
                            secondTitle: '',
                            sort: 100,
                            title: ''
                        }
                    ]
                });
            } else {
                this.getBannerList();
                if (this.state.bannerIndex > 1) { // 删除的不是第一个banner
                    this.setState({
                        bannerIndex: this.state.bannerIndex - 1,
                        translateX: this.state.translateX + 375
                    });
                }
            }
        } else if (event === 'bannerOn') {
            this.getChannelBannerOn(); // bannerOn保存之后进行刷新
        }
    }

    // bannerConfig方法结束
    bannerBtnClick = () => {
        this.changeLayoutStatus(0);
        this.setState({
            currentCardsIndex: -1
        });
    }

    // 修改 layoutStatus 函数
    changeLayoutStatus(layoutStatus) {
        this.setState({
            layoutStatus: layoutStatus
        });
    }

    getChannelBannerOn() {
        yxFetch(REQ_URL.LIST_MOBILE_CHANNEL, {}).then((res) => {
            res.data.forEach((item) => {
                if (item.id === this.channelId) {
                    let bannerOn;
                    if (item.bannerOn) {
                        bannerOn = true;
                    } else {
                        bannerOn = false;
                    }
                    this.setState({
                        bannerOn: bannerOn,
                        isBannerEnabled: bannerOn
                    });
                }
            });
        });
    }

    sortByDrag = (cards) => {
        this.setState({
            cards
        });
    }

    updateLego = async(cards) => {
        const res = await yxFetch(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: this.channelId,
            version: '1.0.0',
            json: JSON.stringify({
                version: 1,
                timestamp: '',
                cards: this.cleanData(cards)
            })
        });
        if (res.code === 0) {
            window.location.reload();
        } else {
            message.error(res.errmsg);
        }
    }

    componentDidMount () {
        const match = window.location.search.match(/ChannelName=(\S+)/i);
        alterBreadItemName(decodeURIComponent(match[1]));
        this.getBannerList();
        this.getChannelList(this.changeToTargetSubject);
        this.getChannelBannerOn();
    }
    render() {
        const newCards = this.state.cards.map((card, index) => {
            return {
                ...card,
                id: card.layoutId + card.title + index
            };
        });
        return (
            <div className={style['channel-wrapper']}>
                <LayoutMenus cards={newCards}
                    channelId={this.channelId}
                    changeItem={this.changeItem}
                    addCard={this.addCard}
                    bannerBtnClick={this.bannerBtnClick}
                    updateLego={this.updateLego}
                    sortByDrag={this.sortByDrag}
                    currentCardsIndex={this.state.currentCardsIndex}
                />
                <div className={style['channel-preview']}>
                    <div className={style['card-header']}>
                        <div className={style['card-header-title']}>预览</div>
                        <div className={style['card-header-sub']}>点击相应区域，可配置内容</div>
                    </div>
                    {(this.state.layoutStatus === 0 || this.state.layoutStatus === 1)
                        ? (<Banner
                            bannerList={this.state.bannerList}
                            bannerWidth={this.state.bannerWidth}
                            bannerListLength={this.state.bannerListLength}
                            translateX={this.state.translateX}
                            bannerIndex={this.state.bannerIndex}
                            isBannerEnabled={this.state.isBannerEnabled}
                            editBannerItem={this.editBannerItem}
                            getBannerIndex={this.getBannerIndex}
                            changeTranslateX={this.changeTranslateX}
                        />) : ''
                    }
                    {
                        (this.state.layoutStatus === 2 || this.state.layoutStatus === 3) ? (
                            <Template cards={this.state.cards}
                                currentCardsIndex={this.state.currentCardsIndex}
                                currentVideoIndex={this.state.currentVideoIndex}
                                currentVideoScale={this.state.currentVideoScale}
                                configVideosDetail={this.configVideosDetail}
                                changeLayoutStatus={this.changeLayoutStatus}
                                parent={this} />
                        ) : ('')
                    }
                </div>
                <div className={style['channel-config']}>
                    <div className={style['card-header']}>
                        <div className={style['card-header-title']}>配置</div>
                        <div className={style['card-header-sub']}/>
                    </div>
                    {
                        this.state.layoutStatus === 2 ? (
                            (<Config
                                cards={this.state.cards}
                                parent={this}
                                currentCardsIndex={this.state.currentCardsIndex}
                                handleTitleChange={this.handleTitleChange}
                                handleLayoutChange={this.handleLayoutChange}
                                getChannelList={this.getChannelList.bind(this)}
                            />)
                        ) : ''
                    }
                    {
                        this.state.layoutStatus === 3 ? (
                            (<VideoConfig
                                cards={this.state.cards}
                                currentCardsIndex={this.state.currentCardsIndex}
                                currentVideoIndex={this.state.currentVideoIndex}
                                currentVideoScale={this.state.currentVideoScale}
                                handleImgUrlChange={this.handleImgUrlChange.bind(this)}
                                getChannelList={this.getChannelList.bind(this)}
                                parent={this}
                            />)
                        ) : ''
                    }
                    {(this.state.layoutStatus === 0 || this.state.layoutStatus === 1)
                        ? (<BannerConfig
                            channelId={this.channelId}
                            layoutStatus={this.state.layoutStatus}
                            bannerIndex={this.state.bannerIndex}
                            bannerCount={this.state.bannerListLength}
                            editBannerItem={this.state.bannerList[this.state.bannerIndex - 1]}
                            addBannerEnabled={this.state.addBannerEnabled}
                            isBannerEnabled={this.state.isBannerEnabled}
                            bannerOn={this.state.bannerOn}
                            addBanner={this.addBanner}
                            isBannerEnabledChange={this.isBannerEnabledChange}
                            refreshBanner={this.refreshBanner}
                        />) : ''
                    }
                </div>
            </div>
        );
    }
}

export default ChannelAppDetail;
