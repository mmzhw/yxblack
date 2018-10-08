import React, { Component } from 'react';
import style from './style.module.css';
import Banner from '../ChannelAppDetail/Banner';
import LayoutMenus from './topic/LayoutMenus.js';
import Template from '../ChannelAppDetail/template';
import Config from './config/index.js';
import VideoConfig from './videoConfig/index.js';
import BannerConfig from './Banner/BannerConfig';
import fetcher from '../../utils/fetch';
import { message } from 'antd';
import alterBreadItemName from '../../utils/alterBreadItemName';
import { REQ_URL } from '../../constants/constants';

class ChannelAppTownDetail extends Component {
    state = {
        channelId: this.props.match.match.params.id, // 频道id
        bannerOn: false, // banner 是否启用
        bannerListLength: 1, // banner的个数(默认1个)
        bannerWidth: 375, // 整个banner的长度(默认1个的长度)
        bannerList: [{ // banner内容 （默认一个）
            channelId: null,
            id: null,
            imageId: null,
            imageUrl: null,
            schemeUrl: '',
            secondTitle: '',
            sort: 0,
            title: ''
        }],
        bannerIndex: 1, // 滑动到的 bannerIndex，从1计数
        translateX: 0, // 滑动到对应的 banner 需要滑动的距离
        isBannerEnabled: false, // banner 是否启用, 不启用不能编辑
        addBannerEnabled: false, // false 可以继续添加banner，true 不能
        editBannerItemIndex: 0,
        layoutStatus: 0, // 0-banner,1-bannerItem,2-card,3-cardItem
        cards: [], // 专题列表
        currentCardsIndex: -1, // -1-banner, 大于0，当前专题index
        currentVideoIndex: null, // 当前视频index
        releasing: false
    }
    // 获取所有的 banner --- done
    fetchBannerList = async (channelId) => {
        try {
            const res = await fetcher(REQ_URL.BANNER, {
                channelId,
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
    // 获取所有的专题 --- done
    fetchSubjectList = async (channelId, version = '1.0.0') => {
        const res = await fetcher(REQ_URL.QUERY_LEGO, {
            version,
            channelId,
        });
        if (Number(res.code) === 0) {
            return (res.data && res.data.cards) || [];
        } else {
            message.error(res.errmsg);
        }
    }

    // 从子组件获取bannerIndex
    getBannerIndex = (event) => {
        this.setState({
            bannerIndex: event
        });
    }
    // 获取banner列表 --- done
    getBannerList = async (channelId) => {
        const { bannerIndex } = this.state;
        const bannerArr = await this.fetchBannerList(channelId);
        if (bannerArr.length) { // banner 的个数不为0
            let state = {
                bannerList: bannerArr,
                bannerWidth: bannerArr.length * 375,
                bannerListLength: bannerArr.length,
                addBannerEnabled: (bannerArr.length === 10) // 最多添加10个 banner
            };
            if (bannerIndex > bannerArr.length) {
                state = {
                    ...state,
                    bannerIndex: bannerArr.length, // 如果当前bannerIndex 比返回的banner 数量多
                    translateX: -(bannerArr.length - 1) * 375
                };
            }
            this.setState(state);
        }
    }
    // 获取channel列表 --- done
    getChannelList = async (channelId) => {
        const subjectArr = await this.fetchSubjectList(channelId);
        if (subjectArr) {
            subjectArr.forEach(subject => {
                subject.videos.forEach((vidoe, i) => {
                    vidoe.scale = this.chargeScale(subject.layoutId, i);
                });
            });
            this.setState({
                cards: subjectArr
            });
        }
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
                scale = 1;
                break;
            case 3:
                // 模板 D，六张竖图
                scale = 3;
                break;
            case 4:
                // 模板E，一张大图六张竖图
                scale = (index === 0 ? 1 : 3);
                break;
        }
        return scale;
    }
    // 左边切换专题 --- done
    changeItem = (index) => {
        this.setState({
            currentCardsIndex: index, // 从 0 计数
            layoutStatus: 2, // card
            currentVideoIndex: null,
        }, () => {
            console.log(this.state, 'this.state');
        });
    }
    // 添加专题 --- done
    addCard = () => {
        const { cards } = this.state;
        const newCards = cards.slice();
        const videos = [];
        for (let i = 0; i < 6; i++) {
            videos.push({
                scale: this.chargeScale(3, i),
                imageId: '',
                imageUrl: '',
                name: '',
                sort: i,
                subName: '',
                url: '',
                videoId: ''
            });
        }
        newCards.push({
            isEnable: 0,
            isMore: 0,
            layoutId: 3,
            moreUrl: '',
            title: '专题名称',
            videos,
        });
        this.setState({
            cards: newCards
        }, () => {
            this.changeItem(newCards.length - 1);
        });
    }

    // 配置视频信息
    configVideosDetail = (index) => {
        this.changeLayoutStatus(3);
        this.setState({
            currentVideoIndex: index
        });
    }
    // 在视频信息配置，搜索视频后选择一个视频后调用的方法
    handleImgUrlChange = (imageUrl, name, subName, url, videoId, extMap, scale) => {
        const { cards, currentCardsIndex, currentVideoIndex } = this.state;
        if (cards[currentCardsIndex].videos[currentVideoIndex]) {
            Object.assign(cards[currentCardsIndex].videos[currentVideoIndex], {
                imageUrl,
                name,
                subName,
                url,
                videoId,
                extMap,
                scale
            });
        } else {
            cards[currentCardsIndex].videos.push({
                imageUrl,
                name,
                subName,
                url,
                videoId,
                extMap,
            });
        }
        this.setState({
            cards,
        });
    }
    handleTitleChange = (title) => {
        Object.assign(this.state.cards[this.state.currentCardsIndex], {
            title,
        });
        this.setState({
            cards: this.state.cards
        });
    }
    // 切换模板
    handleLayoutChange = (layoutId) => {
        const { cards, currentCardsIndex } = this.state;
        const map = {
            1: 1,
            2: 4,
            3: 6,
            4: 7,
            5: 5,
            6: 5,
            7: 4
        };
        // debugger
        const length = map[layoutId];
        let videos = cards[currentCardsIndex].videos;
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
            video.scale = this.chargeScale(layoutId, i);
        });
        Object.assign(cards[currentCardsIndex], {
            layoutId,
            videos,
        });

        this.setState({
            cards: cards
        });
    }

    // 记录需要滑动到的位置 --- done
    changeTranslateX = (newTranslateX) => {
        this.setState({
            translateX: newTranslateX
        });
    }
    // bannerConfig方法
    // 获取bannerConfig的switch变化 --- done
    isBannerEnabledChange = (val) => {
        this.setState({
            bannerOn: val,
            isBannerEnabled: val
        });
    }
    // bannerConfig方法
    // 添加 banner --- done
    addBanner = () => {
        const { bannerList, channelId, bannerWidth } = this.state;
        const newBannerList = bannerList.slice();
        const bannerItem = {
            title: '',
            schemeUrl: '',
            imageId: null,
            sort: bannerList[bannerList.length - 1].sort + 100,
            secondTitle: '',
            channelId: channelId
        };
        newBannerList.push(bannerItem);
        this.setState({
            bannerList: newBannerList,
            bannerWidth: newBannerList.length * 375,
            bannerListLength: newBannerList.length,
            bannerIndex: newBannerList.length,
            translateX: -bannerWidth,
            addBannerEnabled: (newBannerList.length === 10)
        });
    }
    // 点击 banner 进行编辑
    // 需要更新 layoutStatus --- done
    editBannerItem = (index) => {
        this.changeLayoutStatus(1);
    }
    // 增加，删除，修改之后更新列表 --- done
    refreshBanner = (event) => {
        const { channelId } = this.state;
        if (event === 'save') {
            this.getBannerList(channelId);
        } else if (event === 'delete') {
            if (this.state.bannerList.length === 1) { // 删除最后一个banner
                this.setState({
                    bannerList: [{
                        channelId: null,
                        id: null,
                        imageId: null,
                        imageUrl: null,
                        schemeUrl: '',
                        secondTitle: '',
                        sort: 100,
                        title: ''
                    }]
                });
            } else {
                this.getBannerList(channelId);
                if (this.state.bannerIndex > 1) { // 删除的不是第一个banner
                    this.setState({
                        bannerIndex: this.state.bannerIndex - 1,
                        translateX: this.state.translateX + 375
                    });
                }
            }
        } else if (event === 'bannerOn') {
            // this.getChannelList(channelId)
            // this.getChannelBannerOn() // bannerOn保存之后进行刷新
        }
    }
    // --- done
    bannerBtnClick = () => {
        this.changeLayoutStatus(0);
        this.setState({
            currentCardsIndex: -1
        });
    }
    // 修改 layoutStatus 函数
    changeLayoutStatus = (layoutStatus) => {
        this.setState({
            layoutStatus: layoutStatus
        });
    }
    // 重置一下 banner 的状态
    getChannelBannerOn = () => {
        const { channelId } = this.state;
        fetcher(REQ_URL.NEW_TOEN_CHANNEL, {}).then((res) => {
            if (Number(res.data.id) === Number(channelId)) {
                let bannerOn;
                if (res.data.bannerOn) {
                    bannerOn = true;
                } else {
                    bannerOn = false;
                }
                this.setState({
                    bannerOn: bannerOn,
                    isBannerEnabled: bannerOn
                });
            } else {
                res.data.secondChannel.forEach((item) => {
                    if (Number(item.id) === Number(channelId)) {
                        let bannerOn;
                        bannerOn = !!item.bannerOn;
                        this.setState({
                            bannerOn: bannerOn,
                            isBannerEnabled: bannerOn
                        });
                    }
                });
            }
        });
    }

    sortByDrag = (cards) => {
        this.setState({
            cards
        });
    }

    updateLego = async (cards) => {
        const res = await fetcher(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: this.state.channelId,
            version: '1.0.0',
            json: JSON.stringify({
                version: 1,
                timestamp: '',
                cards
            })
        });
        if (res.code === 0) {
            message.success('保存成功!');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            message.error(res.errmsg);
        }
    }

