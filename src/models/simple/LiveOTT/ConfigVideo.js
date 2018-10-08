import React, { Component } from 'react';
import style from './style.module.css';
import { Form, Input, Button, AutoComplete, Icon, Switch } from 'antd';
import { getImgTypeSize, getImgUrl } from '../../../PublicTools';
import fetcher from '../../../utils/fetch';
import debounce from '../../../utils/debounce';
import Upload from '../../../components/Upload';
import { handleImgUrl } from '../../../utils/util';
import { REQ_URL } from '../../../constants/constants';

const FormItem = Form.Item;

class ConfigVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: [], // 搜索到的资源
            sourcesAutoComplete: [],
            // cardType: props.card.cardType !== undefined ? String(props.card.cardType) : '1', // 类型
            imageUrl: props.card.imageUrl || '', // 封面图
            videoId: props.card.videoId || '', // 视频ID
            sort: props.card.sort, // 排序序号
            extMap: props.card.extMap,
            scale: props.card.scale || 1,
            flag: Boolean(props.card.flag), // flage,0自由，1三方
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.card, nextProps.card);
        if (nextProps.card !== this.props.card) {
            this.props.form.resetFields();
            this.setState({
                // cardType: nextProps.card.cardType !== undefined ? String(nextProps.card.cardType) : '1', // 类型
                imageUrl: nextProps.card.imageUrl || '', // 封面图
                videoId: nextProps.card.videoId || '', // 视频ID
                sort: nextProps.card.sort, // 排序序号
                extMap: nextProps.card.extMap,
                scale: nextProps.card.scale || 1,
                flag: Boolean(nextProps.card.flag), // flage,0自由，1三方
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
                    values.extMap = this.state.extMap;
                    // values.cardType = Number(this.state.cardType);
                    values.flag = values.flag ? 1 : 0;
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
        try {
            const res = await fetcher(req, data);
            let sources = this.state.flag ? (
                res.filmlist ? res.filmlist : []
            ) : (
                res.data && res.data.videoBaseCards ? res.data.videoBaseCards : []
            );
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
        } catch (e) {
            console.log('error', e);
        }
    }

    // 处理选择的视频数据
    handleSelect(value) {
        let videoId = '';
        let imageUrl = '';
        if (this.state.flag && this.props.searchType === 3) { // 点播和资讯不能三方搜索
            // 三方
            let card = this.state.sources.filter((source) => {
                return source.title === value;
            });
            if (!card[0]) {
                return;
            }
            this.props.form.setFieldsValue({
                title: card[0].title,
            });
            videoId = card[0].aid;
            imageUrl = card[0].picUrl;
        } else {
            // 本地
            let card = this.state.sources.filter((source) => {
                return source.name === value;
            });
            if (!card[0]) {
                return;
            }
            this.props.form.setFieldsValue({
                title: card[0].name,
            });
            videoId = card[0].videoBaseId;
            imageUrl = getImgUrl(card[0].images, getImgTypeSize(this.props.imgType).scale); // 过滤出符合比例的图片
        }

        this.setState({
            videoId,
            imageUrl
        });
    }

    // 启用直播/点播
    // changeType(value) {
    //     this.setState({
    //         cardType: value
    //     });
    // }

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
                    {/*   <FormItem
                        {...formItemLayout}
                        label='类型'>
                        {getFieldDecorator('cardType', {
                            initialValue: this.state.cardType
                        })(
                            <Select onChange={(value) => { this.changeType(value); }}>
                                <Select.Option value='0'>直播</Select.Option>
                                <Select.Option value='1'>点播</Select.Option>
                            </Select>
                            )}
                    </FormItem>*/}
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
                    {
                        this.props.searchType === 3 ? (
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
                    }

                    <FormItem
                        {...formItemLayout}
                        label='搜索'>
                        <AutoComplete
                            dataSource={this.state.sourcesAutoComplete}
                            placeholder='搜索视频'
                            onChange={debounce(this.handleInput.bind(this), 300)}
                            onSelect={this.handleSelect.bind(this)}
                        >
                            <Input suffix={<Icon type='search' />}/>
                        </AutoComplete>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='一级标题'>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入标题名称' }],
                            initialValue: card.title
                        })(
                            <Input maxLength='20'/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='URL'>
                        {getFieldDecorator('url', {
                            initialValue: card.url
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='封面图'
                    >
                        <Upload
                            imgScale={getImgTypeSize(this.props.imgType).scale}
                            figureWidth={getImgTypeSize(this.props.imgType).width}
                            figureHeight={getImgTypeSize(this.props.imgType).height}
                            uploadDone={this.uploadDone.bind(this)}
                            showImgUrl={handleImgUrl(this.state.imageUrl)}
                        />
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button key='submit' type='primary' htmlType='submit' loading={this.props.loading} className={style.saveButton}>保存</Button>
                        <Button onClick={this.props.backToList}>返回</Button>
                    </FormItem>

                </Form>
            </div>
        );
    }
}
export default Form.create()(ConfigVideo);
