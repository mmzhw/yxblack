import React, { Component } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
import 'videojs-contrib-hls';

import 'videojs-resolution-switcher';
import 'videojs-resolution-switcher/lib/videojs-resolution-switcher.css';

class YXVideojs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: props.sources || [],
            autoplay: props.autoplay === undefined ? false : props.autoplay,
            techOrder: ['html5', 'flash'],
            controls: props.controls || true,
            loop: props.loop || true,
            width: props.width || 768,
            height: props.height || 576,
            poster: props.poster || '',
            player: null,
        };
        this.player = null;
    }

    componentDidMount() {
        this.initPlayer();
    }

    componentWillReceiveProps(nextProps) {
        if (this.player && JSON.stringify(nextProps.sources) !== JSON.stringify(this.props.sources)) {
            this.player.updateSrc(nextProps.sources);
        }
        if (this.player && !nextProps.pause) {
            this.player.pause();
        }
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
    }

    initPlayer() {
        let videoOpiton = {
            sources: this.state.sources,
            techOrder: this.state.techOrder,
            controls: this.state.controls,
            loop: this.state.loop,
            width: this.state.width,
            height: this.state.height,
            poster: this.state.poster,
            autoplay: this.state.autoplay,
        };
        videoOpiton.html5 = {
            hls: { withCredentials: false },
            hlsjsConfig: {
                debug: false
            }
        };

        videoOpiton.plugins = {
            videoJsResolutionSwitcher: {
                ui: false,
                default: 'high',
                dynamicLabel: false
            }
        };
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
        let videoSources = this.props.sources;
        this.player = videojs(this.refs.videoPlayer, videoOpiton, () => {
            let player = this.player;
            player.updateSrc(videoSources);
            player.on('resolutionchange', function() {
                console.info('Source changed to %s', player.src());
            });
        });
    }

    render() {
        return (
            <div className='playWrap'>
                <video className='video-js' ref='videoPlayer'></video>
            </div>
        );
    }
}

export default YXVideojs;
