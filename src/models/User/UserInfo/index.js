import React, { Component } from 'react';
import { Form, Input, DatePicker, Select, Button, message } from 'antd';
import style from './style.module.css';
import yxFetch from '../../../utils/fetch';
import moment from 'moment';
import { REQ_URL } from '../../../constants/constants';
const FormItem = Form.Item;

class UserInfoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prohibitEdit: true,
        };
        this.id = '';
    }

    componentDidMount() {
        this.fetchUserInfo(this.state.currentPage);
    }

    async fetchUserInfo() {
        let res = await yxFetch(REQ_URL.USER_FIND, {});

        if (res.code === 0) {
            this.props.form.setFields({
                id: { value: res.data.id },
                userName: { value: res.data.userName },
                userPassword: { value: res.data.userPassword },
                department: { value: res.data.department },
                realName: { value: res.data.realName },
                position: { value: res.data.position },
                email: { value: res.data.email },
                hiredate: { value: moment(res.data.hiredate) },
                visitsNumber: { value: res.data.visitsNumber },
                finalIp: { value: res.data.finalIp },
                lastLogintime: { value: res.data.lastLogintime },
                telephone: { value: res.data.telephone },
                wechat: { value: res.data.wechat },
            });
        }
    }

    startEdit() {
        this.setState({
            prohibitEdit: false
        });
    }

    cancelEdit() {
        this.setState({
            prohibitEdit: true
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                message.error(err);
                return;
            }
            fieldsValue.hiredate = Date.parse(fieldsValue.hiredate);
            this.updateInfo(fieldsValue);
        });
    }

    async updateInfo(fieldsValue) {
        this.cancelEdit();
        let res = await yxFetch(REQ_URL.USER_UPDATE, fieldsValue);
        if (res.code !== 0) {
            message.error('保存失败');
        }
    }

    render() {
        const formMethods = this.props.form;
        const { getFieldDecorator } = formMethods;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 5 },
        };
        return (
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <div className={style.buttonLeft}>
                    {
                        this.state.prohibitEdit ? <Button type='primary' onClick={this.startEdit.bind(this)}>编辑</Button> : null
                    }
                    {
                        !this.state.prohibitEdit ? <Button type='primary' htmlType='submit'>保存</Button> : null
                    }
                </div>
                <div className={style.buttonRight}>
                    {
                        !this.state.prohibitEdit ? <Button onClick={this.cancelEdit.bind(this)}>取消</Button> : null
                    }
                </div>
                <div className={style.controlline}></div>
                <FormItem
                    {...formItemLayout}
                    label='id'
                >
                    {getFieldDecorator('id')(
                        <Input disabled={true}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='所属部门'
                >
                    {getFieldDecorator('department', {
                        rules: [{
                            type: 'string', message: 'The input is not valid department!',
                        }, {
                            required: true, message: 'Please input your department!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='用户名'
                >
                    {getFieldDecorator('userName', {
                        rules: [{
                            type: 'string', message: 'The input is not valid username!',
                        }, {
                            required: true, message: 'Please input your username!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='密码'
                >
                    {getFieldDecorator('userPassword', {
                        rules: [{
                            type: 'string', message: 'The input is not valid username!',
                        }, {
                            required: false, message: 'Please input your username!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='真实姓名'
                >
                    {getFieldDecorator('realName', {
                        rules: [{
                            type: 'string', message: 'The input is not valid name!',
                        }, {
                            required: true, message: 'Please input your name!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='职位'
                >
                    {getFieldDecorator('position', {
                        rules: [{
                            type: 'string', message: 'The input is not valid position!',
                        }, {
                            required: true, message: 'Please input your position!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='权限'
                >
                    {getFieldDecorator('permissions', {
                        rules: [{
                            type: 'string', message: 'The input is not valid E-mail!',
                        }, {
                            required: false, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='邮箱'
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='入职日期'
                >
                    {getFieldDecorator('hiredate', {
                        rules: [{ type: 'object', required: true, message: 'Please select time!' }],
                    })(
                        <DatePicker disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='访问次数'
                >
                    {getFieldDecorator('visitsNumber', {
                        rules: [{
                            type: 'number', message: 'The input is not valid number',
                        }, {
                            required: false, message: 'Please input your number!',
                        }],
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='最后IP'
                >
                    {getFieldDecorator('finalIp', {
                        rules: [{
                            type: 'string', message: 'The input is not valid E-mail!',
                        }, {
                            required: false, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='最后登录'
                >
                    {getFieldDecorator('lastLogintime', {
                        rules: [{
                            type: 'string', message: 'The input is not valid E-mail!',
                        }, {
                            required: false, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input disabled={true}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='手机'
                >
                    {getFieldDecorator('telephone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }],
                    })(
                        <Input disabled={this.state.prohibitEdit} addonBefore={getFieldDecorator('prefix', {
                            initialValue: '86',
                        })(
                            <Select style={{ width: 70 }}>
                                <Select.Option value='86'>+86</Select.Option>
                                <Select.Option value='87'>+87</Select.Option>
                            </Select>
                        )} style={{ width: '100%' }}/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='微信'
                >
                    {getFieldDecorator('wechat', {
                        rules: [{
                            type: 'string', message: 'The input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input disabled={this.state.prohibitEdit}/>
                    )}
                </FormItem>

            </Form>
        );
    }
}

const UserInfo = Form.create()(UserInfoComponent);
export default UserInfo;
