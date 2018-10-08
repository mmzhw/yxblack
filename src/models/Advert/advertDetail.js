import React, { Component } from 'react';
import { Form, Row, Col, Input, Switch, Button, message } from 'antd';
import Upload from '../../components/Upload';
import style from './advertDetail.module.css';
import yxFetch from '../../utils/fetch';

const FormItem = Form.Item;

class AdvertDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            api: {
                getAdvertDetail: 'back/web/ad/detail/v1',
                changeSwitchStatus: 'back/web/ad/Enable/v1',
                changeAdvert: 'back/web/ad/config/v1',
            },
            title: '',
            adid: '',
            isUse: '',
            contentUrl: '',
            imageUrl: '',
            location: ''
        };
        this.fetchAdvertList = this.fetchAdvertList.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
        this.handleUseChange = this.handleUseChange.bind(this);
        this.submitInfo = this.submitInfo.bind(this);
    }
    componentDidMount() {
        this.fetchAdvertList();
    }
    componentWillMount() {
        message.destroy();
    }
    uploadDone(scale, imageUrl) {
        this.setState({
            imageUrl
        });
        this.props.form.setFieldsValue({ imageUrl });
    }
    handleUseChange(value) {
        this.setState({
            isUse: +value
        });
    }
    getAdvertLocation(value) {
        switch (value) {
            case '001':
                return '卡片模块#1之下';
            case '002':
                return '卡片模块#2之下';
            case '003':
                return '卡片模块#3之下';
            case '004':
                return '最后一个卡片模块之下';
            case '011':
                return '#相关推荐#之下';
            case '012':
                return '#猜你喜欢之下';
            default:
                return '';
        }
    }
    async fetchAdvertList() {
        let advertId = this.props.match.match.params.id;
        let location = this.getAdvertLocation(advertId);
        let res = await yxFetch(this.state.api.getAdvertDetail, { adid: advertId });
        if (res.code === 0) {
            let advertItem = res.data;
            this.setState({
                title: advertItem.title,
                adid: advertItem.adid,
                isUse: advertItem.enableStatus,
                contentUrl: advertItem.contentUrl,
                imageUrl: advertItem.imageUrl,
                location: location
            });
        } else {
            message.error(res.errmsg);
        }
    }
    submitInfo(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return message.error('配置不完整，无法开启广告位');
            let params = { ...values };
            yxFetch(this.state.api.changeAdvert, params).then(res => {
                if (res.code === 0) {
                    yxFetch(this.state.api.changeSwitchStatus, {
                        enableStatus: this.state.isUse,
                        adid: this.state.adid
                    }).then(res => {
                        if (res.code === 0) {
                            message.success('广告配置成功！');
                        } else {
                            message.error(res.errmsg);
                        }
                    });
                } else {
                    message.error(res.errmsg);
                }
            });
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
                <div className={ style['advert-info'] }>
                    <div>该广告位于{ this.state.location }</div>
                    <Switch checked={ !!this.state.isUse } onChange={this.handleUseChange} checkedChildren='已启用' unCheckedChildren='未启用' />
                </div>
                <div className={ style['input-item'] }>
                    <Form onSubmit={this.submitInfo} style={{ maxWidth: 600 }}>
                        <FormItem {...formItemLayout} label='广告ID'>
                            {getFieldDecorator('adid', {
                                initialValue: this.state.adid
                            })(
                                <Input disabled={ true }/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='标题'>
                            {getFieldDecorator('title', {
                                rules: [{
                                    max: 40,
                                    message: '最多可输入40字符！'
                                }],
                                initialValue: this.state.title ? this.state.title : ''
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem hasFeedback {...formItemLayout} label='广告内容'>
                            {getFieldDecorator('contentUrl', {
                                rules: [{
                                    required: true,
                                    message: '请输入要链接到页面的url地址'
                                }],
                                initialValue: this.state.contentUrl
                            })(
                                <Input placeholder='请输入要链接到页面的url地址' />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='广告图'>
                            {getFieldDecorator('imageUrl', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选对应的广告图！'
                                    }
                                ],
                                initialValue: this.state.imageUrl ? this.state.imageUrl : ''
                            })(
                                <Upload
                                    uploadDone = {this.uploadDone}
                                    showImgUrl = {this.state.imageUrl}
                                    imgScaleText = '1180* 120'
                                    figureWidth = { 590 }
                                    figureHeight = { 60 }
                                    noneImg = 'advert'
                                />
                            )}
                        </FormItem>
                        <Row>
                            <Col span={3}></Col>
                            <Col span={15}>
                                <FormItem>
                                    <Button type='primary' htmlType='submit'>保存</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

const advertDetail = Form.create({})(AdvertDetail);
export default advertDetail;
