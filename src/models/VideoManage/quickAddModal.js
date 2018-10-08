import React, { Component } from 'react';
import { Modal, Form, Input, Button, message, Select, DatePicker } from 'antd';
import style from './quickAddModal.module.css';
import ImageUpload from '../../components/Upload';
import yxFetch from '../../utils/fetch';
import { REQ_URL } from '../../constants/constants';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class QuickAddModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeList: [],
            classifyList: [],
            imgUrl1: '', // 16:9
            firstCategorys: [],
            secondCategorys: [],
        };
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.uploadDone = this.uploadDone.bind(this);
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

    handleOk() {
        if (this.props.handleOk) {
            this.props.handleOk();
        }
    }
    handleCancel() {
        if (this.props.handleCancel) {
            this.props.handleCancel();
        }
    }
    onFormSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields(
            (err, values) => {
                if (err) return;
                let resetFields = () => {
                    this.props.form.resetFields();
                    this.setState({
                        imgUrl1: ''
                    });
                };
                let params = { ...values };
                params.copyrightStart = Number(values.copyrightStart ? values.copyrightStart.format('x') : '');
                params.copyrightEnd = Number(values.copyrightEnd ? values.copyrightEnd.format('x') : '');
                if (this.props.handleOk) {
                    this.props.handleOk(params, resetFields);
                }
            }
        );
    }
    uploadDone(scale, url) {
        let images = [];
        images.push({
            scale,
            url
        });
        this.props.form.setFieldsValue({
            images,
        });
        this.setState({
            imgUrl1: url,
        });
    }
    componentDidMount() {
        this.fetchTypeList();
        this.fetchClassifyList();
        this.fetchFirstCategory();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        };
        return (
            <div>
                <Modal
                    title='快速添加视频'
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={false}
                >
                    <Form onSubmit={this.onFormSubmit}>
                        <FormItem {...formItemLayout} label='视频源'>
                            {getFieldDecorator('originalUrl', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择视频源！'
                                    }
                                ],
                                initialValue: ''
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='名称'>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择名称！'
                                    }
                                ],
                                initialValue: ''
                            })(
                                <Input maxLength='40'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='licence'>
                            {getFieldDecorator('licence', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入licence！'
                                    }
                                ],
                                initialValue: ''
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            hasFeedback
                            label={'版权开始时间'}
                        >
                            {getFieldDecorator('copyrightStart', {
                                rules: [{ required: false, message: '请输入版权开始时间' }],
                                initialValue: moment(),
                            })(
                                <DatePicker
                                    showTime = { this.state.showTime }
                                    format = { this.state.format }
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            hasFeedback
                            label={'版权结束时间'}
                        >
                            {getFieldDecorator('copyrightEnd', {
                                rules: [{ required: false, message: '请输入版权结束时间' }],
                                initialValue: moment(),
                            })(
                                <DatePicker format = { this.state.format }/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='OTT一级分类'>
                            {getFieldDecorator('firstCategory', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择分类！'
                                    }
                                ],
                                initialValue: []
                            })(
                                <Select
                                    id = 'firstCategory'
                                    onChange = { this.firstCateChange.bind(this) }
                                >
                                    {this.state.firstCategorys && this.state.firstCategorys.map((classification, index) => (
                                        <Option value={ classification.topId + ''} key={index}>
                                            { classification.name }
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='OTT二级分类'>
                            {getFieldDecorator('secondCategory', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择分类！'
                                    }
                                ],
                                initialValue: []
                            })(
                                <Select
                                    id = 'secondCategory'
                                >
                                    {this.state.secondCategorys && this.state.secondCategorys.map((classification, index) => (
                                        <Option value={ classification.filmType + ''} key={index}>
                                            { classification.name }
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='分类'>
                            {getFieldDecorator('classificationIds', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择分类！'
                                    }
                                ],
                                initialValue: []
                            })(
                                <Select
                                    mode = 'multiple'
                                    id = 'classificationIds'
                                >
                                    {this.state.classifyList && this.state.classifyList.map((classification, index) => (
                                        <Option value={ classification['id'] + ''} key={index}>
                                            { classification['name'] }
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='类型'>
                            {getFieldDecorator('typeIds', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择类型！'
                                    }
                                ],
                                initialValue: []
                            })(
                                <Select
                                    mode = 'multiple'
                                    id = 'typeIds'
                                >
                                    {this.state.typeList && this.state.typeList.map((type, index) => (
                                        <Option value={ type['id'] + ''} key={index}>
                                            { type['name'] }
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='关键词'>
                            {getFieldDecorator('keyword', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入关键词！'
                                    }
                                ],
                                initialValue: ''
                            })(
                                <Input maxLength='30'/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='简介'>
                            {getFieldDecorator('intro', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择简介！'
                                    }
                                ],
                                initialValue: ''
                            })(
                                <TextArea maxLength='500' autosize/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='封面'>
                            {getFieldDecorator('images', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择封面！'
                                    }
                                ],
                                initialValue: []
                            })(
                                <ImageUpload
                                    imgScale = { 1 }
                                    imgScaleText = '图片比例16:9'
                                    showImgUrl = { this.state.imgUrl1 }
                                    figureWidth = { 200 }
                                    figureHeight = { 112 }
                                    uploadDone = { this.uploadDone }
                                />
                            )}
                        </FormItem>
                        <div className={style['btn-wrp']}>
                            <Button className={style['btn']} type='primary' htmlType='submit'>确定</Button>
                            <Button onClick={this.handleCancel} className={style['btn']} type='default'>取消</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
    async fetchTypeList() { // set enabled typeList
        let res = await yxFetch(REQ_URL.TYPE_LIST, {});
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
            message.error(res.errmsg);
        }
    }
    async fetchClassifyList() { // set enabled classifyList
        let res = await yxFetch(REQ_URL.CLASS_LIST, {});
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
    }
}

const QuickAddModal = Form.create()(QuickAddModalComponent);
export default QuickAddModal;
