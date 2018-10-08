import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';

import { imgPrefix } from 'Util';

const VideoItem = (props) => (
    <div className={`${style['video-item-wrap']} swiper-slide`} style={{ width: props.width, height: props.height }} onClick={props.handleClick}>
        <div className={style['video']} style={{ width: props.width, height: props.height }}>
            <img alt='' width={props.width} height={props.height} className={style['video-img']} src={props.imageUrl.includes(imgPrefix) ? props.imageUrl : imgPrefix + props.imageUrl || require('../../../assets/none-16-9.png')} alt=''/>
            {
                props.topRightStr &&
          <span className={style['exclusive-play']}>{props.topRightStr}</span>
            }
            {
                props.bottomRightStr &&
          <span className={style['episode-info']}>{props.bottomRightStr}</span>
            }
        </div>
        <div className={style['video-footer']}>
            <a className={style['title']}>{props.title}</a>
            <div className={style['content']}>{props.subtitle}</div>
        </div>
    </div>
);

VideoItem.PropTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    subTitle: PropTypes.string,
    topRightStr: PropTypes.string,
    bottomRightStr: PropTypes.string
};

export default VideoItem;
