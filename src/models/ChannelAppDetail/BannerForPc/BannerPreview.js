import React, { Component } from 'react';
import BannerSwiper from './BannerSwiper';
import style from './style.module.css';
import PropTypes from 'prop-types';

export default class Banner extends Component {
    static PropTypes = {
        banners: PropTypes.array
    }

    render() {
        const { banners, curBannerIndex, modifyBannerConfigType, modifyBannerIndex } = this.props;
        return (
            <div className={style['channel-preview']}>
                <div className={style['card-header']}>
                    <div className={style['card-header-title']}>预览</div>
                    <div className={style['card-header-sub']}>点击相应区域，可配置内容</div>
                </div>
                <div className={style['card-main']}>
                    <div className={style['cards-wrap']}>
                        <BannerSwiper
                            banners={banners}
                            curBannerIndex={curBannerIndex}
                            modifyBannerConfigType={modifyBannerConfigType}
                            modifyBannerIndex={modifyBannerIndex}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
