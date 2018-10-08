import React, { Component } from 'react';
import { Card, Button, Form, message, Rate } from 'antd';
import style from './style.module.css';
import InputRow from '../../../components/FormRow/InputRow';
import DPRow from '../../../components/FormRow/DPRow';
import SelRow from '../../../components/FormRow/SelRow';
import RadioRow from '../../../components/FormRow/RadioRow';
import yxFetch from '../../../utils/fetch';
import getQuery from '../../../utils/url';
import ImageUpload from '../../../components/Upload';
import * as urls from '../../../constants/urls';
import { REQ_URL } from '../../../constants/constants';
import SingleSelRow from '../../../components/FormRow/SingleSelRow';

const bodyStyle = {
    padding: '10px'
};
const FormItem = Form.Item;

class AddComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classifyList: [],
            areaList: [],
            yearList: [],
            typeList: [],
            labelGroupList: [],
            clarityMap: {
                '': '无',
                '1080P': '1080P'
            },
            signMap: {
                '': '无',
                '独播': '独播',
                '自制': '自制',
                'HOT': 'HOT',
                '首播': '首播',
                '活动': '活动',
                '专题': '专题',
                '预告': '预告',
                '花絮': '花絮',
                '推广': '推广',
                '直播': '直播',
                '回放': '回放',
            },
            video: {
                name: '',
                subName: '',
                foreignName: '',
                anotherName: '',
                director: '',
                images: [],
                actor: '',
                labels: [],
                releaseAt: new Date().getTime(),
                categories: getQuery('categories') ? getQuery('categories') : 1,
                bizType: getQuery('bizType') ? getQuery('bizType') : 0,
                episodes: 0,
                labelIds: [],
                cmsDuration: '',
                intro: '',
                extMap: {
                    clarity: '',
                    sign: '',
                },
                classificationIds: [],
                typeIds: [],
                areaIds: [],
                yearIds: [],
                originalUrl: '',
                keyword: '',
            },
            imgUrl5: '', // 1:1
            imgUrl1: '', // 16:9
            imgUrl2: '', // 4:3
            imgUrl3: '', // 2:3
            imgUrl4: '', // 3:2
        };

        this.nameChange = this.nameChange.bind(this);
        this.subNameChange = this.subNameChange.bind(this);
        this.foreignNameChange = this.foreignNameChange.bind(this);
        this.anotherNameChange = this.anotherNameChange.bind(this);
        this.directorChange = this.directorChange.bind(this);
        this.actorChange = this.actorChange.bind(this);
        this.episodesChange = this.episodesChange.bind(this);
        this.cmsDurationChange = this.cmsDurationChange.bind(this);
        this.introChange = this.introChange.bind(this);
        this.classifyListChange = this.classifyListChange.bind(this);
        this.areaListChange = this.areaListChange.bind(this);
        this.yearListChange = this.yearListChange.bind(this);
        this.typeListChange = this.typeListChange.bind(this);
        this.clarityChange = this.clarityChange.bind(this);
        this.cornerMarkChange = this.cornerMarkChange.bind(this);
        this.originalUrlChange = this.originalUrlChange.bind(this);
        this.keywordChange = this.keywordChange.bind(this);
        this.addVideo = this.addVideo.bind(this);
        this.getImage = this.getImage.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.trim = this.trim.bind(this);
        this.labelIdsChange = this.labelIdsChange.bind(this);
        this.hasSpecifiedScale = this.hasSpecifiedScale.bind(this);
        this.firstCateChange = this.firstCateChange.bind(this);
    }
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }
    componentDidMount() {
        this.fetchClassifyList();
        this.fetchAreaList();
        this.fetchYearList();
        this.fetchTypeList();
        this.fetchLabelGroupList();
        this.fetchFirstCategory();
    }
    fetchFirstCategory() {
        yxFetch(REQ_URL.OTT_FIRST_CATEGORY, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        firstCategorys: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
            //
            });
    }
    fetchSecondCategory(topId) {
        yxFetch(REQ_URL.OTT_SECOND_CATEGORY, { topId: topId })
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];

                    res.data.forEach((element) => {
                        enabledList.push(element);
                    });

                    this.setState({
                        secondCategorys: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
            //
            });
    }
    firstCateChange(firstCate) {
        this.fetchSecondCategory(firstCate);
    }
    fetchLabelGroupList() {
        yxFetch(REQ_URL.GROUP_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    this.setState({
                        labelGroupList: res.data
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchYearList() { // set enabled yearList
        yxFetch(REQ_URL.YEAR_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        yearList: enabledList
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchClassifyList() { // set enabled classifyList
        yxFetch(REQ_URL.CLASS_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        classifyList: enabledList
                    });
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchAreaList() { // set enabled areaList
        yxFetch(REQ_URL.AREA_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        areaList: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
                //
            });
    }
    fetchTypeList() { // set enabled typeList
        yxFetch(REQ_URL.TYPE_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    let enabledList = [];
                    let len = res.data.length;
                    for (let i = 0; i < len; i++) {
                        if (res.data[i].enable === 1) {
                            enabledList.push(res.data[i]);
                        }
                    }
                    this.setState({
                        typeList: enabledList
                    });
                } else {
                }
            }).catch(({ res }) => {
                //
            });
    }
    hasSpecifiedScale(images, scale) {
        if (!images || images.length === 0) return false;
        return images.some((image, index) => image.scale === scale);
    }
    addVideo(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let video = this.state.video;
            if (video.categories !== '2') { // 单视频
                video.originalUrl = this.trim(video.originalUrl);
            }
            // if (!this.hasSpecifiedScale(video.images, 1)) {
            //   message.warn('请上传16:9的图片')
            //   return
            // }
            if (video.cmsDuration) { // 转换为秒上传
                video.cmsDuration = parseInt(video.cmsDuration, 10) * 60;
            }

            video.licence = values.licence;
            video.firstCategory = values.firstCategory;
            video.secondCategory = values.secondCategory;
            video.score = Number(values.score);
            video.releaseAt = Number(values.releaseAt.format('x'));
            video.copyrightStart = Number(values.copyrightStart ? values.copyrightStart.format('x') : '');
            video.copyrightEnd = Number(values.copyrightEnd ? values.copyrightEnd.format('x') : '');

            yxFetch(REQ_URL.ADD_VIDEO_BASE_INFO, video)
                .then(res => {
                    if (res.code === 0) {
                        if (this.state.video.categories === '2' && this.state.video.bizType === '1') {
                            message.success(`电视剧 ${this.state.video.name} 已成功添加`);
                        } else if (this.state.video.categories === '2' && this.state.video.bizType === '2') {
                            message.success(`综艺 ${this.state.video.name} 已成功添加`);
                        } else {
                            message.success(`单视频 ${this.state.video.name} 已成功添加`);
                        }
                        this.props.match.history.push(`${urls.VIDEO_LIST}/videoDetail/${res.data.videoBaseId}`);
                    } else {
                        message.error(res.errmsg);
                    }
                }).catch(({ res }) => {
                    message.error(`视频添加失败`);
                });
        });
    }
    render() {
        let formTitle = null; // form的标题
        let episodesRow = null; // 期数、集数、‘’
        if (this.state.video.bizType === '1') { // 电视剧
            formTitle = <h3>添加电视剧基本信息</h3>;
            episodesRow = <InputRow
                id = 'episodes'
                required = { false }
                maxlength = { 10 }
                label = '集数'
                initialValue = { this.state.video.episodes }
                wrapperCol = { 2 }
                formEle = { Form }
                formMethods = { this.props.form }
                message = '请输入集数'
                onChangeHandle = { this.episodesChange }
            />;
        } else if (this.state.video.bizType === '2') { // 综艺
            formTitle = <h3>添加综艺基本信息</h3>;
            episodesRow = <InputRow
                id = 'episodes'
                required = { false }
                label = '期数'
                maxlength = { 10 }
                initialValue = { this.state.video.episodes }
                wrapperCol = { 2 }
                formEle = { Form }
                formMethods = { this.props.form }
                message = '请输入期数'
                onChangeHandle = { this.episodesChange }
            />;
        } else { // 单视频
            formTitle = <h3>添加单视频</h3>;
        }

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 6 },
        };

        const { getFieldDecorator } = this.props.form;

        return (
            <Card className={`${style['card']} ${style['clearfix']}`} bodyStyle={bodyStyle}>
                <Form className={style['form']} onSubmit={this.addVideo}>
                    { formTitle }
                    {(
                        this.state.video.categories !== '2' ? <InputRow
                            id = 'originalUrl'
                            label = '视频源'
                            wrapperCol = { 12 }
                            formEle = { Form }
                            formMethods = { this.props.form }
                            message = '请输入视频源'
                            onChangeHandle = {this.originalUrlChange}
                            initialValue = {this.state.video.originalUrl}
                        /> : ''
                    )}
                    <InputRow
                        id = 'name'
                        label = '名称'
                        wrapperCol = { 6 }
                        required = { true }
                        formEle = { Form }
                        maxlength = { 40 }
                        formMethods = { this.props.form }
                        message = '请输入名称'
                        onChangeHandle = {this.nameChange}
                        initialValue = {this.state.video.name}
                    />
                    <FormItem
                        {...formItemLayout}
                        label='评分'>
                        {getFieldDecorator('score', {
                            initialValue: this.state.video.score || 0
                        })(
                            <Rate allowHalf count={10} />
                        )}
                    </FormItem>
                    <InputRow
                        id = 'subName'
                        label = '二级标题'
                        required = { false }
                        maxlength = { 40 }
                        wrapperCol = { 6 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入二级标题'
                        onChangeHandle = {this.subNameChange}
                        initialValue = {this.state.video.subName}
                    />
                    <InputRow
                        id = 'foreignName'
                        label = '外文片名'
                        required = { false }
                        wrapperCol = { 6 }
                        maxlength = { 100 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入外文片名'
                        onChangeHandle = {this.foreignNameChange}
                        initialValue = {this.state.video.foreignName}
                    />
                    <InputRow
                        id = 'anotherName'
                        label = '别名'
                        required = { false }
                        formEle = { Form }
                        wrapperCol = { 6 }
                        maxlength = { 100 }
                        formMethods = { this.props.form }
                        message = '请输入别名'
                        onChangeHandle = {this.anotherNameChange}
                        initialValue = {this.state.video.anotherName}
                    />
                    <InputRow
                        id = 'director'
                        label = '导演'
                        required = { false }
                        formEle = { Form }
                        wrapperCol = { 6 }
                        maxlength = { 100 }
                        formMethods = { this.props.form }
                        message = '请输入导演'
                        onChangeHandle = { this.directorChange }
                        initialValue = {this.state.video.director}
                    />
                    <InputRow
                        id = 'actor'
                        label = '主演'
                        required = { false }
                        wrapperCol = { 10 }
                        maxlength = { 200 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入主演'
                        onChangeHandle = { this.actorChange }
                        initialValue = {this.state.video.actor}
                    />
                    <DPRow
                        id = 'releaseAt'
                        label = '发行时间'
                        required = { false }
                        wrapperCol = { 4 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入发行时间'
                        initialValue = { this.state.video.releaseAt }
                    />
                    <InputRow
                        id = 'licence'
                        required = { false }
                        label = 'licence'
                        wrapperCol = { 4 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入licence'
                        initialValue = { this.state.video.licence }
                    />
                    <DPRow
                        id = 'copyrightStart'
                        required = { false }
                        label = '版权开始时间'
                        wrapperCol = { 4 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        initialValue = { this.state.video.copyrightStart }
                        message = '请输入版权开始时间'
                    />
                    <DPRow
                        id = 'copyrightEnd'
                        required = { false }
                        label = '版权结束时间'
                        wrapperCol = { 4 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        initialValue = { this.state.video.copyrightEnd }
                        message = '请输入版权结束时间'
                    />
                    { episodesRow }
                    <SingleSelRow
                        id = 'firstCategory'
                        label = 'OTT一级分类'
                        required = { false }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请添加分类'
                        initialValue = { this.state.video.firstCategory }
                        selList = { this.state.firstCategorys }
                        optVal = 'topId'
                        optLabel = 'name'
                        onChange = { this.firstCateChange }
                    />
                    <SingleSelRow
                        id = 'secondCategory'
                        label = 'OTT二级分类'
                        required = { false }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请添加分类'
                        initialValue = { this.state.video.secondCategory }
                        selList = { this.state.secondCategorys }
                        optVal = 'filmType'
                        optLabel = 'name'
                    />
                    <SelRow
                        id = 'classifyList'
                        mode = 'multiple'
                        required = { true }
                        label = '分类'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请分类分类'
                        selList = { this.state.classifyList }
                        optVal = 'id'
                        optLabel = 'name'
                        onChange = { this.classifyListChange }
                    />
                    <SelRow
                        id = 'areaList'
                        mode = 'multiple'
                        required = { false }
                        label = '地区'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        selList = { this.state.areaList }
                        optVal = 'id'
                        optLabel = 'name'
                        message = '请选择地区'
                        onChange = { this.areaListChange }
                    />
                    <SelRow
                        id = 'yearList'
                        mode = 'multiple'
                        required = { false }
                        label = '年代'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        selList = { this.state.yearList }
                        optVal = 'id'
                        optLabel = 'name'
                        message = '请选择年代'
                        onChange = { this.yearListChange }
                    />
                    <SelRow
                        id = 'typeList'
                        mode = 'multiple'
                        required = { true }
                        label = '类型'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请选择类型'
                        selList = { this.state.typeList }
                        optVal = 'id'
                        optLabel = 'name'
                        onChange = { this.typeListChange }
                    />
                    <InputRow
                        id = 'keyword'
                        label = '关键词'
                        maxlength = { 30 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入关键词'
                        onChangeHandle = { this.keywordChange }
                        initialValue = { this.state.video.keyword }
                    />
                    <InputRow
                        id = 'cmsDuration'
                        label = '配置时长'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        maxlength = { 10 }
                        message = '请输入配置时长'
                        onChangeHandle = { this.cmsDurationChange }
                        initialValue = { this.state.video.cmsDuration }
                    />
                    <RadioRow
                        id = 'clarity'
                        radioMap = { this.state.clarityMap }
                        initialValue = { this.state.video.extMap.clarity }
                        label = '清晰度'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        wrapperCol = { 6 }
                        onChange = { this.clarityChange }
                    />
                    <RadioRow
                        id = 'cornerMark'
                        label = '标记'
                        formEle = { Form }
                        formMethods = { this.props.form }
                        radioMap = { this.state.signMap }
                        initialValue = { this.state.video.extMap.sign }
                        onChange = { this.cornerMarkChange }
                        wrapperCol = { 14 }
                    />
                    <InputRow
                        id = 'intro'
                        label = '简介'
                        wrapperCol = { 14 }
                        required = { false }
                        maxlength = { 2000 }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        message = '请输入简介'
                        autosize = {{ minRows: 6, maxRows: 8 }}
                        type= 'textarea'
                        onChangeHandle = { this.introChange }
                        initialValue = { this.state.video.intro }
                    />
                    <div className={style['actions']}>
                        <Button type='primary' htmlType='submit'>添加</Button>
                    </div>
                    <h3>标签</h3>
                    {this.state.labelGroupList.filter(function(labelGroup, index) {
                        return labelGroup.enable === 1;
                    }).map((labelGroup, index) => (
                        <SelRow
                            key = { index }
                            initialValue = { this.getLabelGroupValue(labelGroup.id) }
                            id = { 'labelGroup' + labelGroup.id }
                            mode = 'multiple'
                            label = { labelGroup.groupName}
                            formEle = { Form }
                            formMethods = { this.props.form }
                            selList = { labelGroup.labels }
                            optVal = 'id'
                            optLabel = 'labelName'
                            onChange = { (labelIds) => { this.labelIdsChange(labelIds, labelGroup); } }
                        />
                    ))}
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
                    </div>
                </Form>
            </Card>
        );
    }
    getLabelGroupValue(labelGroupId) {
        let labels = this.state.video.labels;
        let crtLabelGroup = labels[labelGroupId];
        let ids = [];
        if (!crtLabelGroup) return [];
        for (let i = 0; i < crtLabelGroup.length; i++) {
            ids.push(crtLabelGroup[i].id + '');
        }
        return ids;
    }
    labelIdsChange(labelIds, labelGroup) {
        let video = this.state.video;
        for (let i = 0; i < labelGroup.labels.length; i++) {
            let idToRemove = labelGroup.labels[i].id + '';
            if (video.labelIds.indexOf(idToRemove) > -1) {
                video.labelIds.splice(video.labelIds.indexOf(idToRemove), 1);
            }
        }

        for (let i = 0; i < labelIds.length; i++) {
            if (video.labelIds.indexOf(labelIds[i]) === -1) {
                video.labelIds.push(labelIds[i]);
            }
        }
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
    getImage(scale) {
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
            imgUrl1: this.getImage(1),
            imgUrl2: this.getImage(2),
            imgUrl3: this.getImage(3),
            imgUrl4: this.getImage(4),
            imgUrl5: this.getImage(5),
        });
    }
    originalUrlChange(originalUrl) {
        let video = this.state.video;
        video.originalUrl = originalUrl;
        this.setState({
            video
        });
    }
    classifyListChange(classificationIds) {
        let video = this.state.video;
        video.classificationIds = classificationIds;
        this.setState({
            video
        });
    }
    areaListChange(areaIds) {
        let video = this.state.video;
        video.areaIds = areaIds;
        this.setState({
            areaIds
        });
    }
    yearListChange(yearIds) {
        let video = this.state.video;
        video.yearIds = yearIds;
        this.setState({
            video
        });
    }
    typeListChange(typeIds) {
        let video = this.state.video;
        video.typeIds = typeIds;
        this.setState({
            video
        });
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
    foreignNameChange(foreignName) {
        let video = this.state.video;
        video.foreignName = foreignName;
        this.setState({
            video
        });
    }
    anotherNameChange(anotherName) {
        let video = this.state.video;
        video.anotherName = anotherName;
        this.setState({
            video
        });
    }
    directorChange(director) {
        let video = this.state.video;
        video.director = director;
        this.setState({
            video
        });
    }
    actorChange(actor) {
        let video = this.state.video;
        video.actor = actor;
        this.setState({
            video
        });
    }
    episodesChange(episodes) {
        let video = this.state.video;
        video.episodes = episodes;
        this.setState({
            video
        });
    }
    keywordChange(keyword) {
        let video = this.state.video;
        video.keyword = keyword;
        this.setState({
            video
        });
    }
    cmsDurationChange(cmsDuration) {
        let video = this.state.video;
        video.cmsDuration = cmsDuration;
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
    clarityChange(clarity) {
        let video = this.state.video;
        video.extMap.clarity = clarity;
        this.setState({
            video
        });
    }
    cornerMarkChange(cornerMark) {
        let video = this.state.video;
        video.extMap.sign = cornerMark;
        this.setState({
            video
        });
    }
}
const Add = Form.create()(AddComponent);
export default Add;
