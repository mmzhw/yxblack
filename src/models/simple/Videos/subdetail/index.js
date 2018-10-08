import React, { Component } from 'react';
import { Card, Button, Form, message } from 'antd';
import Grid from './Grid';
import InputRow from '../../../../components/FormRow/InputRow';
import style from './style.module.css';
import ImageUpload from '../../../../components/Upload';
import yxFetch from '../../../../utils/tvFetch';
import SourceCard from '../../SourceCard';
import {
    Link
} from 'react-router-dom';
import * as urls from '../../../constants/urls';
import { REQ_URL } from '../../../constants/constants';
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
const bodyStyle = {
    padding: '10px'
};
class SubDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailImg: '',
            flagImg: '',
            flag: 0,
            flagAddSource: 0,
            videoBaseId: props.match.match.params.parentVideoId,
            videoDetailId: this.queryVideoDetailId(props.match.location),
            baseVideo: {
                vVideoDetailRspVos: [],
                newVideoDetails: [],
            },
            // 上架下架display
            displayUp: 'none',
            displayDown: 'none',
            precessingStatus: '',
            // 转码控制 display
            displayZM: 'none',
            displayYZM: 'none',
            displayBKZM: 'none',
            displayZZCL: 'none',
            displayCLSB: 'none',
            // sub video detail
            title: '',
            subTitle: '',
            episode: 0,
            episodeDisplay: '',
            images: [],
            // not required
            intro: '',
            duration: 0,
            originalUrl: '',
            imgUrl5: '', // 1:1
            imgUrl1: '', // 16:9
            imgUrl2: '', // 4:3
            imgUrl3: '', // 2:3
            imgUrl4: '', // 3:2
        };
        this.addSubDetail = this.addSubDetail.bind(this);
        this.originalUrlChange = this.originalUrlChange.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.subTitleChange = this.subTitleChange.bind(this);
        this.episodeChange = this.episodeChange.bind(this);
        this.episodeDisplayChange = this.episodeDisplayChange.bind(this);
        this.durationChange = this.durationChange.bind(this);
        this.introChange = this.introChange.bind(this);
        this.updateSubDetail = this.updateSubDetail.bind(this);
        this.clearSubDetail = this.clearSubDetail.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.getImage = this.getImage.bind(this);
        this.trim = this.trim.bind(this);
    }
    componentWillReceiveProps(props) {
    // when address bar link changed
        if (this.props.match.location !== props.match.location) {
            this.props.form.resetFields();
            this.fetchSubVideoDetail(this.queryVideoDetailId(props.match.location));
        }
    }
    clearSubDetail() {
        this.props.form.resetFields(); // 强制更新所有fields的值
        this.setState({
            videoDetailId: '',
            episode: 0,
            episodeDisplay: '',
            images: [],
            imgUrl5: '', // 2:3
            imgUrl1: '', // 16:9
            imgUrl2: '', // 4:3
            imgUrl3: '', // 1:1
            imgUrl4: '', // 3:2
            intro: '',
            duration: 0,
            originalUrl: '',
            displayBKZM: 'none',
            displayCLSB: 'none',
            displayZZCL: 'none',
            displayZM: 'none',
            displayYZM: 'none',
            flagAddSource: this.state.flagAddSource + 1,
        }, () => {
            this.setImgUrls();
        });
    // console.log(this.state.flag)
    }
    componentDidMount() {
        this.fetchBaseVideo();
        this.fetchSubVideoDetail();
        this.fetchVideoDetail();
    }
    fetchVideoDetail() {
        yxFetch(REQ_URL.NETS_VIDEO_BASE_INFOS, {
            videoBaseId: this.state.videoBaseId,
            searchFlag: 0,
        })
            .then(res => {
                if (res.code === 0) {
                    this.setState({
                        detailImg: res.data.images
                    });
                    if (this.state.detailImg[0].scale === 3) {
                        this.setState({
                            flagImg: 1
                        });
                    }
                }
            }).catch(({ res }) => {
                //
            });
    }
    // 判断视频状态
    judgeStatus() {
        if (this.state.baseVideo.status === 2) {
            this.setState({
                displayUp: 'none',
                displayDown: 'inline-block'
            });
        } else {
            this.setState({
                displayUp: 'inline-block',
                displayDown: 'none'
            });
        }
    }
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }
    queryVideoDetailId(location) {
        return window.location.search.split('=')[1];
    }
    addSubDetail(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            // if (this.state.baseVideo.bizType === 2 && !this.getImage(1)) {
            //   message.warn('请至少上传比例为 16:9 的图片!', 3)
            //   return
            // }
            let duration = this.state.duration ? this.state.duration : 0;
            duration = parseInt(duration, 10) * 60;
            yxFetch(REQ_URL.VIDEO_ADD_DETAIL, {
                duration,
                episode: this.state.episode,
                episodeDisplay: this.state.episodeDisplay,
                images: this.state.images,
                intro: this.state.intro,
                originalUrl: this.trim(this.state.originalUrl),
                subTitle: this.state.subTitle,
                title: this.state.title,
                videoBaseId: this.state.videoBaseId,
            })
                .then(res => {
                    if (res.code === 0) {
                        success('添加成功!');
                        this.fetchBaseVideo();
                        this.props.match.history.push(`${urls.VIDEO_LIST}/VideoDetail/${this.state.baseVideo.videoBaseId}/videoSubDetail?videoDetailId=${res.data.videoDetailId}`);
                        this.setState({
                            videoDetailId: res.data.videoDetailId
                        });
                        this.setState({
                            flag: this.state.flag + 1
                        });
                    } else {
                        message.error(res.errmsg);
                    }
                }).catch(({ res }) => {
                    message.error('添加失败');
                });
        });
    }
    updateSubDetail(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            // if (this.state.baseVideo.bizType === 2 && !this.getImage(1)) {
            //   message.warn('请至少上传比例为 16:9 的图片!', 3)
            //   return
            // }
            let duration = this.state.duration ? this.state.duration : 0;
            duration = parseInt(duration, 10) * 60;
            yxFetch(REQ_URL.VIDEO_UPDATE_DETAIL, {
                duration,
                episode: this.state.episode,
                episodeDisplay: this.state.episodeDisplay,
                images: this.state.images,
                intro: this.state.intro,
                originalUrl: this.trim(this.state.originalUrl),
                subTitle: this.state.subTitle,
                title: this.state.title,
                videoBaseId: this.state.videoBaseId,
                videoDetailId: this.state.videoDetailId,
            })
                .then(res => {
                    if (res.code === 0) {
                        success('更新成功!');
                        if ((res.data.duration / 60) + '' !== this.state.duration + '') {
                            message.warn('自有播放源返回的片长不可更改!');
                        }
                        this.fetchBaseVideo();
                        this.fetchSubVideoDetail();
                        this.setState({
                            flag: this.state.flag + 1
                        });
                    } else {
                        message.error(res.errmsg);
                    }
                }).catch(({ res }) => {
                    message.error('更新失败!');
                });
        });
    }
    fetchBaseVideo() {
        yxFetch(REQ_URL.NETS_VIDEO_BASE_INFOS, {
            videoBaseId: this.state.videoBaseId,
            searchFlag: 0,
        })
            .then(res => {
                if (res.code === 0) {
                    this.setState({
                        baseVideo: res.data,
                        title: res.data.name,
                        subTitle: res.data.subName,
                    }, () => {
                        this.judgeStatus();
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchSubVideoDetail(id) {
        let videoDetailId = null;
        if (id) {
            videoDetailId = id;
        } else {
            videoDetailId = this.state.videoDetailId;
        }
        yxFetch(REQ_URL.NETS_VIDEO_DETIAL_INFO, {
            videoDetailId: videoDetailId,
            searchFlag: 0,
        })
            .then(res => {
                if (res.code === 0) {
                    if (res.data.duration) {
                        res.data.duration = parseInt(res.data.duration, 10) / 60;
                    }
                    this.props.form.resetFields(); // 强制更新所有fields的值
                    this.setState({
                        videoDetailId: res.data.videoDetailId,
                        title: res.data.title,
                        subTitle: res.data.subTitle,
                        episode: res.data.episode,
                        episodeDisplay: res.data.episodeDisplay,
                        images: res.data.images,
                        intro: res.data.intro,
                        duration: res.data.duration,
                        originalUrl: res.data.originalUrl,
                        precessingStatus: res.data.precessingStatus
                    }, () => {
                        this.setImgUrls();
                        this.judgePrecessingStatus();
                    });
                } else {
                }
            }).catch(({ res }) => {
                //
            });
    }
    // 上架
    putaway() {
    // if (this.state.flagImg) {
        yxFetch(REQ_URL.PUT_VIDEO_ON_SHELF, {
            videoBaseId: this.state.videoBaseId,
        }).then(res => {
            if (res.code === 0) {
                success('上架成功！');
                this.setState({
                    displayUp: 'none',
                    displayDown: 'inline-block'
                });
                // this.fetchSubVideoDetail()
            } else {
                warning(res.errmsg);
            }
        }).catch((e) => {
        });
    // } else {
    //   warning('首页2:3图片必填!')
    // }
    }
    // 下架
    putoff() {
        yxFetch(REQ_URL.VIDEO_SHORT_PUT, {
            videoBaseId: this.state.videoBaseId,
        }).then(res => {
            if (res.code === 0) {
                success('下架成功！');
                this.setState({
                    displayUp: 'inline-block',
                    displayDown: 'none'
                });
                // this.fetchSubVideoDetail()
            } else {
                warning(res.errmsg);
            }
        }).catch((e) => {
        });
    }
    // 判断转码状态
    judgePrecessingStatus() {
    // console.log(this.state.precessingStatus)
        if (this.state.precessingStatus === 0) {
            this.setState({
                displayYZM: 'inline-block',
                displayZM: 'none',
                displayCLSB: 'none',
                displayZZCL: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 1) {
            this.setState({
                displayZM: 'inline-block',
                displayYZM: 'none',
                displayCLSB: 'none',
                displayZZCL: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 2) {
            this.setState({
                displayZZCL: 'inline-block',
                displayZM: 'none',
                displayYZM: 'none',
                displayCLSB: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 3) {
            this.setState({
                displayCLSB: 'inline-block',
                displayZZCL: 'none',
                displayZM: 'none',
                displayYZM: 'none',
                displayBKZM: 'none'
            });
        }
        if (this.state.precessingStatus === 401) {
            this.setState({
                displayBKZM: 'inline-block',
                displayCLSB: 'none',
                displayZZCL: 'none',
                displayZM: 'none',
                displayYZM: 'none'
            });
        }
    }
    // 转码
    transcoding() {
        yxFetch(REQ_URL.VIDEO_PROCESS, {
            videoDetailId: this.state.videoDetailId,
            originalURL: this.state.originalUrl
        }).then(res => {
            if (res.code === 0) {
                this.fetchSubVideoDetail();
                this.setState({
                    flag: this.state.flag + 1
                });
            } else {
                warning(res.errmsg);
            }
        }).catch((e) => {
        });
    }
    render() {
        let formTitle = null;
        let episodeRow = null;
        let episodeDisplay = null;
        let scale169Img = null;
        if (this.state.baseVideo.bizType === 1) { // 电视剧
            formTitle = <h3> 电视剧 </h3>;
            episodeRow = <InputRow
                id = 'episode'
                label = '当前集数'
                required = { true }
                wrapperCol = { 2 }
                formEle = { Form }
                formMethods = { this.props.form }
                message = '请输入当前集数'
                maxlength = { 20 }
                onChangeHandle = { this.episodeChange }
                initialValue = { this.state.episode }
            />;
            episodeDisplay = <InputRow
                id = 'episodeDisplay'
                label = '显示集数'
                required = { true }
                wrapperCol = { 2 }
                formEle = { Form }
                maxlength = { 20 }
                formMethods = { this.props.form }
                message = '请输入显示集数'
                onChangeHandle = { this.episodeDisplayChange }
                initialValue = { this.state.episodeDisplay }
            />;
            scale169Img = <ImageUpload
                imgScale = { 1 }
                imgScaleText = { '图片比例16:9' }
                showImgUrl = { this.state.imgUrl1 }
                figureWidth = { 200 }
                figureHeight = { 112 }
                uploadDone = { this.uploadDone }
            />;
        } else if (this.state.baseVideo.bizType === 2) { // 综艺
            formTitle = <h3> 综艺 </h3>;
            episodeRow = <InputRow
                id = 'episode'
                label = '当前期数'
                required = { true }
                wrapperCol = { 4 }
                formEle = { Form }
                formMethods = { this.props.form }
                message = '请输入当前期数'
                maxlength = { 20 }
                onChangeHandle = { this.episodeChange }
                initialValue = { this.state.episode }
            />;
            episodeDisplay = <InputRow
                id = 'episodeDisplay'
                wrapperCol = { 4 }
                label = '显示期数'
                required = { true }
                maxlength = { 20 }
                formEle = { Form }
                formMethods = { this.props.form }
                message = '请输入显示期数'
                onChangeHandle = { this.episodeDisplayChange }
                initialValue = { this.state.episodeDisplay }
            />;
            scale169Img = <ImageUpload
                imgScale = { 1 }
                imgScaleText = { '*图片比例16:9' }
                showImgUrl = { this.state.imgUrl1 }
                figureWidth = { 200 }
                figureHeight = { 112 }
                uploadDone = { this.uploadDone }
            />;
        } else { // 单视频
        }
        return (
            <div>
                <div className={style.up}>
                    <Button type='primary' onClick={this.putaway.bind(this)} style = {{ 'display': this.state.displayUp }} className={style.right}>上架</Button>
                    <Button type='primary' onClick={this.putoff.bind(this)} style = {{ 'display': this.state.displayDown }} className={style.right}>下架</Button>
                </div>
                { /* 播放源 */ }
                <SourceCard flagAddSource={this.state.flagAddSource} flag={this.state.flag} update={this.fetchSubVideoDetail.bind(this)} videoBaseId = {this.state.videoBaseId} oldvideoDetailId = {this.state.videoDetailId} />
                { /* 选集 */ }
                <Card className={style.card} bodyStyle={bodyStyle}>
                    <h3>选集</h3>
                    <div className={style['rep-box']}>
                        <div className={style['rep-item']}>播放源有更新：<span className={style['bg-yellow']}></span></div>
                        <div className={style['rep-item']}>新增剧集：<span className={style['bg-red']}></span></div>
                    </div>
                    <div className={style['grid-box']}>
                        {this.state.baseVideo.vVideoDetailRspVos.map((subVideo, index) => (
                            <Link
                                to = {`${urls.VIDEO_LIST}/VideoDetail/${this.state.videoBaseId}/videoSubDetail?videoDetailId=${subVideo.videoDetailId}`}
                                key = { index }
                            >
                                <Grid
                                    value = { subVideo.episodeDisplay }
                                    tag = { subVideo.hasNewSource ? 'yellow' : ''}
                                    disabled = { subVideo.videoDetailId === this.state.videoDetailId}
                                />
                            </Link>
                        ))}
                        {(this.state.baseVideo.vVideoDetailRspVos.length > 0 && this.state.baseVideo.vVideoDetailRspVos.length < this.state.baseVideo.episodes ? <Button type='primary' onClick={this.clearSubDetail}>+ 新增</Button> : '')}
                    </div>
                    <div className={style['grid-box']}>
                        {this.state.baseVideo.newVideoDetails.map((subVideo, index) => (
                            <Link
                                key = { index }
                                to = {`${urls.CRAWLER}/crawlerDetail/${this.state.videoBaseId}/addCrawler?tpVideoId=${subVideo.thirdpartyDetailId}`}
                            >
                                <Grid
                                    value = { subVideo.displayEpisode }
                                    tag = { 'red' }
                                />
                            </Link>
                        ))}
                    </div>
                </Card>
                { /* 剧集 */ }
                <Card className={style.card} bodyStyle={bodyStyle}>
                    { formTitle }
                    <Form className={style.form} onSubmit={this.state.videoDetailId ? this.updateSubDetail : this.addSubDetail}>
                        <InputRow
                            id = 'videoBaseId'
                            label = 'videoBaseId'
                            wrapperCol = { 6 }
                            formEle = { Form }
                            disabled = { true }
                            formMethods = { this.props.form }
                            initialValue = { this.state.videoBaseId }
                        />
                        <InputRow
                            id = 'videoDetailId'
                            label = 'videoDetailId'
                            wrapperCol = { 6 }
                            formEle = { Form }
                            disabled = { true }
                            formMethods = { this.props.form }
                            initialValue = { this.state.videoDetailId }
                        />
                        <InputRow
                            id = 'originalUrl'
                            label = '播放源'
                            wrapperCol = { 16 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入播放源'
                            initialValue = { this.state.originalUrl }
                            onChangeHandle = { this.originalUrlChange }
                        />
                        <InputRow
                            id = 'title'
                            label = '标题'
                            required = { true }
                            maxlength = { 40 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入标题'
                            initialValue = { this.state.title }
                            onChangeHandle = { this.titleChange }
                        />
                        <InputRow
                            id = 'subTitle'
                            label = '二级标题'
                            maxlength = { 40 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入二级标题'
                            initialValue = { this.state.subTitle }
                            onChangeHandle = { this.subTitleChange }
                        />
                        { episodeRow }
                        { episodeDisplay }
                        <InputRow
                            id = 'duration'
                            label = '片长'
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入片长'
                            wrapperCol = { 2 }
                            maxlength = { 10 }
                            onChangeHandle = { this.durationChange }
                            initialValue = { this.state.duration }
                        />
                        <InputRow
                            id = 'intro'
                            label = '简介'
                            maxlength = { 2000 }
                            wrapperCol = { 16 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入简介'
                            autosize = {{ minRows: 6, maxRows: 8 }}
                            type= {'textarea'}
                            onChangeHandle = { this.introChange }
                            initialValue = { this.state.intro }
                        />
                        <div className={style.actions}>
                            <Button type='primary' htmlType='submit'>
                                {(
                                    this.state.videoDetailId ? '更新' : '添加'
                                )}
                            </Button>
                            <Button type='primary' onClick={this.transcoding.bind(this)} style = {{ 'display': this.state.displayZM }} >转码</Button>
                            <Button type='primary' disabled='disabled' style = {{ 'display': this.state.displayYZM }} >已转码</Button>
                            <Button type='disabled' disabled='disabled' style = {{ 'display': this.state.displayBKZM }} >不可转码</Button>
                            <Button type='primary' disabled='disabled' style = {{ 'display': this.state.displayZZCL }} >正在处理</Button>
                            <Button type='danger' style = {{ 'display': this.state.displayCLSB }} >处理失败</Button>
                        </div>
                    </Form>
                    <h3>封面</h3>
                    <div className={style['img-upload-container']}>
                        <ImageUpload
                            imgScale = { 3 }
                            imgScaleText = '图片比例2:3'
                            showImgUrl = { this.state.imgUrl3 }
                            figureWidth = { 200 }
                            figureHeight = { 300 }
                            uploadDone = { this.uploadDone }
                        />
                        { scale169Img }
                        <ImageUpload
                            imgScale = { 2 }
                            imgScaleText = '图片比例4:3'
                            showImgUrl = { this.state.imgUrl2 }
                            figureWidth = { 200 }
                            figureHeight = { 150 }
                            uploadDone = { this.uploadDone }
                        />
                        <ImageUpload
                            imgScale = { 5 }
                            imgScaleText = '图片比例1:1'
                            showImgUrl = { this.state.imgUrl5 }
                            figureWidth = { 200 }
                            figureHeight = { 200 }
                            uploadDone = { this.uploadDone }
                        />
                        <ImageUpload
                            imgScale = { 4 }
                            imgScaleText = '图片比例3:2'
                            showImgUrl = { this.state.imgUrl4 }
                            figureWidth = { 200 }
                            figureHeight = { 133 }
                            uploadDone = { this.uploadDone }
                        />
                    </div>
                </Card>
            </div>
        );
    }
    uploadDone(scale, url) {
        let images = this.state.images;
        images.forEach((image, index, images) => {
            if (image.scale === scale) {
                images.splice(index, 1);
            }
        });
        images.push({
            scale,
            url
        });
        this.setState({
            images
        });
        this.setImgUrls();
    }
    getImage(scale) {
        let images = this.state.images;
        for (let i = 0; i < images.length; i++) {
            if (images[i].scale === scale) {
                return images[i].url;
            }
        }
        return '';
    }
    setImgUrls() {
        this.setState({
            imgUrl1: this.getImage(1),
            imgUrl2: this.getImage(2),
            imgUrl3: this.getImage(3),
            imgUrl4: this.getImage(4),
            imgUrl5: this.getImage(5),
        });
    }
    originalUrlChange(originalUrl) {
        this.setState({
            originalUrl
        });
    }
    titleChange(title) {
        this.setState({
            title
        });
    }
    subTitleChange(subTitle) {
        this.setState({
            subTitle
        });
    }
    episodeChange(episode) {
        this.setState({
            episode
        });
    }
    episodeDisplayChange(episodeDisplay) {
        this.setState({
            episodeDisplay
        });
    }
    durationChange(duration) {
        this.setState({
            duration
        });
    }
    introChange(intro) {
        this.setState({
            intro
        });
    }
}
const SubDetail = Form.create()(SubDetailComponent);
export default SubDetail;
