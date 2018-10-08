import React, { Component } from 'react';
import style from './style.module.css';
import VideoTem from './VideoTem.js';

export default class moduleFirst extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (this.swiper) {
            this.swiper.detachEvents();
        }
    }

    render() {
        let typeClass = 'normal';
        let layStyle = {
            flex: 1,
            position: 'relative',
        };
        let imgType = 1;
        return (
            <div className={style.module}>
                <p style={{ width: '100%', padding: '7px 0' }}>{this.props.card.layoutName}</p>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {
                        this.props.card && this.props.card.videos && this.props.card.videos.map((card, index) => {
                            return (
                                <div style={layStyle} key={index}>
                                    <div style={{ width: '100%', paddingBottom: '43%' }}>
                                        <div style={{ width: '98%', height: '98%', position: 'absolute', top: '0', left: '0', right: '0' }}>
                                            <VideoTem
                                                typeClass={typeClass}
                                                key={index}
                                                index={index}
                                                imageUrl={card.imageUrl}
                                                imgType={imgType}
                                                currentVideoIndex={this.props.currentVideoIndex}
                                                activateVideoConfig={this.props.activateVideoConfig}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
