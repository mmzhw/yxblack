import React, { Component } from 'react';
import style from './style.module.css';
import Swiper from 'swiper';
import VideoTem from './VideoTem.js';
import { handleModuleType } from '../../../PublicTools';
import { OTT_MODULE } from '../../../constants/constants';

import 'swiper/dist/css/swiper.css';

export default class moduleSec extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (this.swiper) {
            this.swiper.detachEvents();
        }
        this.swiper = new Swiper(`.swiper-container`, {
            spaceBetween: 20,
            slidesPerView: handleModuleType(this.props.card.layoutId),
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            buttonDisabledClass: style['my-button-disabled'],
        });
    }

    componentDidMount() {
        this.swiper = new Swiper(`.swiper-container`, {
            spaceBetween: 20,
            slidesPerView: handleModuleType(this.props.card.layoutId),
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            buttonDisabledClass: style['my-button-disabled'],
        });
    }

    render() {
        let moduleStyle = {};
        switch (this.props.card.layoutId) {
            case OTT_MODULE.SECOND:
                moduleStyle.width = '828px';
                break;
            case OTT_MODULE.SIXTH:
                moduleStyle.width = '673px';
                break;
            default:
                break;
        }
        return (
            <div className={style.module}>
                <p style={moduleStyle}>{this.props.card.layoutName}</p>
                <div className={`swiper-container ${style.swiperWrapper} ${style.second}`} style={moduleStyle}>
                    <div className={`swiper-wrapper`}>
                        {
                            this.props.card && this.props.card.videos && this.props.card.videos.map((card, index) => {
                                return (
                                    <VideoTem
                                        typeClass={index % handleModuleType(this.props.card.layoutId) === 0 ? 'big' : 'small'}
                                        key={index}
                                        index={index}
                                        imageUrl={card.imageUrl}
                                        imgType={index % handleModuleType(this.props.card.layoutId) === 0 ? 1 : 3}
                                        activateVideoConfig={this.props.activateVideoConfig}
                                    />
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
