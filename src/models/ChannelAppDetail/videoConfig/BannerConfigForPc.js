import React, { Component } from 'react';
import style from './newStyle.module.css';
import { Form, Switch, Input, Button, Popconfirm } from 'antd';
import Upload from '../../../components/Upload';

import { imgPrefix } from '../../../utils/index';

const FormItem = Form.Item;

class BannerConfig extends Component {
    state = {
        imageUrl: this.props.banner ? `${imgPrefix}${this.props.banner.imageUrl}` : '',
        imageKey: this.props.banner && this.props.banner.imageUrl
    }

    modifyBannersConfig = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const bannerOn = Number(values.bannerOn);
                await this.props.enableBanner(bannerOn);
            }
        });
    }

    handleSaveBanner = (e) => {
        e.preventDefault();
        const { banner } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = { ...banner, ...values, imageUrl: this.state.imageKey };
                this.props.handleSaveBanner(data);
            }
        });
    }

    uploadDone = async(imgScale, key) => {
    // const imageUrl = `${imgPrefix}${key}`
        this.setState({
            imageUrl: key,
            imageKey: key
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.banner && this.props.banner !== nextProps.banner) {
            this.props.form.resetFields();
            const imageUrl = nextProps.banner.imageUrl ? `${imgPrefix}${nextProps.banner.imageUrl}` : '';
            this.setState({
                imageUrl: imageUrl,
                imageKey: nextProps.banner.imageUrl
            });
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
        };
        // const smallItemLayout = {
        //   labelCol: { span: 8 },
        //   wrapperCol: { span: 8 },
        // }
        const { channel, addBanner, bannerNumber, configType, banner, deleteBanner } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { imageUrl } = this.state;
        if (configType === 0) {
            return (
                <Form onSubmit={this.modifyBannersConfig} style={{ overflow: 'hidden', paddingTop: '15px' }}>
                    <h2 className={style.title}>配置</h2>
                    <FormItem
                        {...formItemLayout}
                        label='组件类型'
                    >
                        <span className='ant-form-text'>banner</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='banner数量'
                    >
                        <span className='ant-form-text'>{bannerNumber + '/7'}</span>
                    </FormItem>
                    {
                        channel &&
            <FormItem
                {...formItemLayout}
                label='启用组件'>
                {getFieldDecorator('bannerOn', { valuePropName: 'checked', initialValue: Boolean(channel && channel.bannerOn) })(
                    <Switch/>
                )}
            </FormItem>
                    }
                    <Button style={{ marginLeft: '153px' }} key='add' type='primary' onClick={addBanner}>添加</Button>
                    <Button style={{ marginLeft: '20px' }} key='submit' type='primary' htmlType='submit'>保存</Button>
                </Form>
            );
        } else {
            return (
                <Form onSubmit={this.handleSaveBanner} style={{ overflow: 'hidden', paddingTop: '15px' }}>
                    <h2 className={style.title}>配置</h2>
                    <FormItem
                        {...formItemLayout}
                        label='组件类型'
                    >
                        <span className='ant-form-text'>banner</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='banner标题'>
                        {getFieldDecorator('title', { initialValue: banner && banner.title, rules: [{ required: true, max: 12, message: '最多字数为12个' }] })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='二级标题'>
                        {getFieldDecorator('secondTitle', { initialValue: banner && banner.secondTitle, rules: [{ max: 16, message: '最多字数为16个' }] })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='跳转url'>
                        {getFieldDecorator('schemeUrl', { initialValue: banner && banner.schemeUrl, rules: [{ required: true, message: '跳转url是必填项' }] })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传图片'
                        required
                    >
                        <Upload
                            figureWidth={ 160 }
                            figureHeight={ 40 }
                            uploadDone={this.uploadDone}
                            showImgUrl={imageUrl}
                            imgScale='4'
                            imgScaleText='4:1'
                        />
                    </FormItem>
                    <Button style={{ marginLeft: '153px' }} key='add' type='primary' onClick={addBanner}>添加banner</Button>
                    <Button style={{ marginLeft: '20px' }} key='submit' type='primary' htmlType='submit'>保存</Button>
                    <Popconfirm title='你确定删除一个banner吗?' onConfirm={() => deleteBanner(banner)} okText='是' cancelText='否'>
                        <Button style={{ marginLeft: '20px' }} key='delete' type='primary'>删除banner</Button>
                    </Popconfirm>
                </Form>
            );
        }
    }
}

export default Form.create()(BannerConfig);
