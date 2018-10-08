import React, { Component } from 'react';
import FadeSwiper from './Swiper/FadeSwiper';
import utils from './Swiper/swiperUtil';
import './Swiper/swiper.css';
import { imgPrefix } from '../../../utils';
import PropTypes from 'prop-types';

export default class Banner extends Component {
    static PropTypes = {
        banners: PropTypes.array
    }

    bannerSwiper = null

    // state = {
    //   curBannerIndex: this.props.curBannerIndex,
    // }

    renderBannerCursors() {
        const { curBannerIndex } = this.props;
        const { banners } = this.props;
        return banners && banners.map((item, index) => {
            if (curBannerIndex !== index) {
                return (
                    <div className='cursor single' key={item.title + index}>
                        <span className='cursor-content'>{item.title + ':' + item.secondTitle}</span>
                    </div>
                );
            } else {
                return (
                    <div className='cursor title z-active' key={item.title + index}>
                        <span className='cursor-content'>
                            <span className='title'>{item.title}</span>
                            <span className='content'>{item.secondTitle}</span>
                        </span>
                    </div>
                );
            }
        });
    }

    renderBannerCursor = () => {
        const { banners, curBannerIndex } = this.props;
        if (!Array.isArray(banners)) return;
        const banner = banners[curBannerIndex];
        if (banner) {
            return (
                <div className='cursor title z-active'>
                    <span className='cursor-content'>
                        <span className='title'>{banner.title}</span>
                        <span className='content'>{banner.secondTitle}</span>
                    </span>
                </div>
            );
        } else {
            return (
                <div className='cursor title z-active'>
                    <span className='cursor-content'>
                        <span className='title'></span>
                        <span className='content'></span>
                    </span>
                </div>
            );
        }
    }

    componentDidUpdate(preProps) {
        if ((this.props.banners !== preProps.banners && this.props.banners.length > 0) || this.props.curBannerIndex !== preProps.curBannerIndex) {
            if (this.bannerSwiper) {
                this.bannerSwiper.destoryEvents();
                this.bannerSwiper = null;
            }
            this.bannerSwiper = new FadeSwiper('.swiper-container', {
                paginations: '.banner-cursors',
                animationDuration: 50,
                autoPlay: 0,
                swiperEvent: 'mouseenter',
                next: '.next-button',
                pre: '.pre-button',
                sliderIndex: this.props.curBannerIndex || 0
            });
            // if(this.props.curBannerIndex != 0){
            //
            // }
            // this.bannerSwiper.step(this.props.curBannerIndex)
            utils.emitter.on('sliderIndexChange', (index) => {
                this.props.modifyBannerIndex(index);
            });
        }
    }

    _renderBanners(banners) {
        if (banners === null || banners === undefined) return;
        const { modifyBannerConfigType } = this.props;
        if (Array.isArray(banners) && banners.length === 0) {
            return (
                <a key='1' onClick={modifyBannerConfigType.bind(null, 1, {})} className='swiper-slider banner-slider' style={{ color: '#000', background: '#EEE' }}> </a>
            );
        } else {
            return banners && banners.map((banner, bannerIndex, array) => {
                if (!!banner.imageUrl || array.length === 0) {
                    const url = `url("${imgPrefix}${banner.imageUrl}")`;
                    return (
                        <a key={banner.id || banner.sort} onClick={modifyBannerConfigType.bind(null, 1, banner)} className='swiper-slider banner-slider' style={{ color: '#000', backgroundImage: url }}> </a>
                    );
                } else {
                    return (
                        <a key={banner.id || banner.sort} onClick={modifyBannerConfigType.bind(null, 1, banner)} className='swiper-slider banner-slider' style={{ color: '#000', background: '#EEE' }}> </a>
                    );
                }
            });
        }
    }

    render() {
        const { banners } = this.props;
        return (
            <div className='swiper-container banner'>
                <div className='cursors-wrap'>
                    <div className='banner-cursors'>
                        {
                            this.renderBannerCursor()
                        }
                    </div>
                </div>
                <div className='pre-button'>&lt;</div>
                <div className='next-button'>&gt;</div>
                <div className='swiper-wrapper'>
                    {
                        this._renderBanners(banners)
                    }
                </div>
            </div>
        );
    }
}
