import React, { Component } from 'react';
import style from './style.module.css';
import { handleImgUrl } from '../../../utils/util';

export default class VideoTem extends Component {
    render() {
        let imgUrl = handleImgUrl(this.props.imageUrl);
        return (
            <div
                className={`swiper-slide ${style.videoInfo} ${style[this.props.typeClass]}  ${imgUrl ? '' : style.emptyImg}`}
                onClick={() => { this.props.activateVideoConfig(this.props.index, this.props.imgType); }}
            >
                {
                    imgUrl ? <img alt='' src={handleImgUrl(this.props.imageUrl)}/> : null
                }
            </div>
        );
    }
}
