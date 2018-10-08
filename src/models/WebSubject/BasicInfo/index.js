import React, { Component } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import copy from 'copy-to-clipboard';
import Upload from '../../../components/Upload';
import { getBaseUrl, getYearBaseUrl } from '../url';
import { handleImgUrl } from '../../../utils/util';
import style from './index.module.css';
import fetcher from '../../../utils/fetch';
import { REQ_URL } from '../../../constants/constants';

const FormItem = Form.Item;
const Option = Select.Option;

const SUBJECT_TYPE = ['普通专题', '年度专题'];

class BasicInfoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            shareTitle: '',
            shareDesc: '',
            shareImg: '',
            type: 0,
        };
    }
    componentDidMount() {
        if (this.props.subjectId) {
            this.getInitData();
        }
    }
    uploadDone = (scale, shareImg) => {
        this.setState({
            shareImg
        });
        this.props.form.setFieldsValue({ shareImg });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log('this.props.form', this.props.form);
        this.props.form.validateFields((err, values) => {
            console.log('values', values);
            values.type = this.state.type;
            if (err) return message.error('配置不完整，无法保存');
            let params = { ...values };
            let id = this.props.subjectId;
            params.name = params.title;
            // 开始改变信息，有id编辑无id新增
            if (id) {
                params.id = id;
                this.props.updateSubject(params);
                // console.log(params)
            } else {
                this.props.addDateSubject(params);
            }
        });
    }
    // 如果是编辑初始化数据
    getInitData = async() => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DETAIL, { id: this.props.subjectId });
        if (res.code === 0) {
            const configData = res.data;
            console.log(configData);
            // console.log(configData)
            this.setState({
                title: configData.title,
                shareTitle: configData.shareTitle,
                shareDesc: configData.shareDesc,
                shareImg: configData.shareImg,
                type: configData.type,
            });
        }
    }
    // 复制方法
    spanCopy = (url) => {
        copy(url);
        message.success('复制成功');
    }
    // 生成dom
    urlPre = (type) => {
        let baseUrl = '';
        let mod = '';
        if (type === 'Web') {
            baseUrl = this.state.type ? `${getBaseUrl('www')}/${this.props.subjectId}` : `${getYearBaseUrl('www')}/${this.props.subjectId}`;
            mod = 'PC：';
        } else if (type === 'App') {
            baseUrl = `${getBaseUrl('m')}/${this.props.subjectId}`;
            mod = 'M站：';
        }
        return (
            <div className={style['basic-url']}>
                <span className={style['url-copy']}>{mod}{baseUrl}</span>
                <span onClick={() => { this.spanCopy(baseUrl); }} className={style['basic-copy']}>复制</span>
                <a className={style['basic-copy']} style={{ marginLeft: 50, textDecoration: 'none' }} target='_blank' href={baseUrl}>前往</a>
            </div>
        );
    }

    handleLayoutChange = (type) => {
        this.setState({
            type
        });
    }

    render() {
        const { subjectId } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 18 }};
        const formSortLayout = { labelCol: { span: 3 }, wrapperCol: { span: 15 }};
        return (
            <Form onSubmit={this.handleSubmit} className={style['basic-info']}>
                <FormItem {...formItemLayout} label='页面标题'>
                    {getFieldDecorator('title', { initialValue: this.state.title, rules: [{ required: true, message: '必填项' }, { max: 50, message: '最多50字' }] })(
                        <Input placeholder='请输入页面标题'/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='专题类型'
                >
                    {getFieldDecorator('type', { initialValue: SUBJECT_TYPE[this.state.type], rules: [{ required: true, message: '必填项' }] })(
                        <Select onChange={this.handleLayoutChange}>
                            {
                                SUBJECT_TYPE && SUBJECT_TYPE.map((item, index) => {
                                    return (
                                        <Option key={index}>{item}</Option>
                                    );
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                {
                    subjectId ? <FormItem {...formSortLayout} label='环境地址'>
                        <div>
                            {this.urlPre('App')}
                            {this.urlPre('Web')}
                        </div>
                    </FormItem> : ''
                }
                <h3 className={style['basic-title']}>分享信息</h3>
                <FormItem {...formItemLayout} label='分享标题'>
                    {getFieldDecorator('shareTitle', { initialValue: this.state.shareTitle, rules: [{ required: true, message: '必填项' }, { max: 50, message: '最多50字' }] })(
                        <Input placeholder='请输入分享标题'/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label='分享描述'>
                    {getFieldDecorator('shareDesc', { initialValue: this.state.shareDesc, rules: [{ required: true, message: '必填项' }, { max: 100, message: '最多100字' }] })(
                        <Input placeholder='请输入分享描述'/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label='分享图片'>
                    {getFieldDecorator('shareImg', {
                        rules: [{ required: true, message: '请上传图片' }],
                        initialValue: this.state.shareImg ? this.state.shareImg : ''
                    })(
                        <Upload
                            figureWidth={100}
                            figureHeight={100}
                            uploadDone={this.uploadDone}
                            showImgUrl={this.state.shareImg}
                            imgScaleText='1:1(建议150*150)'
                            showOrigin={true}
                        />
                    )}
                </FormItem>
                <Button style={{ marginLeft: '12.5%' }} key='submit' type='primary' htmlType='submit'>保存</Button>
            </Form>
        );
    }
}

export default Form.create()(BasicInfoConfig);