    cleanData = (cards) => {
        cards.forEach((card) => {
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
        });
        return cards;
    }

    updateRelease = async() => {
        const channel = this.props.match.location.state;
        const { releasing } = this.state;
        if (releasing) return message.warn('正在发布中');
        // const { bannerList } = this.state
        const newChannel = { ...channel, labels: [{ name: 'banner', isEnable: Number(this.state.bannerOn) }].concat(this.cleanData(this.state.cards)) };
        const values = { ...channel, bannerOn: Number(this.state.bannerOn) };
        try {
            this.setState({
                releasing: true
            });
            // let ress = []
            let res1 = await fetcher(REQ_URL.MODIFY_MOBILE_CHANNEL, values);
            if (res1.code === 0) {
                let res2 = await fetcher(REQ_URL.PUBLISH_LEGO, {
                    channelId: this.state.channelId,
                    version: '1.0.0',
                });
                if (res2.code === 0) {
                    let res3 = await fetcher(REQ_URL.SET_CHANNEL_CACHE, {
                        json: JSON.stringify([newChannel])
                    });
                    if (res3.code === 0) {
                        this.setState({
                            releasing: false
                        });
                        message.success('发布成功!');
                        // location.reload()
                    } else {
                        message.error(res3.errmsg);
                    }
                } else {
                    message.error(res2.errmsg);
                }
            } else {
                message.error(res1.errmsg);
            }

            this.setState({
                releasing: false
            });
            // const ress = await Promise.all([
            //   fetcher('/v2/back/mobile/modifyChannel', values),
            //   fetcher('/v2/back/mobile/lego/publishLego', {
            //     channelId: this.state.channelId,
            //     version: '1.0.0',
            //   }),
            //   fetcher('v2/back/mobile/setChannelCache', {
            //     json: JSON.stringify([newChannel])
            //   })
            // ])

            // this.setState({
            //   releasing: false
            // })

            // const failedRes = ress.filter(res => {
            //   return res.code !== 0
            // })
            // if (failedRes && failedRes.length > 0) {
            //   message.error(failedRes[0].errmsg)
            // } else {
            //   // message.success('发布更新成功')
            //   location.reload()
            // }
        } catch (error) {
            message.error(error);
        }
    }

