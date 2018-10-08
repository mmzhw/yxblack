import React, { Component } from 'react';
import style from './style.module.css';
import { handleImgUrl } from '../../../../utils/util';

const noramlStyle = {
    height: '100%',
    border: '1px #ccc dotted'
};

const choosenStyle = {
    height: '100%',
    border: '1px #ccc dotted',
    boxShadow: '0 0 5px'
};

export default class VideoTem extends Component {
    render() {
        let imgUrl = handleImgUrl(this.props.imageUrl);
        return (
            <div
                className={`${style.videoInfo} ${style[this.props.typeClass]}  ${imgUrl ? '' : style.emptyImg}`}
                style={this.props.index === Number(this.props.currentVideoIndex) ? choosenStyle : noramlStyle}
                onClick={() => { this.props.activateVideoConfig(this.props.index, this.props.imgType); }}
            >
                {
                    imgUrl ? <img alt='' src={handleImgUrl(this.props.imageUrl)} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : null
                }
            </div>
        );
    }
}
