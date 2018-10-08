import React, { Component } from 'react';
import { Form, Modal, Input, Select, message, Radio } from 'antd';
import PropTypes from 'prop-types';
import Upload from '../../../components/Upload';
import fetcher from '../../../utils/fetch';
import _ from 'lodash';
import DPRow from '../../../components/FormRow/DPRow';
import { REQ_URL } from '../../../constants/constants';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const imgScaleMap = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 3,
    6: 1,
    7: 1,
}

class PlayBackModal extends Component {
    static PropTypes = {
        modalOption: PropTypes.object,
        configData: PropTypes.configData,
        imageUrl: PropTypes.string
    }

    state = {
        videoList: null,
        imageUrl: '',
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageUrl !== this.props.imageUrl) {
            this.setState({ imageUrl: nextProps.imageUrl });
        }
    }

    uploadDone = (imgScale, key) => {
        this.props.updateImageUrl(key);
    }

    handleSelectChange = (value, option) => {
        let { videoList } = this.state;
        let video = videoList.find(video => video.name === value);
        let imageUrl = '';
        video.images.forEach((img) => {
            if (img.scale === imgScaleMap[this.props.layoutId]) {
                imageUrl = img.url;
            }
        });
        if (imageUrl) {
            this.setState({ imageUrl });
            this.props.updateImageUrl(imageUrl);
        }
        let curName = this.props.form.getFieldValue('name');
        if (!curName) {
            this.props.form.setFieldsValue({
                name: video.name
            });
        }
        this.props.updateCurVideo(video);
    }

    searchVideos = _.debounce(async(words) => {
        let values = {
            page: 1,
            size: 200
        };
        values = {
            ...values,
            name: words,
            status: 2
        };
        if (!words) {
            this.props.updateCurVideo({});
        }
        const res = await fetcher(REQ_URL.SEARCH_VIDEO_LISTS, values);
        if (res.code === 0) {
            let videoList = res.data && res.data.videoBaseCards;
            this.setState({
                videoList: videoList
            });
        } else {
            message.error(res.errmsg);
        }
    }, 500)

    handleScheduleTimeChange(value) {
        if (this.props.configData) {
            this.props.configData.scheduleTime = '';
        }
    }

    render() {
        const { videoList } = this.state;
        const { modalOption, configData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                {...modalOption}
            >
                <Form>
                    <FormItem
                        label='标题'
                    >
                        {getFieldDecorator('name', {
                            initialValue: configData && configData.name,
                            rules: [{ required: true, message: '必填项' }, { max: 50, message: '不能超过50个字' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label='二级标题'
                    >
                        {getFieldDecorator('subName', {
                            initialValue: configData && configData.subName,
                            rules: [{ max: 60, message: '不能超过60个字' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <DPRow
                        id = 'scheduleTime'
                        label = '时间'
                        initialValue = { configData && configData.scheduleTime }
                        formEle = { Form }
                        formMethods = { this.props.form }
                        format = 'YYYY-MM-DD'
                        showTime = { false }
                        onChange = { this.handleScheduleTimeChange.bind(this) }
                        required = { false }
                    />
                    <FormItem
                        label='关联视频'
                    >
                        {getFieldDecorator('videoName', {
                            initialValue: (configData && configData.videoName) ? configData.videoName : '',
                        })(
                            <Select
                                mode='combobox'
                                notFoundContent=''
                                onSearch={this.searchVideos}
                                onSelect={this.handleSelectChange}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                placeholder='支持标题搜索'
                            >
                                {
                                    videoList && videoList.map((video, index) => {
                                        return (
                                            <Option
                                                key={index}
                                                value={video.name}
                                            >
                                                {video.name}
                                            </Option>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label='url'
                    >
                        {getFieldDecorator('url', {
                            initialValue: configData && configData.url,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {
                        (this.props.layoutId === 7) &&
                        <FormItem
                            label='展示类型'
                            style={{ display: 'none' }}
                        >
                            {getFieldDecorator('type', {
                                initialValue: (configData && configData.type !== undefined && configData.type !== null) ? String(configData.type) : ((this.props.curTableIndex === 70) ? '0' : '1'),
                                rules: [{
                                    require: true
                                }]
                            })(
                                <RadioGroup>
                                    this.props.curTableIndex{this.props.curTableIndex}
                                    <Radio value={'0'} disabled={true}>大图</Radio>
                                    <Radio value={'1'} disabled={true}>小图</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    }
                    <FormItem
                        label='图片'
                    >
                        <Upload
                            figureWidth={75}
                            figureHeight={42}
                            uploadDone={this.uploadDone}
                            showImgUrl={this.state.imageUrl}
                            imgScale='2'
                            imgScaleText='750 * 422'
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PlayBackModal);
