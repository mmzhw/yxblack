import React, { Component } from 'react';
import { Row, Col, Form, Card, Input, Radio, Select, DatePicker, message, Button } from 'antd';
import style from './style.module.css';
import _ from 'lodash';
import moment from 'moment';
// import { imgPrefix } from '../../../../../utils/index'
import ImageUpload from '../../../../../components/Upload';
import yxFetch from '../../../../../utils/tvFetch';
import alterBreadItemName from '../../../../../utils/alterBreadItemName';
import * as urls from '../../../../../constants/urls';
import { REQ_URL } from '../../../../../constants/constants';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const bodyStyle = {
    marginTop: '10px',
    padding: '10px',
};
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thirdPartyBaseId: props.match.match.params.id, // 视频id
            videoModel: 0,
            videoUrl: '', // 七牛视频地址
            name: '',
            subName: '',
            foreignName: '',
            aliasName: '',
            director: '',
            actor: '',
            episodes: '',
            releaseTime: moment(),
            duration: '',
            intro: '',
            categories: [],
            types: '',
            regions: [],
            years: [],
            languages: [],
            images: [],
            videoBasicInfo: {}, // 视频基本信息
            imgUrl1: '', // 16:9
            imgUrl2: '', // 4:3
            imgUrl3: '', // 2:3
            imgUrl4: '', // 3:2
            imgUrl5: '', // 1:1
            imgUrl7: '', // 大图
            videoBaseId: '',
            videoDetailId: '',
            loading: false,
            videoUrlDisabled: null,
        };
        this.fetchVideoDetail = this.fetchVideoDetail.bind(this);
        this.onvideoPropertyChange = this.onvideoPropertyChange.bind(this);
        this.videoUrlChange = this.videoUrlChange.bind(this);
        this.subNameChange = this.subNameChange.bind(this);
        this.foreignNameChange = this.foreignNameChange.bind(this);
        this.aliasNameChange = this.aliasNameChange.bind(this);
        this.directorChange = this.directorChange.bind(this);
        this.actorChange = this.actorChange.bind(this);
        this.languageChange = this.languageChange.bind(this);
        this.releaseTimeChange = this.releaseTimeChange.bind(this);
        this.durationChange = this.durationChange.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.fetchVideoDetail = this.fetchVideoDetail.bind(this);
    }
    componentDidMount() {
        this.fetchVideoDetail()
            .then(() => {
                let name = this.state.videoBasicInfo.name;
                alterBreadItemName(name);
            });
    }
    // 拿到对应视频的基本信息
    fetchVideoDetail() {
        return yxFetch('/back/thirdParty/view/thirdPartyVideoBase', {
            thirdPartyId: this.state.thirdPartyBaseId,
        }).then(res => {
            if (res.code === 0) {
                // if (res.data.releaseTime) {
                if (res.data.videoModel !== 0) {
                    this.setState({
                        videoBasicInfo: res.data,
                        videoUrlDisabled: true,
                    });
                } else {
                    this.setState({
                        videoBasicInfo: res.data,
                        videoUrlDisabled: false,
                    });
                }
                // }
                this.setImgUrls();
            } else {
                message.error(res.errmsg);
            }
        });
    }
    // 视频属性改变
    onvideoPropertyChange(e) {
        let videoUrlDisabled;
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.videoModel = e.target.value;
        if (e.target.value !== 0) {
            videoUrlDisabled = true;
        } else {
            videoUrlDisabled = false;
        }
        this.setState({
            videoBasicInfo: videoBasicInfo,
            videoModel: e.target.value,
            videoUrlDisabled,
        }, () => {
        });
    }
    // 地址变化
    videoUrlChange(e) {
        this.setState({
            videoUrl: e.target.value.trim()
        }, () => {
        });
    }
    // 二级标题改变
    subNameChange(e) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.subName = e.target.value;
        this.setState({
            videoBasicInfo: videoBasicInfo,
            subName: e.target.value.trim(),
        }, () => {
        });
    }
    // 外文名变化
    foreignNameChange(e) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.foreignName = e.target.value;
        this.setState({
            videoBasicInfo: videoBasicInfo,
            foreignName: e.target.value.trim(),
        }, () => {
        });
    }
    // 别名变化
    aliasNameChange(e) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.aliasName = e.target.value;
        this.setState({
            videoBasicInfo: videoBasicInfo,
            aliasName: e.target.value.trim(),
        }, () => {
        });
    }
    // 导演变化
    directorChange(e) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.director = e.target.value;
        this.setState({
            videoBasicInfo: videoBasicInfo,
            director: e.target.value.trim(),
        }, () => {
        });
    }
    // 演员变化
    actorChange(e) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.actor = e.target.value;
        this.setState({
            videoBasicInfo: videoBasicInfo,
            actor: e.target.value.trim(),
        }, () => {
        });
    }
    // 语言变化
    languageChange(language) {
        this.setState({
            languages: [+language],
        }, () => {
        });
    }
    // 发行时间变化
    releaseTimeChange(time) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.releaseTime = moment(time).format('YYYY-MM-DD');
        this.setState({
            videoBasicInfo: videoBasicInfo,
            releaseTime: moment(time).format('YYYY-MM-DD'),
        }, () => {
        });
    }
    // 片长变化
    durationChange(e) {
        let videoBasicInfo = this.state.videoBasicInfo;
        videoBasicInfo.duration = e.target.value;
        this.setState({
            videoBasicInfo: videoBasicInfo,
            duration: e.target.value.trim(),
        }, () => {
        });
    }
    getImageUrl(scale) {
        let imageObj, url;
        let images = this.state.images;
        let target = this.state.videoBasicInfo.images.find(item => item.scale === scale);
        target ? imageObj = target : imageObj = {};
        if (imageObj.url) {
            // url = imgPrefix + imageObj.url
            url = imageObj.url;
            images.push({
                name: imageObj.name,
                scale,
                url,
            });
            return url;
        } else {
            return '';
        }
    }
    setImgUrls() {
        this.setState({
            imgUrl1: this.getImageUrl(1),
            imgUrl2: this.getImageUrl(2),
            imgUrl3: this.getImageUrl(3),
            imgUrl4: this.getImageUrl(4),
            imgUrl5: this.getImageUrl(5),
        }, () => {
        });
    }
    uploadDone(scale, url) {
        let imgUrl = 'imgUrl' + scale;
        let images = this.state.images;
        images.push({
            name: url.substr(0, url.indexOf('.')),
            scale,
            url,
        });
        this.setState({
            images,
            [imgUrl]: url
        }, () => { });
    }
    reviewPass(e) {
        e.preventDefault();
        let history = this.props.match.history;
        // if (!this.state.imgUrl3) {
        //   return message.error('2:3图片必填')
        // }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let state = this.state;
                let videoToUpdate = {
                    thirdPartyVideoBaseId: state.thirdPartyBaseId, // 视频id
                    videoModel: state.videoBasicInfo.videoModel,
                    videoUrl: state.videoUrl, // 七牛视频地址
                    name: values.name,
                    subName: state.subName,
                    foreignName: state.foreignName,
                    aliasName: state.videoBasicInfo.aliasName,
                    director: state.director,
                    actor: state.actor,
                    episodes: values.episodes,
                    releaseTime: moment(state.releaseTime).format('YYYY-MM-DD'),
                    duration: state.videoBasicInfo.duration,
                    intro: values.intro,
                    categories: [+values.category],
                    types: [+values.type],
                    regions: [+values.region],
                    years: [+values.year],
                    languages: state.languages,
                    images: state.images,
                };
                // 接口标准
                // let temp = {
                //   actor: 'asd',
                //   aliasName: '吉他考试必备指南',
                //   categories: [10],
                //   director: 'sadd',
                //   duration: '123',
                //   episodes: '4',
                //   foreignName: 'asdad',
                //   images: [],
                //   intro: '吉他自学入门教程_成考教材',
                //   languages: [],
                //   name: '吉他成考考前攻略',
                //   regions: [19],
                //   releaseTime: '2015-08-26',
                //   subName: 'asdsad',
                //   thirdPartyVideoBaseId: '138059',
                //   types: [17],
                //   videoModel: 2,
                //   years: [108],
                // }
                this.setState({
                    loading: true,
                });
                yxFetch(REQ_URL.APPROVE_VIEW_THIRDPARDY_BASE, videoToUpdate)
                    .then(res => {
                        if (res.code === 0) {
                            this.setState({
                                videoBaseId: res.data.videoBaseId,
                                videoDetailId: res.data.videoDetailId,
                            });
                            yxFetch(REQ_URL.NETS_VIDEO_BASE_INFOS, {
                                videoBaseId: this.state.videoBaseId,
                                videoDetailId: this.state.videoDetailId,
                            }).then(res => {
                                this.setState({
                                    loading: false,
                                });
                                if (res.code === 0) {
                                    message.success('视频审核成功！');
                                    // res.data.categories 种类，1-单视频 2-剧集 res.data.bizType 剧集子类型，1-电视剧 2-综艺
                                    const path = `${urls.VIDEO_LIST}/VideoDetail/ + ${this.state.videoBaseId}`;
                                    history.push(path);
                                } else {
                                    message.error(res.errmsg || '审核错误!');
                                }
                            });
                        } else {
                            message.error(res.errmsg || '审核错误!');
                            this.setState({
                                loading: false,
                            });
                        }
                    });
            } else {}
        });
    }
    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 14
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card bodyStyle={bodyStyle} className={ style.wrap }>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayout}
                                    label='视频属性'
                                >
                                    <RadioGroup
                                        onChange={ this.onvideoPropertyChange.bind(this) }
                                        value={ this.state.videoBasicInfo.videoModel }>
                                        <Radio value={ 0 }>视频</Radio>
                                        <Radio value={ 1 }>剧集</Radio>
                                        <Radio value={ 2 }>综艺</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <p style={{ margin: 40 }}>
                  基础信息
                                </p>
                                <FormItem
                                    {...formItemLayout}
                                    label='七牛地址'
                                >
                                    <Input
                                        onChange={this.videoUrlChange.bind(this)}
                                        value={this.state.videoUrl}
                                        disabled={ this.state.videoUrlDisabled }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='中文名'
                                    hasFeedback
                                >
                                    {getFieldDecorator('name', {
                                        initialValue: this.state.videoBasicInfo.name,
                                        rules: [{
                                            required: true, type: 'string', message: '请输入中文名！',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='二级标题'
                                >
                                    <Input
                                        onChange={ this.subNameChange.bind(this) }
                                        value={ this.state.videoBasicInfo.subName }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='外文名'
                                >
                                    <Input
                                        onChange={ this.foreignNameChange.bind(this) }
                                        value={ this.state.videoBasicInfo.foreignName }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='别名'
                                >
                                    <Input
                                        onChange={ this.aliasNameChange.bind(this) }
                                        value={ this.state.videoBasicInfo.aliasName }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='分类'
                                    hasFeedback
                                >
                                    { getFieldDecorator('category', {
                                        rules: [{ required: true, message: '请选择分类！' }],
                                    })(
                                        <Select
                                            showSearch
                                        >
                                            {
                                                _.map(this.state.videoBasicInfo.category, (name, id) => {
                                                    return <Option value={id} key={'category' + id}>{name}</Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='类型'
                                    hasFeedback
                                >
                                    { getFieldDecorator('type', {
                                        rules: [{ required: true, message: '请输入类型！' }],
                                    })(
                                        <Select
                                            showSearch
                                        >
                                            {
                                                _.map(this.state.videoBasicInfo.type, (name, id) => {
                                                    return <Option value={id} key={'type' + id}>{name}</Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='地区'
                                    hasFeedback
                                >
                                    { getFieldDecorator('region', {
                                        rules: [{ required: true, message: '请选择地区' }],
                                    })(
                                        <Select
                                            showSearch
                                        >
                                            {
                                                _.map(this.state.videoBasicInfo.region, (name, id) => {
                                                    return <Option value={id} key={'region' + id}>{name}</Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='年代'
                                    hasFeedback
                                >
                                    { getFieldDecorator('year', {
                                        rules: [{ required: true, message: '请选择年代' }],
                                    })(
                                        <Select
                                            showSearch
                                        >
                                            {
                                                _.map(this.state.videoBasicInfo.year, (name, id) => {
                                                    return <Option value={id} key={'year' + id}>{name}</Option>;
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='导演'
                                    hasFeedback
                                >
                                    <Input
                                        value={this.state.videoBasicInfo.director}
                                        onChange={ this.directorChange.bind(this) }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='主演'
                                    hasFeedback
                                >
                                    <Input
                                        value={this.state.videoBasicInfo.actor}
                                        onChange={ this.actorChange.bind(this) }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='语言'
                                >
                                    <Select
                                        showSearch
                                        onChange={this.languageChange.bind(this)}
                                    >
                                        {
                                            _.map(this.state.videoBasicInfo.language, (name, id) => {
                                                return <Option value={id} key={'language' + id}>{name}</Option>;
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='发行时间'
                                >
                                    <DatePicker
                                        onChange={ this.releaseTimeChange }
                                        defaultValue={this.state.releaseTime}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='片长(秒)'
                                >
                                    <Input
                                        onChange={ this.durationChange.bind(this) }
                                        value={ this.state.videoBasicInfo.duration }
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='集数/期数'
                                    hasFeedback
                                >
                                    {getFieldDecorator('episodes', {
                                        initialValue: this.state.videoBasicInfo.episodes,
                                        rules: [{
                                            required: true, message: '请输入集数/期数',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label='简介'
                                    hasFeedback
                                >
                                    {getFieldDecorator('intro', {
                                        initialValue: this.state.videoBasicInfo.intro,
                                        rules: [{
                                            required: true, message: '请输入简介',
                                        }],
                                    })(
                                        <Input
                                            autosize = {{ minRows: 6, maxRows: 8 }}
                                            type= 'textarea'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <div className={style['crawkers-data']} >
                                    <h2 className={style['title']}>爬虫数据</h2>
                                    <p>
                                        <span className={style['subtitle']}>分类：</span>
                                        <span>{ this.state.videoBasicInfo.tCategory }</span>
                                    </p>
                                    <p>
                                        <span className={style['subtitle']}>类型：</span>
                                        <span>{ this.state.videoBasicInfo.tType }</span>
                                    </p>
                                    <p>
                                        <span className={style['subtitle']}>地区：</span>
                                        <span>{ this.state.videoBasicInfo.tRegion }</span>
                                    </p>
                                    <p>
                                        <span className={style['subtitle']}>年代：</span>
                                        <span>{ this.state.videoBasicInfo.tYear }</span>
                                    </p>
                                    <p>
                                        <span className={style['subtitle']}>语言：</span>
                                        <span>{ this.state.videoBasicInfo.tLanguage }</span>
                                    </p>
                                </div>
                            </Col>
                            <Col span={6} style={{ paddingLeft: 55 }}>
                                <FormItem>
                                    <Button
                                        onClick={this.reviewPass.bind(this)}
                                        type='primary'
                                        htmlType='submit'
                                        size='large'
                                        loading={this.state.loading}
                                    >
                    审核通过
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <div>
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
                                <ImageUpload
                                    imgScale = { 1 }
                                    imgScaleText = '图片比例16:9'
                                    showImgUrl = { this.state.imgUrl1 }
                                    figureWidth = { 200 }
                                    figureHeight = { 112 }
                                    uploadDone = { this.uploadDone }
                                />
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
                                <ImageUpload
                                    imgScale = { 7 }
                                    imgScaleText = '大图'
                                    showImgUrl = { this.state.imgUrl7 }
                                    figureWidth = { 200 }
                                    figureHeight = { 133 }
                                    uploadDone = { this.uploadDone }
                                />
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default Form.create()(Detail);
