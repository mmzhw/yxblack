import React, { Component } from 'react';
import style from './style.module.css';
import debounce from '../../../../utils/debounce';
import fetcher from '../../../../utils/tvFetch';
import Upload from '../../../../components/Upload/indexTV';
import { Form, Input, Button, AutoComplete, Icon, Switch, Select } from 'antd';
import { handleImgUrl } from '../../../../utils/util';
import { REQ_URL } from '../../../../constants/constants';
import { getImgTypeSize, getImgUrl } from '../../../../PublicTools';

const FormItem = Form.Item;

const imgSizeMap = {
    1: '1177px *506px',
    2: '336px*188px',
    3: '885px*309px',
    4: '336px*504px',
};

class ConfigVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: [], // 搜索到的资源
            sourcesAutoComplete: [],
            firstCates: [],
            imageUrl: props.card.imageUrl || '', // 封面图
            videoId: props.card.videoId || '', // 视频ID
            sort: props.card.sort, // 排序序号
            scale: props.card.scale || 1,
            flag: Boolean(props.card.flag), // flage,0自由，1三方
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.card !== this.props.card) {
            this.props.form.resetFields();
            this.setState({
                imageUrl: nextProps.card.imageUrl || '', // 封面图
                videoId: nextProps.card.videoId || '', // 视频ID
                sort: nextProps.card.sort, // 排序序号
                scale: nextProps.card.scale || 1,
                flag: Boolean(nextProps.card.flag), // flage,0自由，1三方
            });
        }
    }

    componentDidMount() {
        this.getFirstCates();
    }

    async getFirstCates() {
        const res = await fetcher(REQ_URL.OTT_FIRST_CATEGORY, {});
        if (res.code === 0) {
            this.setState({
                firstCates: res.data
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                if (this.props.saveVideoData) {
                    values.imageUrl = this.state.imageUrl || '';
                    values.videoId = this.state.videoId;
                    values.scale = getImgTypeSize(this.props.imgType).scale;
                    values.sort = this.state.sort;
                    values.isEnable = values.isEnable ? 1 : 0;
                    values.flag = 0;

                    if (this.props.channelName === '更多') {
                        this.state.firstCates.forEach((firstCate) => {
                            if (firstCate.topId === values.topId) {
                                values.name = firstCate.name;
                            }
                        });
                    }

                    const result = await this.props.saveVideoData(values);
                    if (result) {
                        this.props.form.resetFields();
                    }
                }
            }
        });
    }

    // 更新图片
    uploadDone(scale, imageUrl) {
        this.setState({
            imageUrl: imageUrl,
        });
    }

    // 实时根据输入搜索
    async handleInput(value) {
        value = value.trim();
        if (!value) {
            this.setState({
                sources: [],
                sourcesAutoComplete: [],
            });
            return;
        }
        let req = REQ_URL.SEARCH_VIDEO_LISTS;
        let data = {
            name: value.trim(),
            page: 1,
            size: 200,
            status: 2,
            platformsType: [0],
        };
        if (this.state.flag) {
            req = REQ_URL.SEARCH_THIRD_VIDEO_LISTS;
            data = {
                word: value.trim(),
                page: 1,
                pageSize: 200,
            };
        }
        let sources = [];
        let res = await fetcher(req, data);
        if (this.state.flag) {
            if (res.filmlist) {
                sources = res.filmlist ? res.filmlist : [];
            } else {
                return;
            }
        } else {
            if (res.data) {
                sources = res.data.videoBaseCards ? res.data.videoBaseCards : [];
            } else {
                return;
            }
        }
        let sourcesAutoComplete = '';
        if (sources && sources.length > 0) {
            sourcesAutoComplete = sources.map((source) => {
                return source ? (
                    this.state.flag ? source.title : source.name
                ) : '';
            });
        }

        this.setState({
            sources: sources,
            sourcesAutoComplete: sourcesAutoComplete,
        });
    }

    // 处理选择的视频数据
    handleSelect(value) {
        let videoId = '';
        let imageUrl = '';
        if (this.state.flag) {
            let card = this.state.sources.filter((source) => {
                return source.title === value;
            });
            if (!card[0]) {
                return;
            }
            this.props.form.setFieldsValue({
                name: card[0].title,
            });
            videoId = card[0].aid;
            imageUrl = card[0].picUrl;
        } else {
            let card = this.state.sources.filter((source) => {
                return source.name === value;
            });
            if (!card[0]) {
                return;
            }
            this.props.form.setFieldsValue({
                name: card[0].name,
                subName: card[0].subName,
            });
            videoId = card[0].videoBaseId;
            if (card[0].images && card[0].images.length > 0) {
                imageUrl = getImgUrl(card[0].images, getImgTypeSize(this.props.imgType).scale); // 过滤出符合比例的图片
            }
        }

        this.setState({
            videoId,
            imageUrl
        });
    }

    changSearch() {
        this.setState({
            flag: !this.state.flag,
            sources: [],
        });
    }

    render() {
        let formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };

        let tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 2,
            }
        };

        let { getFieldDecorator } = this.props.form;
        let { card } = this.props;

        return (
            <div className={style.configModule}>
                <p>视频配置</p>
                <Form onSubmit={this.handleSubmit.bind(this)}>

                    {
                        this.props.channelName === '更多' ? (
                            <FormItem
                                {...formItemLayout}
                                wrapperCol={{ span: 8 }}
                                label='标题'
                            >
                                {getFieldDecorator('topId', {
                                    initialValue: card.topId ? String(card.topId) : '0'
                                })(
                                    <Select
                                        onChange={this.props.changeTopId}>
                                        <Select.Option value='0'>无</Select.Option>
                                        {
                                            this.state.firstCates && this.state.firstCates.map((firstCate, index) => {
                                                return (
                                                    <Select.Option key={index} value={firstCate.topId}>{firstCate.name}</Select.Option>
                                                );
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        ) : null
                    }

                    {/* {
                        this.props.channelName !== '更多' ? (
                            <FormItem
                                {...formItemLayout}
                                label='开启第三方搜索'>

                                {getFieldDecorator('flag', {
                                    valuePropName: 'checked',
                                    initialValue: Boolean(card.flag)
                                })(
                                    <Switch onChange={this.changSearch.bind(this)}/>
                                )}

                            </FormItem>
                        ) : null
                    } */}

                    {
                        this.props.channelName !== '更多' ? (
                            <FormItem
                                {...formItemLayout}
                                label='搜索'>

                                {getFieldDecorator('searchKey', {
                                    initialValue: ''
                                })(
                                    <AutoComplete
                                        dataSource={this.state.sourcesAutoComplete}
                                        placeholder='搜索视频'
                                        onChange={debounce(this.handleInput.bind(this), 300)}
                                        onSelect={this.handleSelect.bind(this)}
                                    >
                                        <Input suffix={<Icon type='search' />}/>
                                    </AutoComplete>
                                )}
                            </FormItem>
                        ) : null
                    }

                    {
                        this.props.channelName !== '更多' ? (
                            <FormItem
                                {...formItemLayout}
                                label='一级标题'>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入标题名称' }],
                                    initialValue: card.name
                                })(
                                    <Input maxLength='20'/>
                                )}
                            </FormItem>
                        ) : null
                    }

                    {/* {
                        this.props.channelName !== '更多' ? (
                            <FormItem
                                {...formItemLayout}
                                label='二级标题'>
                                {getFieldDecorator('subName', {
                                    initialValue: card.subName
                                })(
                                    <Input maxLength='20'/>
                                )}
                            </FormItem>
                        ) : null
                    }

                    {
                        this.props.channelName !== '更多' ? (
                            <FormItem
                                {...formItemLayout}
                                label='URL'>
                                {getFieldDecorator('url', {
                                    initialValue: card.url
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        ) : null
                    } */}

                    <FormItem
                        {...formItemLayout}
                        label='封面图'
                    >
                        <Upload
                            imgScaleText={imgSizeMap[Number(this.props.layoutId)]}
                            imgScale={getImgTypeSize(this.props.imgType).scale}
                            figureWidth={getImgTypeSize(this.props.imgType).width}
                            figureHeight={getImgTypeSize(this.props.imgType).height}
                            uploadDone={this.uploadDone.bind(this)}
                            showImgUrl={handleImgUrl(this.state.imageUrl)}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='是否启用'>
                        {getFieldDecorator('isEnable', {
                            valuePropName: 'checked',
                            initialValue: Boolean(card.isEnable)
                        })(
                            <Switch/>
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button key='submit' type='primary' htmlType='submit' loading={this.props.loading}>保存</Button>
                    </FormItem>

                </Form>
            </div>
        );
    }
}
export default Form.create()(ConfigVideo);
