import React, { Component } from 'react';
import YXVideo from '../../components/Video';
import style from './style.module.css';
import { videoPrefix } from '../../utils/url';

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: `${videoPrefix}越狱第五季第一集_m3u8_240P_480P_720P_0325_2.m3u8`,
            type: 'application/x-mpegURL'
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            videoUrl: `${videoPrefix}cyndiwants1_480p.mp4`,
            type: 'video/mp4'
        });
    }

    render() {
        return (
            <div className={style.bg}>
                <YXVideo src={this.state.videoUrl} type={this.state.type} />
                <button type='submit' onClick={this.toggle}>切换</button>
            </div>
        );
    }
}

export default Video;
