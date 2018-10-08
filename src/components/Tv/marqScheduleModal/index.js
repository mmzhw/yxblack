import React, { Component } from 'react';
import { Modal, Form, Button, DatePicker } from 'antd';
import style from './index.module.css';
import moment from 'moment';

const FormItem = Form.Item;

class MarqScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleOk = () => {
        if (this.props.handleOk) {
            this.props.handleOk();
        }
    }
    handleCancel = () => {
        if (this.props.handleCancel) {
            this.props.handleCancel();
        }
    }
    onFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(
            (err, values) => {
                if (err) return;
                this.props.form.resetFields();
                let params = { ...values };
                params.gmtStart = params.gmtStart.valueOf();
                params.gmtEnd = params.gmtEnd.valueOf();
                if (this.props.handleOk) {
                    this.props.handleOk(params);
                }
            }
        );
    }
    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <div>
                <Modal
                    width={400}
                    title='定时设置'
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={false}
                >
                    <Form onSubmit={this.onFormSubmit}>
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
                                initialValue: this.props.gmtStart ? moment(this.props.gmtStart) : null
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
                                initialValue: this.props.gmtEnd ? moment(this.props.gmtEnd) : null
                            })(
                                <DatePicker
                                    showTime
                                    format = 'YYYY-MM-DD HH:mm:ss'
                                    placeholder = '请选择结束时间'
                                />
                            )}
                        </FormItem>
                        <div className={style['btn-wrp']}>
                            <Button className={style['btn']} type='primary' htmlType='submit'>确定</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const MarqSchedule = Form.create()(MarqScheduleComponent);
export default MarqSchedule;
