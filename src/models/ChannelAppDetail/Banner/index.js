import React, { Component } from 'react';
import { imgPrefix } from '../../../utils';
import { message, Button } from 'antd';
import style from './style.module.css';

class BannerSlide extends Component {
    constructor(props) {
        super(props);
        this._index = 0; // 当前正在显示的图片
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.goBanner = this.goBanner.bind(this);
        this.editBanner = this.editBanner.bind(this);
    }

    prev() {
        let oldTranslateX = parseInt(this.refs.slideInner.style.transform.slice(11), 10);
        let newTranslateX = (oldTranslateX === 0) ? (-this.props.bannerWidth + 375) : (oldTranslateX + 375);
        this._index = this.props.bannerIndex - 1;
        if (this._index === 0) {
            this._index = this.props.bannerListLength - 1;
        } else {
            this._index--;
        }
        this.props.getBannerIndex(this._index + 1);
        this.props.changeTranslateX(newTranslateX);
    }

    next() {
        let oldTranslateX = parseInt(this.refs.slideInner.style.transform.slice(11), 10);
        let newTranslateX = (oldTranslateX === -this.props.bannerWidth + 375) ? 0 : (oldTranslateX - 375);
        this._index = this.props.bannerIndex - 1;
        if (this._index < this.props.bannerListLength - 1) {
            this._index++;
        } else {
            this._index = 0;
        }
        this.props.getBannerIndex(this._index + 1);
        this.props.changeTranslateX(newTranslateX);
    }

    goBanner(index) {
        let newTranslateX = -375 * index;
        this.props.getBannerIndex(index + 1);
        this.props.changeTranslateX(newTranslateX);
    }

    editBanner(index) {
        if (this.props.isBannerEnabled) {
            this.props.editBannerItem(index);
        } else {
            message.info('该组件未启用，不可编辑！！！');
        }
    }

    render() {
        return (
            <div>
                <div className={style['slide-wrapper']}>
                    <div ref='slideInner' className={style['slide-inner']} style={{
                        width: this.props.bannerWidth,
                        transform: 'translateX(' + this.props.translateX + 'px)'
                    }}>
                        {
                            this.props.bannerList.map((value, i) => {
                                return (
                                    <div onClick={(e) => this.editBanner(i)} key={i} className={style['slide-item']}
                                        style={{ backgroundImage: ((value.imageUrl) ? ('url(' + imgPrefix + value.imageUrl + ')') : '') }}>
                                        <div className={style['slide-item-title']}>
                                            <h1>{value.title}</h1>
                                            <h2>{value.secondTitle}</h2>
                                        </div>
                                        <div className={style['slide-sub']}/>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className={style['slide-dots']}>
                        {
                            this.props.bannerList.map((value, i) => {
                                return (
                                    <span
                                        key={i}
                                        onClick={(e) => this.goBanner(i)}
                                        className={(i === this.props.bannerIndex - 1) ? style['slide-dots-on'] : style['slide-dots-item']}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
                <div className={style['slide-btn']}>
                    <div className={style['slide-next']} onClick={this.next}>
                        <Button type='primary' icon='right' shape='circle' />
                    </div>
                    <div className={style['slide-prev']} onClick={this.prev}>
                        <Button type='primary' icon='left' shape='circle'/>
                    </div>
                </div>
            </div>
        );
    }
}

export default BannerSlide;
