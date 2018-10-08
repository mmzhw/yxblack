import React, { Component } from 'react';
import style from './style.module.css';
import VideoItemTmp from './VideoItemTmp.js';
import SubVideoContentSwiper from './SubVideoContentSwiper';

export default class ChannelPreview extends Component {
    // 补齐模板
    formatTmp = (channelLayout, channelCards) => {
    // debugger
        let result = null;
        switch (channelLayout) {
            case 1:
                for (let j = 0, len1 = 2 - channelCards.length; j < len1; j++) {
                    channelCards.push({
                        layoutId: 4,
                        more: false,
                        moreUrl: '',
                        sort: j,
                        title: `专题名称${j + 1}`,
                        videos: [],
                    });
                }
                channelCards.forEach(card => {
                    for (let i = 0, len = 6 - card.videos.length; i < len; i++) {
                        card.videos.push({
                            sort: card.videos.length + 1,
                            imageId: '',
                            imageUrl: '',
                            name: '',
                            subName: '',
                            url: '',
                            videoBaseId: ''
                        });
                    }
                });
                result = channelCards;
                break;
            case 2:
                channelCards.forEach(card => {
                    for (let i = 0, len = 9 - card.videos.length; i < len; i++) {
                        card.videos.push({
                            sort: card.videos.length + 1,
                            imageId: '',
                            imageUrl: '',
                            name: '',
                            subName: '',
                            url: '',
                            videoBaseId: ''
                        });
                    }
                });
                result = channelCards;
                break;
            case 3:
                channelCards.forEach(card => {
                    for (let i = 0, len = 12 - card.videos.length; i < len; i++) {
                        card.videos.push({
                            sort: card.videos.length + 1,
                            imageId: '',
                            imageUrl: '',
                            name: '',
                            subName: '',
                            url: '',
                            videoBaseId: ''
                        });
                    }
                });
                result = channelCards;
                break;
            case 4:
                channelCards.forEach(card => {
                    for (let i = 0, len = 6 - card.videos.length; i < len; i++) {
                        card.videos.push({
                            sort: card.videos.length + 1,
                            imageId: '',
                            imageUrl: '',
                            name: '',
                            subName: '',
                            url: '',
                            videoBaseId: ''
                        });
                    }
                });
                result = channelCards;
                break;
            case 5:
                channelCards.forEach(card => {
                    for (let i = 0, len = 6 - card.videos.length; i < len; i++) {
                        card.videos.push({
                            sort: card.videos.length + 1,
                            imageId: '',
                            imageUrl: '',
                            name: '',
                            subName: '',
                            url: '',
                            videoBaseId: ''
                        });
                    }
                });
                result = channelCards;
                break;
            case 6:
                channelCards.forEach(card => {
                    for (let i = 0, len = 12 - card.videos.length; i < len; i++) {
                        card.videos.push({
                            sort: card.videos.length + 1,
                            imageId: '',
                            imageUrl: '',
                            name: '',
                            subName: '',
                            url: '',
                            videoBaseId: ''
                        });
                    }
                });
                result = channelCards;
                break;
            default:
        }
        return result;
    }

    getSize(channelLayout, index) {
        let width = 0;
        let height = 0;
        switch (channelLayout) {
            case 1:
                width = 134;
                height = 82;
                break;
            case 2:
                if (index) { // 不是第一张
                    width = 134;
                    height = 82;
                } else {
                    width = 286;
                    height = 230;
                }
                break;
            case 3:
                width = 134;
                height = 82;
                break;
            case 4:
                width = 134;
                height = 82;
                break;
            case 5:
                width = 132;
                height = 233;
                break;
            case 6:
                width = 132;
                height = 233;
                break;
            default:
                width = 134;
                height = 82;
                break;
        }
        return { width, height };
    }

    handleClick = (cardIndex, videoData, videoIndex) => {
        this.props.handleClick(cardIndex, videoData, videoIndex);
    }

    render() {
        const { channelCards, channelLayout } = this.props;
        return (
            <div className={style['channel-preview']}>
                <div className={style['card-header']}>
                    <div className={style['card-header-title']}>页面布局</div>
                    <div className={style['card-header-sub']}>点击相应区域，可配置内容</div>
                </div>
                <div className={style['card-main']}>
                    <div className={style['cards-wrap']}>
                        <div className={style['cards']}>
                            {
                                [1, 2, 3, 6].indexOf(channelLayout) > -1 && channelCards && channelCards.map((card, i) => (
                                    <div key={i} style={{ overflow: 'hidden' }} className={channelLayout === 1 ? `${style['layout-1']}` : ''}>
                                        <h3 className={style['title']}>{card.title}</h3>
                                        {
                                            card && card.videos.map((video, index) => (
                                                <VideoItemTmp
                                                    handleClick={() => this.handleClick(i, video, index)}
                                                    key={index }
                                                    layout={channelLayout}
                                                    width={this.getSize(channelLayout, index).width}
                                                    height={this.getSize(channelLayout, index).height}
                                                    imageUrl={video.imageUrl}
                                                    imageId={video.imageId}
                                                    title={video.name}
                                                    subtitle={video.subName}
                                                />
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        {
                            (channelLayout === 4 || channelLayout === 5) ? (
                                <div className={style['cards']}>
                                    <h3 className={style['title']}>{channelCards[0].title}</h3>
                                    <SubVideoContentSwiper swiperClass='swiper-container' isSwiper={true}>
                                        {
                                            channelCards && channelCards[0].videos.map((video, index) => (
                                                <VideoItemTmp
                                                    layout={channelLayout}
                                                    addedClass='swiper-slide'
                                                    handleClick={() => this.handleClick(0, video, index)}
                                                    key={index}
                                                    width={this.getSize(channelLayout, index).width}
                                                    height={this.getSize(channelLayout, index).height}
                                                    title={video.name}
                                                    imageUrl={video.imageUrl}
                                                    subtitle={video.subName}
                                                />
                                            ))
                                        }
                                    </SubVideoContentSwiper>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