    componentDidMount = () => {
        const { channelId } = this.state;
        const channel = this.props.match.location.state;
        alterBreadItemName(channel.name);
        // const match = location.search.match(/ChannelName=(\S+)/i)
        // alterBreadItemName(decodeURIComponent(match[1]))
        this.getBannerList(channelId);
        this.getChannelList(channelId);
        this.getChannelBannerOn();
    }
    render() {
        const newCards = this.state.cards.map((card, index) => {
            return {
                ...card,
                id: card.layoutId + card.title + index
            };
        });
        const {
            channelId,
            layoutStatus,
            bannerList,
            bannerWidth,
            bannerListLength,
            translateX,
            bannerIndex,
            isBannerEnabled,
            cards,
            currentCardsIndex,
            currentVideoIndex
        } = this.state;
        return (
            <div className={style['channel-wrapper']}>
                <LayoutMenus
                    cards={newCards}
                    updateRelease={this.updateRelease}
                    channelId={channelId}
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
                    {
                        (layoutStatus === 0 || layoutStatus === 1)
                            ? <Banner
                                bannerList={bannerList}
                                bannerWidth={bannerWidth}
                                bannerListLength={bannerListLength}
                                translateX={translateX}
                                bannerIndex={bannerIndex}
                                isBannerEnabled={isBannerEnabled}
                                editBannerItem={this.editBannerItem}
                                getBannerIndex={this.getBannerIndex}
                                changeTranslateX={this.changeTranslateX}/>
                            : <Template
                                cards={cards}
                                currentCardsIndex={currentCardsIndex}
                                currentVideoIndex={currentVideoIndex}
                                configVideosDetail={this.configVideosDetail}
                                changeLayoutStatus={this.changeLayoutStatus}
                            />
                    }
                </div>
                <div className={style['channel-config']}>
                    <div className={style['card-header']}>
                        <div className={style['card-header-title']}>配置</div>
                        <div className={style['card-header-sub']}></div>
                    </div>
                    {
                        layoutStatus === 2 ? (
                            <Config
                                channelId={channelId}
                                cards={cards}
                                parent={this}
                                currentCardsIndex={currentCardsIndex}
                                handleTitleChange={this.handleTitleChange}
                                handleLayoutChange={this.handleLayoutChange}
                                getChannelList={this.getChannelList.bind(this)} />
                        ) : null
                    }
                    {
                        layoutStatus === 3 ? (
                            <VideoConfig
                                channelId={channelId}
                                cards={cards}
                                currentCardsIndex={currentCardsIndex}
                                currentVideoIndex={currentVideoIndex}
                                handleImgUrlChange={this.handleImgUrlChange}
                                getChannelList={this.getChannelList}
                            />
                        ) : null
                    }
                    {(layoutStatus === 0 || layoutStatus === 1) &&
            <BannerConfig
                channelId={channelId}
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
            />
                    }
                </div>
            </div>
        );
    }
}

export default ChannelAppTownDetail;
