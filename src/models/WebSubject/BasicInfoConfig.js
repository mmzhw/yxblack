import React, { Component } from 'react';
import { Button, Form, Input, message } from 'antd';
import Upload from '../../components/Upload';
import PropTypes from 'prop-types';
import { getBaseUrl } from './url';
import fetcher from 'Util/fetch';
import { REQ_URL } from '../../constants/constants';

const FormItem = Form.Item;

class BasicInfoConfig extends Component {
    static PropTypes = {
        subjectId: PropTypes.number
    }

    state = {
        configData: {
            shareImg: ''
        }
    }

    uploadDone = (imgScale, key) => {
        this.setState({
            configData: {
                ...this.state.configData,
                shareImg: key
            }
        });
    }

    // 需要验证图片
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                const { configData } = this.state;
                const { shareImg } = configData;
                if (!shareImg) return message.error('请上传图片');
                values = {
                    ...configData,
                    ...values,
                    id: this.props.subjectId,
                    name: '中国国际时装周'
                };
                await this.updateSubject(values);
                await this.getInitData();
                this.props.form.resetFields();
            } else {
                message.error(err);
            }
        });
    }

    updateSubject = async(values) => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_UPDATE, values);
        if (res.code === 0) {
            message.success('更新成功');
        } else {
            message.error(res.errmsg);
        }
    }

    cancel = () => {
        this.props.form.resetFields();
        const { configData } = this.state;
        this.setState({
            configData: {
                ...configData
            }
        });
    }

    getInitData = async() => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DETAIL, { id: this.props.subjectId });
        if (res.code === 0) {
            const configData = res.data;
            this.setState({
                configData
            });
        }
    }

    componentDidMount() {
        this.getInitData();
    }

    render() {
        const { configData } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { subjectId } = this.props;
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/${subjectId}`;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h2>基础信息设置</h2>
                <FormItem label='页面title'>
                    {getFieldDecorator('title', { initialValue: configData.title, rules: [{ required: true, message: '必填项' }, { max: 20, message: '最多20字' }] })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem label='环境地址'>
                    <span className='ant-form-text'>{url}</span>
                </FormItem>

                <h2>分享设置</h2>
                <FormItem label='分享标题'>
                    {getFieldDecorator('shareTitle', { initialValue: configData.shareTitle, rules: [{ required: true, message: '必填项' }, { max: 20, message: '最多20字' }] })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem label='分享描述'>
                    {getFieldDecorator('shareDesc', { initialValue: configData.shareDesc, rules: [{ required: true, message: '必填项' }, { max: 20, message: '最多20字' }] })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    label='分享图片'
                >
                    <Upload
                        figureWidth={100}
                        figureHeight={100}
                        uploadDone={this.uploadDone}
                        showImgUrl={configData.shareImg}
                        imgScale='1'
                        imgScaleText='1:1'
                    />
                </FormItem>
                <Button style={{ marginLeft: '153px' }} key='submit' type='primary' htmlType='submit'>保存</Button>
                <Button style={{ marginLeft: '20px' }} key='add' type='primary' onClick={this.cancel}>取消</Button>
            </Form>
        );
    }
}

export default Form.create()(BasicInfoConfig);
