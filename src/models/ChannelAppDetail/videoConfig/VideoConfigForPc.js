import React, { Component } from 'react';
import { Form, Input, Button, AutoComplete, Icon, message, DatePicker } from 'antd';
import fetcher from '../../../utils/fetch';
import Upload from '../../../components/Upload/index.js';
import style from './videoConfigForPc.module.css';
import debounce from '../../../utils/debounce.js';
import moment from 'moment';
import { imgPrefix } from '../../../utils';
import { REQ_URL } from '../../../constants/constants';

const FormItem = Form.Item;
const Option = AutoComplete.Option;

class VideoConfigForPc extends Component {
    state = {
        imgPrefix,
        imageUrl: '',
        imageKey: '',
        source: [],
        search: '',
        videoBaseId: this.props.videoBaseId,
        activityTime: moment(this.props.activityTime),
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                // debugger
                let imageId;
                const { imageUrl, videoBaseId } = this.state;
                if (imageUrl) { // 如果有，说明自己又添加了
                    imageId = await this.getImageId(imageUrl);
                } else {
                    imageId = this.props.imageId;
                }

                values.imageId = imageId;
                values.videoBaseId = videoBaseId;
                values.activityTime = Date.parse(values.activityTime);
                delete values.imageUrl;
                await this.props.onSubmit(values);
                this.props.form.resetFields();
                this.setState({
                    imageUrl: '',
                    search: '',
                    // videoBaseId: '',
                    imageKey: '',
                });
            }
        });
    }

    changeTime(activityTime) {
        this.props.form.setFieldsValue({ 'activityTime': Date.parse(activityTime) });
    }

    // 获取图片 id
    getImageId = async (imageUrl) => {
        try {
            const res = await fetcher(REQ_URL.ADD_IMG, {
                scale: this.props.scale || 1,
                url: imageUrl
            });
            let imageId = '';
            if (res.code === 0) {
                imageId = res.data.id;
                return imageId;
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e);
        }
    }

    uploadDone = async (imgScale, key) => {
        // const imageUrl = `${imgPrefix}${key}`
        this.props.form.setFieldsValue({
            imageUrl: key,
        });
        this.setState({
            imageUrl: key,
            imageKey: key
        });
    }

    filterSource = (item) => {
        return item.name;
    }

    getImgScaleData = (scale) => {
        let ImgScaleData = null;
        // 图片比例，1-16:9 2-4:3 3-2:3 4-3:2
        switch (Number(scale)) {
            case 1:
            default:
                ImgScaleData = {
                    imgScaleText: '16:9',
                    uploadWidth: 320,
                    uploadHeight: 180,
                };
                break;
            case 2:
                ImgScaleData = {
                    imgScaleText: '4:3',
                    uploadWidth: 320,
                    uploadHeight: 180,
                };
                break;
            case 3:
                ImgScaleData = {
                    imgScaleText: '2:3',
                    uploadWidth: 160,
                    uploadHeight: 240,
                };
                break;
            case 4:
                ImgScaleData = {
                    imgScaleText: '3:2',
                    uploadWidth: 320,
                    uploadHeight: 213,
                };
                break;
        }
        return ImgScaleData;
    }

    renderOption = (item) => {
        return (
            <Option key={item.videoBaseId} value={item.name} text={item.name}>
                {item.name}
            </Option>
        );
    }

    handleInput = async (value) => {
        this.setState({
            search: value.trim(),
        });
        try {
            const res = await fetcher(REQ_URL.SEARCH_VIDEO_LISTS, {
                name: value.trim(),
                page: 1,
                size: 200,
                status: 2,
                platformsType: [0],
            });
            if (res.code === 0) {
                this.setState({
                    source: res.data.videoBaseCards
                });
            }
        } catch (e) {
            message.error('搜索错误!');
        }
    }

    getImgUrl = (imgsArr, targetScale) => {
        const finalImgObj = imgsArr.filter(imgObj => imgObj.scale === targetScale)[0] || {};
        return finalImgObj.url || '';
    }

    handleSelect = (value, option) => {
        const scale = this.props.scale;
        const result = Object.assign([], this.state.source);
        const item = result.filter((_item) => {
            return _item.name === value;
        })[0];
        if (item && item.images) {
            const imageUrl = this.getImgUrl(item.images, scale);
            this.props.form.setFieldsValue({
                name: item.name,
                subName: item.subName,
                imageUrl,
            });
            // this.props.onVideoDataChange(imageUrl)
            this.setState({
                videoBaseId: item.videoBaseId,
                imageUrl,
            });
        } else {
            message.error('不存在的数据');
        }
    }

    componentWillReceiveProps = (nextProps) => {
        // 切换了视频，清空form 的state
        if (nextProps.currentVideoIndex !== this.props.currentVideoIndex || nextProps.videoBaseId !== this.props.videoBaseId) {
            this.setState({
                search: '',
                imageUrl: nextProps.imageUrl,
                videoBaseId: nextProps.videoBaseId,
                imageKey: '',
            });
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 },
        };
        const { getFieldDecorator } = this.props.form;
        const { search } = this.state;
        let { name, subName, url, imageUrl, scale, loading } = this.props;
        if (this.state.imageUrl) {
            imageUrl = this.state.imageUrl;
        }
        const imgScaleData = this.getImgScaleData(scale);
        return (
            <Form style={{ overflow: 'hidden', paddingTop: '15px' }} onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label='搜索'>
                    <AutoComplete
                        value={search}
                        dataSource={this.state.source.map(this.renderOption)}
                        placeholder='搜索视频'
                        onChange={debounce(this.handleInput.bind(this), 300)}
                        onSelect={this.handleSelect}
                    >
                        <Input suffix={<Icon type='search' className={style['certain-category-icon']}/>}/>
                    </AutoComplete>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='一级标题'>
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true,
                            message: '请输入一级标题！',
                        }],
                        initialValue: name
                    })(
                        <Input maxLength='20'/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='二级标题'>
                    {getFieldDecorator('subName', {
                        initialValue: subName
                    })(
                        <Input maxLength='20'/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='URL'>
                    {getFieldDecorator('url', {
                        initialValue: url
                    })(
                        <Input/>
                    )}
                </FormItem>
                {
                    this.props.timeLine ? (
                        <FormItem
                            {...formItemLayout}
                            label='活动时间'
                        >
                            {getFieldDecorator('activityTime', {
                                rules: [{ required: true, message: '请输入活动时间' }],
                                initialValue: this.props.activityTime ? moment(this.props.activityTime) : null,
                                onChange: this.changeTime.bind(this),
                            })(
                                <DatePicker
                                    allowClear={true}
                                    placeholder='请选择开始时间'
                                />
                            )}
                        </FormItem>
                    ) : null
                }

                <FormItem
                    {...formItemLayout}
                    label='封面图'>
                    {getFieldDecorator('imageUrl', {
                        rules: [{ required: true, message: '图片不能为空！' }],
                        initialValue: imageUrl
                    })(
                        <Upload
                            figureWidth={imgScaleData.uploadWidth}
                            figureHeight={imgScaleData.uploadHeight}
                            uploadDone={this.uploadDone}
                            showImgUrl={imageUrl}
                            imgScale={scale || 1}
                            imgScaleText={imgScaleData.imgScaleText}
                        />
                    )}
                </FormItem>
                <Button
                    style={{ marginLeft: '153px' }}
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={loading}
                >
                    保存
                </Button>
            </Form>
        );
    }
}

export default Form.create()(VideoConfigForPc);
