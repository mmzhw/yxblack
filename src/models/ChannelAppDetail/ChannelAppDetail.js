import React, { Component } from 'react';
import {
    message
} from 'antd';
import {
    cloneDeep
} from 'lodash';
import fetcher from '../../utils/fetch';
import { REQ_URL } from '../../constants/constants';

import Banner from './BannerForPc';
import LayoutMenus from './topic/LayoutMenus';
import ChannelPreview from './Preview';
import ChannelConfig from './config/ChannelConfig';
import VideoConfig from './videoConfig/VideoConfigForPc';
import alterBreadItemName from '../../utils/alterBreadItemName';

const sortCardsBysort = (cards) => {
    return cards && cards.sort((card1, card2) => {
        return card1.sort - card2.sort;
    });
};

// 根据layout模板选择默认个数
const MODULE_NUM = {
    1: 6,
    2: 9,
    3: 12,
    4: 6,
    5: 6,
    6: 12
};

const emptyCardsWrap = {
    layoutId: 0,
    more: false,
    moreUrl: '',
    title: '专题名称',
    sort: 0,
    videos: [],
};

const emptyVideo = {
    imageId: '',
    imageUrl: '',
    name: '',
    subName: '',
    url: '',
    scale: 1,
    videoBaseId: ''
};

export default class ChannelAppDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channelId: this.props.match.match.params.id, // 频道id
            cards: [], // 频道对应的所有的专题信息,不包括 banner,左侧边栏使用
            currentSubject: { // 当前专题的信息
                isEnable: 0, // 专题是否启用
                sectionType: '', // 专题的名称，也就是第一个 card 的名称
                sectionsLayout: '',
                title: '', // 冗余的字段,新增和更新的时候删掉
                cards: [],
            },
            loading: false, // 按钮loadin
            scale: null, // 点击单个视频时，判断该视频的 scale
            channelCards: null, // 用来暂时缓存数据
            channelLayout: 0, // Preview 模板的 layout
            currentSubjectIndex: -1, // -1 是 banner, 当前专题index
            currentCardIndex: 0, // card 的index，最多两个 card 0/1
            currentVideoIndex: 0, //  点到视频，视频的 index
            currentVideoData: null, // 选中视频时，视频的信息
            layoutStatus: 0, // 0-banner,1-bannerItem,2-card,3-cardItem
            bannerConfigType: 0, // 0为对banner整体的操作，1为对单个banner的操作
            curBannerIndex: 0
        };
        this.tempCards = []; // 储存临时cards
    }

    // 查询频道所有信息---done
    async fetchChannelDetail (channelId) {
        const res = await fetcher(REQ_URL.CHANNEL_DETAIL, {
            channelId,
        });
        if (Number(res.code === 0)) {
            return res.data.sectionWebs || [];
        } else {
            message.error(res.errmsg);
        }
    }

    // 更新专题信息---done
    async updateData (channelId, updateData) {
        const res = await fetcher(REQ_URL.UPDATE_DATA, {
            channelId,
            section: updateData
        });
        if (Number(res.code === 0)) {
            message.success('更新成功!');
        } else {
            message.success(res.errmsg);
        }
    }

    // 添加专题信息---done
    async addData (channelId, updateData) {
        const res = await fetcher(REQ_URL.ADD_SUBJECT, {
            channelId,
            section: updateData
        });
        if (Number(res.code === 0)) {
            message.success('添加成功!');
        } else {
            message.success(res.errmsg);
        }
    }

    // 冗余一个 title 字段，给左边组件展示 --- done
    // 提交的时候删掉
    addTitle (subjects) {
        return subjects.map(sectionItem => {
            sectionItem.title = sectionItem.sectionType;
            return sectionItem;
        });
    }

    // 提交的时候专题的 title 字段---done
    deleteTitle (subjects) {
        return subjects.map(sectionItem => {
            if (sectionItem.hasOwnProperty('title')) {
                delete sectionItem.title;
            }
            return sectionItem;
        });
    }

    // 点击左边页面布局 --- done
    changeItem (index) {
        if (this.ChannelConfigForm) {
            this.ChannelConfigForm.layOut1form && this.ChannelConfigForm.layOut1form.resetFields();
            this.ChannelConfigForm.layOut2form && this.ChannelConfigForm.layOut2form.resetFields();
        }
        let { cards, currentSubjectIndex, channelCards } = this.state;
        // currentSubjectIndex >= 0 的的时候，是专题
        // -1 的时候为 banner
        if (currentSubjectIndex >= 0 && channelCards) {
            // channelCards 不为空，说明切换过模板
            // 需要恢复过来的数据

            // 取出当前的 currentSubject
            const needToModify = cloneDeep(cards[currentSubjectIndex]);
            // 重组成之前的数据
            const newCurrentSubject = {
                ...needToModify,
                sectionsLayout: this.templayout,
                isEnable: this.tempIsEnable,
                cards: cloneDeep(channelCards)
            };
            // 缓存下来的之前的 layout 和 是否启用
            this.templayout = null;
            this.tempIsEnable = null;
            channelCards = null;
            // 将原来的旧的 card 更新
            cards[currentSubjectIndex] = newCurrentSubject;
        }
        this.setState({
            scale: null, // 重置 scale
            currentVideoData: null, // 重置
            cards,
            channelCards,
            layoutStatus: 2,
            currentSubjectIndex: index,
            currentCardIndex: 0,
            currentVideoIndex: 0,
            currentSubject: cards[index],
            channelLayout: cards[index].sectionsLayout,
        });
    }

    // 新增专辑- done
    addCard () {
        const { cards } = this.state;
        const newCards = cards.slice();
        // 生成一个新的 currentSubject，同时推到 cards 中
        const currentSubject = {
            isEnable: 0, // 专题是否启用
            sectionType: '专题名称1',
            sectionsLayout: 1,
            title: '专题名称1',
            cards: this.produceCards(1),
        };
        newCards.push(currentSubject);
        this.setState({
            cards: newCards,
            currentSubject,
            channelLayout: 1,
            currentSubjectIndex: newCards.length - 1,
            currentCardIndex: 0,
            currentVideoIndex: 0,
            layoutStatus: 2,
        });
    }

    // 点击切换到 banner 的按钮 - done
    bannerBtnClick () {
        this.setState({
            currentSubjectIndex: -1,
            bannerConfigType: 0,
            curBannerIndex: 0
        });
    }

    // 根据 subjectLayout 和 视频的 index
    // 判断单个视频属于哪个 scale --- done
    chargeScale (subjectLayout, videoIndex) {
    // 图片比例，1-16:9 2-4:3 3-2:3 4-3:2
        let scale = 1;
        switch (Number(subjectLayout)) {
            case 4:
                scale = 1;
                break;
            case 2:
                if (videoIndex) { // 不是第一个
                    scale = 1;
                } else {
                    scale = 4;
                }
                break;
            case 5:
                scale = 3;
                break;
            case 6:
                scale = 3;
                break;
            default:
                scale = 1;
        }
        return scale;
    }

    // 点击单个视频 --- done
    handleClickVideo (currentCardIndex, currentVideo, currentVideoIndex) {
        if (this.form) {
            this.form.resetFields();
        }
        // 配了video，但是没有保存，清空存起来的图片
        const { currentSubject, channelLayout } = this.state;
        // 获取这个视频的 scale
        const scale = this.chargeScale(channelLayout, currentVideoIndex);
        this.setState({
            scale,
            layoutStatus: 3,
            currentCardIndex,
            currentVideoIndex,
            currentVideoData: currentSubject.cards[currentCardIndex].videos[currentVideoIndex]
        });
    }

    // 清洗提交的数据
    cleanUpdateData (subjectData, values, type = 'subject') {
        // subjectData 是当前专题的数据
        // values 是表单收集的数据
        let newData = cloneDeep(subjectData);
        if (type === 'video') {
            newData.isEnable = Number(newData.isEnable);
            const { currentCardIndex, currentVideoIndex } = this.state;
            const videos = newData.cards[currentCardIndex].videos;
            const oldVideoData = videos[currentVideoIndex];
            videos[currentVideoIndex] = { ...oldVideoData, ...values };
        } else if (type === 'subject') {
            newData = {
                ...newData,
                sectionType: values.sectionType.trim(),
                isEnable: Number(values.isEnable) || 0,
                sectionsLayout: Number(values.sectionsLayout),
                timeLine: Boolean(values.timeLine),
            };
        } else if (type === 'layout1') {
            newData = {
                ...newData,
                sectionType: values.card1Title.trim(),
                isEnable: Number(values.isEnable) || 0,
                sectionsLayout: Number(values.sectionsLayout),
            };
        }
        newData.cards.forEach((card, i) => {
            // 如果不是模板一
            if (type === 'subject') {
                card.title = values.sectionType;
                // 更新数据叫做 isMore
                card.isMore = Boolean(values.more);
                card.moreUrl = values.moreUrl;
            } else if (type === 'layout1') {
                // 如果是模板一
                card.title = values[`card${i + 1}Title`];
                // 更新数据叫做 isMore
                card.isMore = Boolean(values[`card${i + 1}More`]);
                card.moreUrl = values[`card${i + 1}MoreUrl`];
            } else {
                // 更新数据叫做 isMore
                card.isMore = Boolean(card.more);
            }
            // 更新的时候，card 中叫做 isMore
            // 查询回来的叫做 more
            delete card.more;
            card.videos && card.videos.forEach((video, i) => {
                // 用来保证每个视频的顺序
                video.sort = i + 1;
                // 更新的时候不能带上 scale 和 imageUrl
                delete video.scale;
                delete video.imageUrl;
            });
        });
        // 把一开始冗余的title 删掉
        delete newData.title;
        return newData;
    }

    // 判断能不能专题能不能更新 --- done
    chargeCanUpdate (isEnable, subjectCards, subjectLayout) {
        let canUpdate = true; // 专题不启用，可以更新
        if (isEnable) { // 专题启用，需要判断里面每个card 的video是不是够数
            canUpdate = subjectCards.every(card => {
                // 每个视频的名字是必填的，可以根据是否有name 字段来判断
                return card.videos.every(video => video.name);
            });
        }
        return canUpdate;
    }

    async handleSubmit (values, channelLayout) {
        this.setState({
            loading: true
        });
        const { currentSubject, channelId } = this.state;
        let layout = 'subject';
        if (Number(channelLayout) === 1) {
            layout = 'layout1';
        }
        let updateData = this.cleanUpdateData(currentSubject, values, layout);
        const canUpdate = this.chargeCanUpdate(updateData.isEnable, updateData.cards, updateData.sectionsLayout);
        if (!canUpdate) {
            message.error('专题启用时请配齐模板内的视频！');
            return false;
        }
        if ('id' in updateData) {
            await this.updateData(channelId, updateData);
        } else {
            await this.addData(channelId, updateData);
        }

        const subjects = await this.fetchChannelDetail(channelId);
        const newSubjects = sortCardsBysort(this.completeData(subjects));
        if (subjects) {
            const cards = this.addTitle(newSubjects);
            const { currentSubjectIndex } = this.state;
            this.setState({
                loading: false,
                cards,
                channelCards: null,
                tempVideosArr: null,
                currentVideoData: null,
                currentCardIndex: 0,
                currentVideoIndex: 0,
                channelLayout: cards[currentSubjectIndex].sectionsLayout,
                layoutStatus: 2,
                currentSubject: cards[currentSubjectIndex],
            });
        }
        return true;
    }

    async handleSubmitVideo (values) {
        this.setState({
            loading: true
        });
        const { currentSubject, channelId } = this.state;
        const updateData = this.cleanUpdateData(currentSubject, values, 'video');
        if ('id' in updateData) {
            await this.updateData(channelId, updateData);
        } else {
            await this.addData(channelId, updateData);
        }

        const subjects = await this.fetchChannelDetail(channelId);
        const newSubjects = sortCardsBysort(this.completeData(subjects));
        if (subjects) {
            const cards = this.addTitle(newSubjects);
            const { currentSubjectIndex } = this.state;
            this.setState({
                loading: false,
                cards,
                channelCards: null,
                currentVideoData: null,
                tempVideosArr: null,
                currentSubject: cards[currentSubjectIndex],
            });
        }
    }

    // 获取当前 card  --- done
    getCurrentCardData () {
        const { currentSubject, currentCardsIndex } = this.state;
        return currentSubject.cards[currentCardsIndex] || {};
    }

    // 获取当前 video --- done
    getCurrentVideoData () {
        const { currentSubject, currentCardIndex, currentVideoIndex } = this.state;
        return currentSubject ? (currentSubject.cards[currentCardIndex] ? currentSubject.cards[currentCardIndex].videos[currentVideoIndex] : {}) : {};
    }

    // 生成一个含有 num 个video 的数组
    // 根据 layout 来判断每个视频的 scale --- done
    produceVideosArr (layout) {
        let num = MODULE_NUM[layout];
        let videos = [];
        for (let i = 0; i < num; i++) {
            let tempVideo = cloneDeep(emptyVideo);
            tempVideo.scale = this.chargeScale(layout, i);
            videos.push(tempVideo);
        }
        return videos;
    }

    // 根据 channelLayout 生成新的 cards
    produceCards (channelLayout) {
        const newCards = [];
        channelLayout = Number(channelLayout);
        if (channelLayout === 1) { // 模板1特殊处理，要两个cards
            for (let i = 0; i < 2; i++) {
                let tempCards = cloneDeep(emptyCardsWrap);
                tempCards.layoutId = channelLayout;
                tempCards.sort = i;
                tempCards.title = `专题名称${i + 1}`;
                tempCards.videos = this.produceVideosArr(channelLayout, MODULE_NUM[channelLayout]);
                newCards.push(tempCards);
            }
        } else {
            let tempCards = cloneDeep(emptyCardsWrap);
            tempCards.layoutId = channelLayout;
            tempCards.videos = this.produceVideosArr(channelLayout, MODULE_NUM[channelLayout]);
            newCards.push(tempCards);
        }
        return newCards;
    }

    // 补齐数据
    formatSubjectData (channelLayout, channelCards) {
        let result = null;
        channelLayout = Number(channelLayout);
        if (channelLayout === 1) { // 模板1有2个，特殊处理
            for (let j = 0, len1 = 2 - channelCards.length; j < len1; j++) {
                let tempCards = cloneDeep(emptyCardsWrap);
                tempCards.layoutId = 4;
                tempCards.sort = j;
                tempCards.title = `专题名称${j + 1}`;
                channelCards.push(tempCards);
            }
            channelCards.forEach(card => {
                let len = MODULE_NUM[channelLayout] - card.videos.length;
                for (let i = 0; i < len; i++) {
                    card.videos.push(cloneDeep(emptyVideo));
                }
            });
            result = channelCards;
        } else {
            channelCards.forEach(card => {
                let len = MODULE_NUM[channelLayout] - card.videos.length;
                for (let i = 0; i < len; i++) {
                    card.videos.push(cloneDeep(emptyVideo));
                }
            });
            result = channelCards;
        }
        return result;
    }

    // 切换专题布局
    handleSubjectLayoutChange (channelLayout) {
        let { cards, channelCards, currentSubjectIndex } = this.state;
        channelLayout = Number(channelLayout);
        let currentSubject = cloneDeep(this.state.currentSubject);
        currentSubject.cards = this.formatSubjectData(channelLayout, currentSubject.cards); // 补充数据
        if ('id' in currentSubject) {
            // 在存在的专题里面修改模板
            // 生成新的 cards
            let newSubjectCards = this.produceCards(channelLayout);
            newSubjectCards[0].id = currentSubject.cards[0].id;
            // 如果之前没挂载过,说明第一次切换模板
            if (!this.templayout) {
                this.tempIsEnable = currentSubject.isEnable;
                this.templayout = currentSubject.sectionsLayout;
                // 把之前的数据保存一份
                channelCards = cloneDeep(currentSubject.cards);
                newSubjectCards = cloneDeep(channelCards);
            } else if (this.templayout && Number(this.templayout) === channelLayout && channelCards) {
                // 如果自己又切换回来了
                newSubjectCards = cloneDeep(channelCards);
                this.templayout = null;
                channelCards = null;
            }
            // debugger
            currentSubject.sectionsLayout = channelLayout;
            currentSubject.cards = newSubjectCards;
            if (this.templayout) {
                currentSubject.isEnable = 0;
            } else {
                currentSubject.isEnable = this.tempIsEnable;
                this.tempIsEnable = null;
            }
            // 更新cards
            cards[currentSubjectIndex] = currentSubject;
            this.setState({
                cards,
                currentSubject,
                layoutStatus: 2,
                channelLayout: channelLayout,
                currentCardIndex: 0,
                currentVideoIndex: 0,
                channelCards,
            });
        } else {
            // 新增的一个专题，然后修改模板
            const newCurrentSubject = {
                ...currentSubject,
                cards: this.produceCards(channelLayout),
                sectionsLayout: channelLayout
            };
            // 去掉最后一个，替换成新的
            const newCards = cards.slice();
            newCards.pop();
            newCards.push(newCurrentSubject);

            this.setState({
                layoutStatus: 2,
                channelLayout: channelLayout,
                currentCardIndex: 0,
                cards: newCards,
                currentSubject: newCurrentSubject,
                channelCards: null,
            });
        }
    }

    handleNumChange (num) {
        const { currentSubject } = this.state;
        // debugger
        // 拿到当前专题下的所有video
        const videos = currentSubject.cards[0].videos.slice();
        const videoLen = videos.length;
        let tempVideosArr;
        if (num < videoLen) {
            // 如果选择的视频个数比之前要少
            // 缓存差值
            tempVideosArr = videos.slice(num);
            currentSubject.cards[0].videos = videos.slice(0, num);
        } else {
            // 如果选择的视频个数比之前要多
            const { tempVideosArr } = this.state;
            // 需要几个视频
            const needVideosNum = num - videoLen;
            let addedVideos;
            if (tempVideosArr) {
                if (tempVideosArr.length < needVideosNum) {
                    addedVideos = tempVideosArr.slice().concat(this.produceVideosArr(currentSubject.sectionsLayout, needVideosNum - tempVideosArr.length));
                } else {
                    addedVideos = tempVideosArr.slice(0, needVideosNum);
                }
            } else {
                // 生成n 空视频数组
                addedVideos = this.produceVideosArr(currentSubject.sectionsLayout, needVideosNum);
            }
            currentSubject.cards[0].videos = currentSubject.cards[0].videos.concat(addedVideos);
        }
        this.setState({
            tempVideosArr,
            currentSubject,
        });
    }

    sortByDrag (cards) {
        this.setState({
            cards
        });
    }

    async updateLego (cards) {
        const { channelId } = this.state;
        let newCards = cards.filter(card => card && card.id).map((card, index) => {
            return {
                sectionId: card.id,
                ...card,
                sort: index + 1
            };
        });
        try {
            const res = await fetcher(REQ_URL.WEB_LEGO_SORT, {
                channelId,
                sortData: newCards
            });
            if (res.code === 0) {
                message.success('频道更新成功');
                this.getInitData();
            } else {
                message.error(res.errmsg);
            }
        } catch (error) {
        }
    }
    // 补全数据
    completeData (subjects) {
        return subjects.map(subject => {
            subject.cards = this.formatSubjectData(subject.sectionsLayout, subject.cards);
            return subject;
        });
    }

    // 初始化数据 - done
    async getInitData () {
        const { channelId, currentSubject } = this.state;
        let subjects = await this.fetchChannelDetail(channelId);
        const newSubjects = sortCardsBysort(this.completeData(subjects));
        if (newSubjects) {
            const cards = this.addTitle(newSubjects);
            this.setState({
                cards,
                channelLayout: cards[0] && cards[0].sectionsLayout,
                currentSubjectIndex: -1, // banner
                layoutStatus: 1,
                currentSubject: cards[0] || { ...currentSubject },
            });
        }
    }

    updateBreadName () {
        const channel = this.props.match.location.state;
        const channelName = channel.name;
        alterBreadItemName(channelName);
    }

    componentDidMount() {
        this.updateBreadName();
        this.getInitData();
    }

    render () {
        const {
            cards,
            currentSubjectIndex,
            currentSubject,
            channelLayout,
            bannerConfigType,
            curBannerIndex,
            layoutStatus,
            loading
        } = this.state;

        const channel = this.props.match.location.state;

        return (
            <div style={{ display: 'flex' }}>
                <LayoutMenus
                    cards={cards}
                    channelId={4}
                    changeItem={this.changeItem.bind(this)}
                    addCard={this.addCard.bind(this)}
                    bannerBtnClick={this.bannerBtnClick.bind(this)}
                    currentCardsIndex={currentSubjectIndex}
                    sortByDrag={this.sortByDrag.bind(this)}
                    updateLego={this.updateLego.bind(this)}
                />
                <div style={{ flex: '1', marginLeft: '20px' }}>
                    {
                        currentSubjectIndex === -1
                            ? <Banner
                                channel={channel}
                                bannerConfigType={bannerConfigType}
                                curBannerIndex={curBannerIndex}
                            />
                            : <ChannelPreview
                                handleClick={this.handleClickVideo.bind(this)}
                                channelTitle={currentSubject.sectionType}
                                channelCards={currentSubject.cards}
                                channelLayout={channelLayout}
                            />
                    }
                    {
                        currentSubjectIndex !== -1
                            ? layoutStatus === 2 ? (
                                <ChannelConfig
                                    loading={loading}
                                    ref={form => { this.ChannelConfigForm = form; }}
                                    channelLayout={channelLayout ? currentSubject.sechannelLayout : 2}
                                    onLayoutChange={this.handleSubjectLayoutChange.bind(this)}
                                    onNumChange={this.handleNumChange.bind(this)}
                                    onSubmit={this.handleSubmit.bind(this)}
                                    subjectData={currentSubject}
                                />
                            ) : layoutStatus === 3 ? (
                                <VideoConfig
                                    loading={loading}
                                    currentVideoIndex={this.state.currentVideoIndex}
                                    ref={form => { this.form = form; }}
                                    {...this.getCurrentVideoData()}
                                    scale={this.state.scale}
                                    timeLine={this.state.currentSubject.timeLine}
                                    onSubmit={this.handleSubmitVideo.bind(this)}
                                />
                            ) : '' : ''
                    }
                </div>
            </div>
        );
    }
}
