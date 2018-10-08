import React, { Component } from 'react';
import Swiper from 'swiper';
import PropTypes from 'prop-types';
import style from './SubVideoContentSwiper.module.css';
import 'swiper/dist/css/swiper.css';

export default class SubVideContentSwiper extends Component {
    static PropTypes = {
        swiperClass: PropTypes.string,
        isSwiper: PropTypes.bool
    }

    static defaultProps = {
        swiperClass: 'swiper-contain',
        isSwiper: false
    }

    componentDidUpdate(prevProps, prevState) {
        const swiperClass = prevProps.swiperClass;
        this.swiper.detachEvents();
        this.swiper = new Swiper(`.${swiperClass}`, {
            slidesPerView: 'auto',
            spaceBetween: 6,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
        });
    }

    componentDidMount() {
        const { isSwiper, swiperClass } = this.props;
        if (isSwiper) {
            this.swiper = new Swiper(`.${swiperClass}`, {
                slidesPerView: 'auto',
                spaceBetween: 6,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
            });
        } else {
            const mySwiper = new Swiper(`.${swiperClass}`, {
                slidesPerView: 'auto',
                spaceBetween: 6,
            });
            mySwiper.detachEvents();
        }
    }
    render() {
        const { isSwiper, swiperClass } = this.props;
        return (
            <div className={`${swiperClass}`} style={{ boxSizing: 'border-box', padding: '20px 30px', overflow: 'hidden', position: 'relative' }} >
                <div className='swiper-wrapper'>
                    { this.props.children }
                </div>
                {isSwiper ? (<div className={`swiper-button-prev swiper-button-black ${style['swiper-button-prev']}`}/>) : ''}
                {isSwiper ? (<div className={`swiper-button-next swiper-button-black ${style['swiper-button-next']}`}/>) : ''}
            </div>
        );
    }
}
