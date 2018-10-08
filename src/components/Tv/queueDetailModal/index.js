import React, { Component } from 'react';
import { Modal } from 'antd';
import style from './index.module.css';

class QueueDetailModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getVideoItem = this.getVideoItem.bind(this);
    }

    handleOk() {
        this.props.handleOk();
    }
    handleCancel() {
        this.props.handleCancel();
    }

    getVideoItem(video, index) {
    // 播放状态, 0-未播放，1-正在播放， 2-已播放
        let videoItem = (
            <p className={style['video-item']} key={index}>
                <span className={style['item-dot']}></span>
                <span className={style['item-title']}>{ video.title }</span>
            </p>
        );
        if (video.playStatus === 1) {
            videoItem = (
                <p className={style['video-item']} key={index}>
                    <span className={style['item-dot-green']}></span>
                    <span className={style['item-title']}>{ video.title }</span>
                </p>
            );
        } else if (video.playStatus === 2) {
            videoItem = (
                <p className={style['video-item']} key={index}>
                    <span className={style['item-dot-red']}></span>
                    <span className={style['item-title']}>{ video.title }</span>
                </p>
            );
        }
        return videoItem;
    }

    render() {
        return (
            <Modal
                title='播放列表'
                visible={this.props.visible}
                footer={null}
                onCancel={this.handleCancel}
            >
                {
                    this.props.queueDetailList.map((video, index) => {
                        return this.getVideoItem(video, index);
                    })
                }
            </Modal>
        );
    }
}

export default QueueDetailModal;
