import React, { Component } from 'react';
import { Input, Button, Modal, message } from 'antd';
import style from './style.module.css';
import yxFetch from '../../../../../utils/tvFetch';
import { videoPrefix, handleVideoUrl } from '../../../../../utils';
import YXVideojs from '../../../../../components/Video/video';

message.config({
    top: 100,
    duration: 2,
});
const success = (content) => {
    message.success(content);
};
// const error = (content) => {
//   message.error(content)
// }
const warning = (content) => {
    message.warning(content);
};

const m3u8Parser = require('m3u8-parser');

class PSrcItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            update: 'back/video/source/update',
            audit: 'back/video/source/audit',
            enable: 'back/video/source/enable',
            imgurl: this.props.imgurl,
            playSource: this.props.playSource,
            playSourceReplace: '',
            sourceName: this.props.sourceName,
            videoBaseId: this.props.videoBaseId,
            videoOrigin: this.props.videoOrigin,
            enableStatus: this.props.videoOrigin.enableStatus,
            mp4urlSources: '',
            M3U8urlSources: '',
            type: this.props.type,
            displayM3U8: 'none',
            displayMP4: 'none',
            visibleM3U8: false,
            visibleMP4: false,
            show: {
                visibleSource: false,
                visible: false
            },
            display: 'inline-block', // 审核通过
            display1: 'none', // 启用
            display2: 'none', // 禁用
            display3: 'none', // 审核失败
            display4: 'inline-block', // 修改源
            display5: 'inline-block', // 预览
            date: new Date()
        };
    }
    componentDidMount() {
        this.JudgeType();
        this.JudgeStatus();
        this.JudgeEnable();
    }
    // 判断是否开启
    JudgeEnable() {
        if (this.state.videoOrigin.enableStatus === 1 && this.state.videoOrigin.auditStatus === 1) {
            this.setState({
                display1: 'none',
                display2: 'inline-block'
            });
        } else if (this.state.videoOrigin.enableStatus === 0 && this.state.videoOrigin.auditStatus === 1) {
            this.setState({
                display1: 'inline-block',
                display2: 'none'
            });
        }
    }
    // 判断是否通过审核
    JudgeStatus() {
        if (this.state.videoOrigin.auditStatus === 1) {
            this.setState({
                display: 'none',
                display2: 'inline-block',
                display3: 'none'
            });
        } else if (this.state.videoOrigin.auditStatus === 0) {
            this.setState({
                display: 'inline-block',
                display1: 'none',
                display2: 'none'
            });
        }
    }
    // 判断播放源类型 1 or 0
    JudgeType() {
        if (this.state.videoOrigin.videoSource === 0) {
            this.setState({
                display: 'inline-block', display1: 'none', display2: 'none', display3: 'inline-block', display4: 'none', display5: 'none',
                displayM3U8: 'inline-block',
                displayMP4: 'inline-block'
            });
        }
    }

    // 预览M3U8
    previewOpenM3U8() {
        fetch(videoPrefix + this.state.videoOrigin.videoResource.m3u8Clarity.url, {}).then((res) => {
            return res.text();
        }).then((res) => {
            const parser = new m3u8Parser.Parser();
            parser.push(res);
            parser.end();
            let parsedManifest = parser.manifest;
            if (parsedManifest) {
                let hlsList = [];
                parsedManifest.playlists.forEach((item, index) => {
                    hlsList.push({
                        src: handleVideoUrl(item.uri),
                        type: 'application/x-mpegURL',
                    });
                });
                hlsList = hlsList.reverse();
                this.setState({
                    M3U8urlSources: hlsList,
                    visibleM3U8: true
                });
            }
        });
    }
    // 预览
    previewOpen() {
        window.open(this.state.playSource);
    }
    //  预览MP4
    previewOpenMP4() {
        this.setState({
            mp4urlSources: [{
                src: videoPrefix + this.state.videoOrigin.videoResource.mp4Claritys[0].url,
            }],
            visibleMP4: true
        });
    }
    //  修改源
    openModifySourceDialog () {
        if (this.state.playSourceReplace) {
            yxFetch(this.state.update, {
                videoSource: this.state.videoOrigin.videoSource,
                videoSourceUrl: this.state.playSourceReplace.trim(),
                videoSourceId: this.state.videoOrigin.id,
            }).then(res => {
                if (res.code === 0) {
                    success('修改源成功!');
                    this.props.upsource();
                    // this.setState({
                    //   playSource: this.state.playSource1,
                    // })
                } else {
                    warning(res.errmsg);
                }
            }).catch(() => {
            });
        } else {
            warning('字段为空！');
            this.hiddenSource();
        }
        this.hiddenSource();
    }
    //  审核通过
    openAuditConfirm () {
        yxFetch(this.state.audit, {
            videoDetailId: this.state.videoOrigin.videoDetailId,
            videoSource: this.state.videoOrigin.videoSource,
            auditStatus: 1,
            videoBaseId: this.state.videoBaseId,
        }).then(res => {
            if (res.code === 0) {
                success('审核通过!');
                this.props.upsource();
            } else {
                warning(res.errmsg);
            }
        }).catch(() => {
        });
        this.hidden();
    }
    //  启用或禁用播放源
    enableSourceUrl () {
        yxFetch(this.state.enable, {
            enableStatus: Math.abs(this.state.enableStatus - 1),
            videoSourceId: this.state.videoOrigin.id,
        }).then(res => {
            if (res.code === 0) {
                if (this.state.enableStatus === 1) {
                    success('禁用成功!');
                }
                if (this.state.enableStatus === 0) {
                    success('启用成功!');
                }
                var temp = this.state.display1;
                this.setState({
                    display1: this.state.display2,
                    display2: temp,
                    enableStatus: Math.abs(this.state.enableStatus - 1)
                });
                this.props.upsource();
            } else {
                warning(res.errmsg);
            }
        });
    }
    // 审核失败
    auditFail() {
        yxFetch(this.state.audit, {
            videoDetailId: this.state.videoOrigin.videoDetailId,
            videoSource: this.state.videoOrigin.videoSource,
            auditStatus: 0,
            videoBaseId: this.state.videoBaseId,
        }).then(res => {
            if (res.code === 0) {
                success('请求已发送!');
                this.props.update();
                this.props.upsource();
            } else {
                warning(res.errmsg);
            }
        });
    }
    // 关闭MP4播放器
    handlePlayerCloseMP4() {
        this.setState({
            visibleMP4: false
        });
    }
    // 关闭M3U8播放器
    handlePlayerCloseM3U8() {
        this.setState({
            visibleM3U8: false
        });
    }
    hidden() {
        this.setState({ show: { 'visible': false }});
    }
    hiddenSource() {
        this.refs.changesource.value = this.state.playSource;
        this.setState({ show: { 'visibleSource': false }});
    }
    showSource() {
        this.setState({ show: { 'visibleSource': true }});
        setTimeout(function() {
            this.refs.changesource.focus();
        }.bind(this), 500);
    }
    show() {
        this.setState({ show: { 'visible': true }});
    }
    handleChange(event) {
        this.setState({
            playSourceReplace: event.target.value
        });
    }
    render() {
        return (
            <div className={style['p-src-item']}>
                <div className={style['src-icon']}>
                    {this.state.sourceName}
                    <img alt='' className={style['img']} src={this.state.imgurl}/>
                </div>
                <div className={style['src-link']}>
                    <Input value={this.state.playSource} readOnly/>
                </div>
                <div className={style['src-action']}>
                    <Button type='primary' style={{ 'display': this.state.displayM3U8 }} onClick={this.previewOpenM3U8.bind(this)} >预览M3U8</Button>
                    <Button type='primary' style={{ 'display': this.state.displayMP4 }} onClick={this.previewOpenMP4.bind(this)} >预览MP4</Button>
                    <Button type='default' style={{ 'display': this.state.display5 }} onClick={this.previewOpen.bind(this)} >预览</Button>
                    <Button type='default' style={{ 'display': this.state.display4 }} onClick={this.showSource.bind(this)} >修改源</Button>
                    <Button type='primary'style={{ 'display': this.state.display }} onClick={this.show.bind(this)} >审核通过</Button>
                    <Button type='danger' onClick={this.auditFail.bind(this)} style={{ 'display': this.state.display3 }} >审核失败</Button>
                    <Button type='primary'style={{ 'display': this.state.display1 }} onClick={this.enableSourceUrl.bind(this)} >启用</Button>
                    <Button type='danger' style={{ 'display': this.state.display2 }} onClick={this.enableSourceUrl.bind(this)} >禁用</Button>
                </div>
                <div>
                    <Modal visible={this.state.show.visible} width={300} title='审核通过' maskClosable='true' style={{ 'marginTop': '280px' }} onOk={this.openAuditConfirm.bind(this)} onCancel={this.hidden.bind(this)} >
                        <p>播放源已确认无误？</p>
                    </Modal>
                </div>
                <div>
                    <Modal visible={this.state.show.visibleSource} width={300} title='修改源' maskClosable='true' style={{ 'marginTop': '280px' }} onCancel={this.hiddenSource.bind(this)} onOk={this.openModifySourceDialog.bind(this)}>
                        <span>地址</span>
                        <br />
                        <input ref='changesource' onChange={this.handleChange.bind(this)} defaultValue={this.state.playSource} className={style['src-model']} />
                    </Modal>
                </div>
                <div>
                    <Modal
                        title='视频播放'
                        visible={ this.state.visibleMP4 }
                        onOk={ this.handlePlay }
                        onCancel={ this.handlePlayerCloseMP4.bind(this) }
                        okText='开始'
                        cancelText='关闭'
                        maskClosable={ false }
                        width={ 800 }
                    >
                        <YXVideojs
                            sources={this.state.mp4urlSources }
                            autoplay={true}
                            width={768}
                        />
                    </Modal>
                </div>
                <div>
                    <Modal
                        title='视频播放'
                        visible={ this.state.visibleM3U8 }
                        onOk={ this.handlePlay }
                        onCancel={ this.handlePlayerCloseM3U8.bind(this) }
                        okText='开始'
                        cancelText='关闭'
                        maskClosable={ false }
                        width={ 800 }
                    >
                        <YXVideojs
                            sources={this.state.M3U8urlSources }
                            autoplay={true}
                            width={768}
                        />
                    </Modal>
                </div>
            </div>
        );
    }
}

export default PSrcItem;
