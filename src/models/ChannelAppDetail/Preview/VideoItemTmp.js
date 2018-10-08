import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';

import { imgPrefix } from '../../../utils/index';

const formatImgUrl = (imgUrl) => {
    if (imgUrl.includes(imgPrefix) || imgUrl.includes('http://')) {
        return imgUrl;
    }
    return imgPrefix + imgUrl;
};

const produceInitImg = (layout) => {
    let imgUrl;
    if (Number(layout) === 5 || Number(layout) === 6) {
        imgUrl = require('../../../assets/none-2-3.png');
    } else {
        imgUrl = require('../../../assets/none-16-9.png');
    }
    return imgUrl;
};

const VideoItemTmp = (props) => (
    <div className={`${style['video-item-wrap']} ${props.addedClass}`} style={{ width: props.width }} onClick={props.handleClick}>
        <div className={style['video']} style={{ width: props.width, height: props.height }}>
            <img
                alt=''
                width={props.width}
                height={props.height}
                className={style['video-img']}
                src={props.imageUrl ? (formatImgUrl(props.imageUrl)) : produceInitImg(props.layout)}
            />
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

VideoItemTmp.PropTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    imageUrl: PropTypes.string,
    topRightStr: PropTypes.string,
    bottomRightStr: PropTypes.string
};

export default VideoItemTmp;
