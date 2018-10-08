import React, { Component } from 'react';
import { Form, Row, Col, Input, Switch, Button, message } from 'antd';
import Upload from '../../components/Upload';
import style from './advertDetail.module.css';
import yxFetch from '../../utils/fetch';

const FormItem = Form.Item;

class AdvertAppDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            api: {
                getAdvertAppDetail: 'back/ad/list',
                changeSwitchStatus: 'back/ad/Enable',
                changeAdvert: 'back/ad/config',
            },
            adid: '',
            id: '',
            enableStatus: '',
            contentUrl: '',
            imageUrl: '',
            location: '',
            imageType: '',
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
    uploadDone(scale, imageUrl, image) {
        this.setState({
            imageUrl
        });
        this.props.form.setFieldsValue({ imageUrl });
        this.setState({
            imageType: image.type,
        });
    }
    handleUseChange(value) {
        this.setState({
            enableStatus: +value
        });
    }
    getAdvertLocation(value) {
        switch (value) {
            case '10001':
                return '首页悬浮';
            case '10002':
                return '启动页';
            case '10003':
                return '播放页广告';
            default:
                return '';
        }
    }
    async fetchAdvertList() {
        let advertId = this.props.match.match.params.id;
        let location = this.getAdvertLocation(advertId);
        let res = await yxFetch(this.state.api.getAdvertAppDetail, { adids: advertId });
        if (res.code === 0) {
            let advertItem = res.data;
            this.setState({
                adid: advertItem[advertId][0].adId,
                enableStatus: Boolean(advertItem[advertId][0].enableStatus),
                contentUrl: advertItem[advertId][0].contentUrl,
                imageUrl: advertItem[advertId][0].imageUrl,
                id: advertItem[advertId][0].id,
                imageType: advertItem[advertId][0].imageType,
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
            let params = { ...values, adid: this.state.adid, id: this.state.id, imageType: this.state.imageType };
            yxFetch(this.state.api.changeAdvert, params).then(res => {
                if (res.code === 0) {
                    yxFetch(this.state.api.changeSwitchStatus, {
                        enableStatus: +(this.state.enableStatus),
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
                <div className={style['advert-info']}>
                    <div>启用{this.state.location}</div>
                    <Switch checked={!!this.state.enableStatus} onChange={this.handleUseChange} checkedChildren='已启用' unCheckedChildren='未启用' />
                </div>
                <div className={style['input-item']}>
                    <Form onSubmit={this.submitInfo} style={{ maxWidth: 600 }}>
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
                                    uploadDone={this.uploadDone}
                                    showImgUrl={this.state.imageUrl}
                                    imgScaleText='1080*1920'
                                    figureWidth={180}
                                    figureHeight={320}
                                />
                            )}
                        </FormItem>
                        <FormItem hasFeedback {...formItemLayout} label='URL'>
                            {getFieldDecorator('contentUrl', {
                                rules: [{
                                    message: '请输入要链接到页面的url地址'
                                }],
                                initialValue: this.state.contentUrl
                            })(
                                <Input placeholder='请输入要链接到页面的url地址' />
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

const advertAppDetail = Form.create({})(AdvertAppDetail);
export default advertAppDetail;
