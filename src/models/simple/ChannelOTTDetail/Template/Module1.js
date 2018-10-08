import React, { Component } from 'react';
import style from './style.module.css';
import Swiper from 'swiper';
import VideoTem from './VideoTem.js';
import { OTT_MODULE } from '../../../../constants/constants';
import { handleModuleType } from '../../../../PublicTools';

import 'swiper/dist/css/swiper.css';

export default class moduleFirst extends Component {
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
        let typeClass = 'normal';
        let moduleStyle = {};
        let imgType = 1;
        switch (this.props.card.layoutId) {
            case OTT_MODULE.FIRST:
                typeClass = 'normal';
                moduleStyle.width = '912px';
                break;
            case OTT_MODULE.THIRD:
                typeClass = 'normalVertical';
                moduleStyle.width = '808px';
                imgType = 3;
                break;
            case OTT_MODULE.FIFTH:
                typeClass = 'subject';
                moduleStyle.width = '720px';
                break;
            case OTT_MODULE.SEVENTH: // 横图6导航
                typeClass = 'nav';
                moduleStyle.width = '1162px';
                break;
            default:
                break;
        }

        return (
            <div className={style.module}>
                <p style={moduleStyle}>{this.props.card.layoutName}</p>
                <div className={`swiper-container ${style.swiperWrapper} ${style.first}`} style={moduleStyle}>
                    <div className={`swiper-wrapper`}>
                        {
                            this.props.card && this.props.card.videos && this.props.card.videos.map((card, index) => {
                                return (
                                    <VideoTem
                                        typeClass={typeClass}
                                        key={index}
                                        index={index}
                                        imageUrl={card.imageUrl}
                                        imgType={imgType}
                                        activateVideoConfig={this.props.activateVideoConfig}
                                    />
                                );
                            })
                        }
                    </div>
                    <div className={`swiper-button-prev ${style.swiperPrev}`}/>
                    <div className={`swiper-button-next ${style.swiperNext}`}/>
                </div>

            </div>
        );
    }
}
