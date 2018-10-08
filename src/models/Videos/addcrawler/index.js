import React, { Component } from 'react';
import { Card, Form, Button, message } from 'antd';
import style from './style.module.css';
import InputRow from '../../../components/FormRow/InputRow';
import yxFetch from '../../../utils/fetch';
import ImageUpload from '../../../components/Upload';
import getQuery from '../../../utils/url';
import * as urls from '../../../constants/urls';
import { REQ_URL } from '../../../constants/constants';

const bodyStyle = {
    padding: '10px'
};
class AddCrawlerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoBaseId: props.match.match.params.id,
            tpVideoId: getQuery('tpVideoId'),
            bizType: getQuery('bizType'),
            video: {
                name: '',
                subName: '',
                episode: 0,
                displayEpisode: 0,
                duration: 0,
                intro: '',
                images: [],
            },
            imgUrl5: '',
            imgUrl1: '',
            imgUrl2: '',
            imgUrl3: '',
            imgUrl4: '',
        };
        this.nameChange = this.nameChange.bind(this);
        this.subNameChange = this.subNameChange.bind(this);
        this.episodeChange = this.episodeChange.bind(this);
        this.displayEpisodeChange = this.displayEpisodeChange.bind(this);
        this.durationChange = this.durationChange.bind(this);
        this.introChange = this.introChange.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.setImgUrls = this.setImgUrls.bind(this);
        this.approveTpVideo = this.approveTpVideo.bind(this);
        this.removeEmptyImgs = this.removeEmptyImgs.bind(this);
    }
    componentDidMount() {
        this.fetchTpVideoDetail();
    }
    approveTpVideo(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let videoToApprove = this.state.video;
            // add fields that need to be send
            videoToApprove.videoBaseId = this.state.videoBaseId;
            videoToApprove.currentEpisode = videoToApprove.episode;
            videoToApprove.thirdPartyVideoDetailId = videoToApprove.thirdpartyDetailId;
            yxFetch(REQ_URL.APPROVE_THIRDPARDY_DETAIL, videoToApprove)
                .then(res => {
                    if (res.code === 0) {
                        message.success(`第三方视频 ${this.state.video.name} 已成功通过审核!`, 3);
                        this.props.match.history.push(`${urls.VIDEO_LIST}/VideoDetail/${this.state.videoBaseId}/videoSubDetail?videoDetailId=${res.data}`);
                    } else {
                        message.error(res.errmsg, 3);
                    }
                }).catch(res => {
                    message.error(res.errmsg, 3);
                });
        });
    }
    removeEmptyImgs() {
        let video = this.state.video;
        video.images = video.images.filter(function(image, index, images) {
            return image.url;
        });
        this.setState({
            video
        });
    }
    fetchTpVideoDetail() {
        yxFetch(REQ_URL.VIEW_THIRDPARDY_DETAIL, {
            thirdPartyDetailId: this.state.tpVideoId,
        })
            .then(res => {
                if (res.code === 0) {
                    this.setState({
                        video: res.data
                    }, () => {
                        this.removeEmptyImgs();
                        this.setImgUrls();
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    render() {
        let scale169Img = null;
        if (this.state.bizType === '1') { // 电视剧
            scale169Img = <ImageUpload
                imgScale = { 1 }
                imgScaleText = { '图片比例16:9' }
                showImgUrl = { this.state.imgUrl1 }
                figureWidth = { 200 }
                figureHeight = { 112 }
                uploadDone = { this.uploadDone }
            />;
        } else if (this.state.bizType === '2') { // 综艺
            scale169Img = <ImageUpload
                imgScale = { 1 }
                imgScaleText = { '*图片比例16:9' }
                showImgUrl = { this.state.imgUrl1 }
                figureWidth = { 200 }
                figureHeight = { 112 }
                uploadDone = { this.uploadDone }
            />;
        }
        return (
            <Card className={`${style['card']} ${style['clearfix']}`} bodyStyle={bodyStyle}>
                <Form className={style['form']} onSubmit={this.approveTpVideo}>
                    <h3>审核第三方视频</h3>
                    <InputRow
                        disabled = { true }
                        id = 'thirdpartyId'
                        label = 'thirdpartyId'
                        wrapperCol = { 6 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        initialValue = { this.state.video.thirdpartyId }
                    />
                    <InputRow
                        disabled = { true }
                        id = 'thirdpartyDetailId'
                        label = 'thirdpartyDetailId'
                        wrapperCol = { 6 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        initialValue = { this.state.video.thirdpartyDetailId }
                    />
                    <InputRow
                        id = 'name'
                        label = '名称'
                        maxlength = { 40 }
                        required = { true }
                        wrapperCol = { 6 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        initialValue = { this.state.video.name }
                        message = '请输入名称'
                        onChangeHandle = {this.nameChange}
                    />
                    <InputRow
                        id = 'subName'
                        label = '二级标题'
                        wrapperCol = { 6 }
                        maxlength = { 40 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入二级标题'
                        initialValue = { this.state.video.subName }
                        onChangeHandle = {this.subNameChange}
                    />
                    <InputRow
                        id = 'episode'
                        label = '当前集数'
                        maxlength = { 20 }
                        required = { true }
                        wrapperCol = { 4 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入当前集数'
                        onChangeHandle = { this.episodeChange }
                        initialValue = { this.state.video.episode }
                    />
                    <InputRow
                        id = 'displayEpisode'
                        label = '显示集数'
                        required = { true }
                        maxlength = { 20 }
                        wrapperCol = { 4 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入当前显示集数'
                        onChangeHandle = { this.displayEpisodeChange }
                        initialValue = { this.state.video.displayEpisode }
                    />
                    <InputRow
                        id = 'duration'
                        label = '片长'
                        wrapperCol = { 6 }
                        maxlength = { 40 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入片长'
                        initialValue = { this.state.video.duration }
                        onChangeHandle = {this.durationChange}
                    />
                    <InputRow
                        maxlength = { 2000 }
                        id = 'intro'
                        wrapperCol = { 14 }
                        required = { true }
                        label = '简介'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入简介'
                        initialValue = { this.state.video.intro }
                        autosize = {{ minRows: 6, maxRows: 8 }}
                        type= 'textarea'
                        onChangeHandle = { this.introChange }
                    />
                    <div className={style['actions']}>
                        <Button type='primary' htmlType='submit'>审核通过</Button>
                    </div>
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
                </Form>
            </Card>
        );
    }
    nameChange(name) {
        let video = this.state.video;
        video.name = name;
        this.setState({
            video
        });
    }
    subNameChange(subName) {
        let video = this.state.video;
        video.subName = subName;
        this.setState({
            video
        });
    }
    episodeChange(episode) {
        let video = this.state.video;
        video.episode = episode;
        this.setState({
            video
        });
    }
    displayEpisodeChange(displayEpisode) {
        let video = this.state.video;
        video.displayEpisode = displayEpisode;
        this.setState({
            video
        });
    }
    durationChange(duration) {
        let video = this.state.video;
        video.duration = duration;
        this.setState({
            video
        });
    }
    introChange(intro) {
        let video = this.state.video;
        video.intro = intro;
        this.setState({
            video
        });
    }
    uploadDone(scale, url) {
        let video = this.state.video;
        video.images.forEach((image, index, images) => {
            if (image.scale === scale) {
                images.splice(index, 1);
            }
        });
        video.images.push({
            scale,
            url
        });
        this.setState({
            video
        });
        this.setImgUrls();
    }
    getImageUrl(scale) {
        let images = this.state.video.images;
        for (let i = 0; i < images.length; i++) {
            if (images[i].scale === scale) {
                return images[i].url;
            }
        }
        return '';
    }
    setImgUrls() {
        this.setState({
            imgUrl1: this.getImageUrl(1),
            imgUrl2: this.getImageUrl(2),
            imgUrl3: this.getImageUrl(3),
            imgUrl4: this.getImageUrl(4),
            imgUrl5: this.getImageUrl(5),
        });
    }
}
const AddCrawler = Form.create({})(AddCrawlerComponent);
export default AddCrawler;
