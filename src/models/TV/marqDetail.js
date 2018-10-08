import React, { Component } from 'react';
import moment from 'moment';
import style from './marqDetail.module.css';
import yxFetch from '../../utils/fetch';
import classNames from 'classnames';
import { Form, Input, Row, Col, Button, Select, Icon, DatePicker, message } from 'antd';
import { REQ_URL } from '../../constants/constants';

const FormItem = Form.Item;
const Option = Select.Option;
// const dateFormat = 'YYYY-MM-DD HH:mm:ss'
let uuid = 0;
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gmtStart: null,
            gmtEnd: null,
            content: [
                { text: '', color: '#FFFFFF' }
            ],
            id: '',
            color: '',
            initNum: [],
            preContent: ''
        };
        this.marqDetail = this.marqDetail.bind(this);
        this.add = this.add.bind(this);
        this.submitInfo = this.submitInfo.bind(this);
        this.preContent = this.preContent.bind(this);
    }
    componentDidMount() {
        this.marqDetail();
    }
    async marqDetail() {
        let marqId = this.props.match.match.params.id;
        if (marqId) {
            let res = await yxFetch(REQ_URL.DETAIL_RUN_BANNER, { id: marqId });
            if (res.code === 0) {
                let marqItem = res.data;
                let mContent = JSON.parse(marqItem.content);
                let i = 0;
                let initNum = [];
                while (i < mContent.length) {
                    initNum.push(i);
                    i++;
                }
                uuid = mContent.length - 1;
                this.setState({
                    gmtStart: marqItem.gmtStart,
                    gmtEnd: marqItem.gmtEnd,
                    id: marqItem.id,
                    content: mContent,
                    initNum
                });
            } else {
                message.error(res.errmsg);
            }
        } else {
            this.setState({
                initNum: [0]
            });
        }
    }
    preContent() {
        const { form } = this.props;
        let timer = null;
        clearTimeout(timer);
        timer = setTimeout(() => {
            let content = form.getFieldValue('num');
            this.setState({
                content
            });
        }, 1000);
    }
    remove(k) {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        this.preContent();
    }
    add() {
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    submitInfo(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return message.error('配置不完整，无法保存');
            let params = { ...values };
            let detail = {};
            params.num = params.num.filter(key => key !== 'empty');
            detail.id = this.state.id ? this.state.id : '';
            detail.gmtStart = params.gmtStart.valueOf();
            detail.gmtEnd = params.gmtEnd.valueOf();
            detail.content = JSON.stringify(params.num);
            yxFetch(REQ_URL.INSERT_RUN_BANNER, detail).then(res => {
                if (res.code === 0) {
                    detail.id === '' ? message.success('新建成功') : message.success('修改成功');
                }
            });
        });
    }
    render() {
        const { getFieldDecorator, getFieldValue, getFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
        };
        const ItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 },
        };
        getFieldDecorator('keys', { initialValue: this.state.initNum });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <Row key={k}>
                    <Col span={10} style={{ textAlign: 'left' }}>
                        <FormItem
                            {...ItemLayout}
                            label={index === 0 ? '输入通知内容' : index}
                            colon={false}
                        >
                            {getFieldDecorator(`num[${k}].text`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    required: true,
                                    message: '请输入通知内容',
                                }],
                                initialValue: this.state.content[k] ? this.state.content[k].text : ''
                            })(
                                <Input placeholder='请输入通知内容' onChange={this.preContent} style={{ width: '100%', marginRight: 10 }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem
                            colon={false}
                        >
                            {getFieldDecorator(`num[${k}].color`, {
                                initialValue: this.state.content[k] ? this.state.content[k].color : '#FFFFFF'
                            })(
                                <Select style={{ width: 90, marginRight: 10 }} onChange={this.preContent}>
                                    <Option value='#FFFFFF' style={{ background: '#FFFFFF' }}>默认白色</Option>
                                    <Option value='#AF3900' style={{ background: '#AF3900' }}>#AF3900</Option>
                                    <Option value='#0067BC' style={{ background: '#0067BC' }}>#0067BC</Option>
                                </Select>
                            )}
                            {keys.length > 1 ? (
                                <Icon
                                    className={classNames(style['curr-color'], 'dynamic-delete-button')}
                                    type='minus-circle-o'
                                    disabled={keys.length === 1}
                                    onClick={() => this.remove(k)}
                                />
                            ) : null}
                        </FormItem>
                    </Col>
                </Row>
            );
        });
        return (
            <div className={ style['marq-detail'] }>
                <Form onSubmit={this.submitInfo} style={{ maxWidth: 800 }}>
                    <FormItem {...formItemLayout} label='开始时间' colon={false}>
                        {getFieldDecorator('gmtStart', {
                            rules: [{
                                required: true,
                                message: '请选择开始时间'
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (getFieldsValue().gmtStart && getFieldsValue().gmtStart.valueOf() < new Date().valueOf()) {
                                        callback('开始时间需大于现在');
                                    }
                                    if (getFieldsValue().gmtStart && getFieldsValue().gmtEnd && getFieldsValue().gmtStart.valueOf() > getFieldsValue().gmtEnd) {
                                        callback('开始时间需小于结束日期');
                                    }
                                    callback();
                                }
                            }],
                            initialValue: this.state.gmtStart ? moment(this.state.gmtStart) : null
                        })(
                            <DatePicker
                                showTime
                                format = 'YYYY-MM-DD HH:mm:ss'
                                placeholder = '请选择开始时间'
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='结束时间' colon={false}>
                        {getFieldDecorator('gmtEnd', {
                            rules: [{
                                required: true,
                                message: '请选择结束时间'
                            },
                            {
                                validator: (rule, value, callback) => {
                                    if (getFieldsValue().gmtEnd && getFieldsValue().gmtStart && getFieldsValue().gmtStart.valueOf() > value.valueOf()) {
                                        callback('结束日期需大于开始时间');
                                    }
                                    if (getFieldsValue().gmtEnd && getFieldsValue().gmtEnd.valueOf() < new Date().valueOf()) {
                                        callback('结束时间需大于现在');
                                    }
                                    callback();
                                }
                            }],
                            initialValue: this.state.gmtEnd ? moment(this.state.gmtEnd) : null
                        })(
                            <DatePicker
                                showTime
                                format = 'YYYY-MM-DD HH:mm:ss'
                                placeholder = '请选择结束时间'
                            />
                        )}
                    </FormItem>
                    { formItems }
                    <Row>
                        <Col span={3}>
                            <span className={ style['marq-pre'] }>
                预览
                            </span>
                        </Col>
                        <Col span={19}>
                            <div className={ style['marq-pre-content'] }>
                                {
                                    this.state.content && this.state.content.map((item, index) => {
                                        return (
                                            <span key={index} style={{ color: item.color }} >{item.text}</span>
                                        );
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={19}>
                            <FormItem>
                                <Button type='dashed' onClick={this.add} style={{ width: '50%' }}>
                                    <Icon type='plus' /> 点击添加通知内容
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={21}>
                            <FormItem>
                                <Button type='primary' htmlType='submit'>保存</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                {
                    this.state.color && this.state.color.map((item, index) => {
                        return (
                            <span key={index} style={{ color: item.color }}>{item.text}</span>
                        );
                    })
                }
            </div>
        );
    }
}

const MarqDetail = Form.create({})(Detail);
export default MarqDetail;
