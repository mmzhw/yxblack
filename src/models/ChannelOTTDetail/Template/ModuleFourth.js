import React, { Component } from 'react';
import style from './style.module.css';
import Swiper from 'swiper';
import { handleImgUrl, handleModuleType } from '../../../PublicTools';

import 'swiper/dist/css/swiper.css';

export default class ModuleFourth extends Component {
    componentDidUpdate() {
        if (this.swiper) {
            this.swiper.detachEvents();
        }
        this.swiper = new Swiper(`.swiper-container`, {
            spaceBetween: 20,
            slidesPerView: handleModuleType(this.props.card.layoutId) + 2,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            buttonDisabledClass: style['my-button-disabled'],
        });
    }

    componentDidMount() {
        this.swiper = new Swiper(`.swiper-container`, {
            spaceBetween: 20,
            slidesPerView: handleModuleType(this.props.card.layoutId) + 2,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            buttonDisabledClass: style['my-button-disabled'],
        });
    }

    // 格式化videos数组，以便于循环显示
    splitVideos(card) {
        let resultVideos = [];
        let tempVideos = [];
        let initVideos = card.videos;
        initVideos = initVideos.map((video, index) => {
            return {
                ...video,
                index: index,
            };
        });
        for (let i = 0; i < card.loop; i++) {
            let groupArr = initVideos.filter((video, index) => {
                return (index < (i + 1) * 9) && (index >= i * 9);
            });
            if (groupArr.length > 0) {
                tempVideos.push(groupArr);
            }
        }

        tempVideos.forEach((tempVideo) => {
            let left = tempVideo.filter((video, index) => {
                return (index < 3);
            });
            let right = tempVideo.filter((video, index) => {
                return (index >= 3);
            });
            resultVideos.push(left);
            resultVideos.push(right);
        });
        return resultVideos;
    }

    render() {
        let resultVideos = this.splitVideos(this.props.card);
        let moduleStyle = { width: '925px' };
        return (
            <div className={style.module}>
                <p style={moduleStyle}>{this.props.card.layoutName}</p>
                <div className={`swiper-container ${style.swiperWrapper} ${style.fourth}`} style={moduleStyle}>
                    <div className='swiper-wrapper'>
                        {
                            resultVideos.map((cards, index) => {
                                return (
                                    <div key={index} className={`swiper-slide ${style[(index + 1) % 2 !== 0 ? 'moduleLeft' : 'moduleRight']}`}>
                                        {
                                            cards.map((card, cardindex) => {
                                                let imgUrl = handleImgUrl(card.imageUrl);
                                                return (
                                                    <div
                                                        className={`${style.videoInfo} ${style[(index + 1) % 2 !== 0 ? 'big' : 'small']}  ${imgUrl ? '' : style.emptyImg}`}
                                                        onClick={() => { this.props.activateVideoConfig(Number(card.index), 3); }}
                                                        key={cardindex}
                                                    >
                                                        {
                                                            imgUrl ? <img alt='' src={handleImgUrl(card.imageUrl)}/> : null
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={`swiper-button-prev ${style.swiperPrev}`} />
                    <div className={`swiper-button-next ${style.swiperNext}`} />
                </div>

            </div>
        );
    }
}
