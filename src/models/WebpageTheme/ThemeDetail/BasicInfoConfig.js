import React, { Component } from 'react';
import { Form, Input, Select, Button, message, List } from 'antd';
import copy from 'copy-to-clipboard';
import Upload from '../../../components/Upload';
import fetcher from '../../../utils/fetch';
import { REQ_URL } from '../../../constants/constants';
import { SUBJECT_TYPE } from '../../../constants';
import { getYearBaseUrl, getBaseUrl } from '../url';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 18 }};

class BasicInfoConfig extends Component {
    constructor (props) {
        super(props);
        this.state = {
            initInfo: {}
        };
    }
    componentDidMount () {
        const { id } = this.props;
        id && this.getInitData(id);
    }
    getInitData = async (id) => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DETAIL, { id });
        res.code === 0 && this.setState({ initInfo: res.data });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, params) => {
            if (err) return message.error('配置不完整，无法保存');
            const res = await fetcher(REQ_URL.SPECIAL_CARD_ADD, params);
            if (res.code === 0) {
                message.success('更新成功');
                await this.getInitData(this.props.id);
                this.props.form.resetFields();
            } else {
                message.error(res.errmsg);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={{ maxWidth: '800px', paddingTop: '30px' }}>
                <FormItem {...formItemLayout} label='页面标题'>
                    {getFieldDecorator('title', { initialValue: this.state.initInfo.title, rules: [{ required: true, message: '必填项' }, { max: 50, message: '最多50字' }] })(
                        <Input placeholder='请输入页面标题'/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='专题类型'
                >
                    {getFieldDecorator('type', { initialValue: this.state.initInfo.type, rules: [{ required: true, message: '必填项' }] })(
                        <Select>
                            {
                                SUBJECT_TYPE && SUBJECT_TYPE.map((item, index) => {
                                    return (
                                        <Option key={index} value={index}>{item}</Option>
                                    );
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                {
                    this.props.id ? <FormItem {...formItemLayout} label='环境地址'>
                        <List
                            style={{ width: '100%' }}
                            bordered
                            dataSource={[
                                ['PC站', Number(getFieldValue('type')) ? `${getYearBaseUrl('www')}/${this.props.id}` : `${getBaseUrl('www')}/${this.props.id}`],
                                ['M站', `${getBaseUrl('www')}/${this.props.id}`]
                            ]}
                            renderItem={item => (
                                <List.Item
                                    actions={
                                        [<a onClick={ () => { copy(item[1]); message.success('复制成功'); }}>复制地址</a>]
                                    }
                                >
                                    <span>{item[0]}：</span>
                                    <a href={item[1]} target='_blank'>{item[1]}</a>
                                </List.Item>
                            )}
                        />
                    </FormItem> : ''
                }
                <FormItem {...formItemLayout} label='分享标题'>
                    {getFieldDecorator('shareTitle', { initialValue: this.state.initInfo.shareTitle, rules: [{ required: true, message: '必填项' }, { max: 50, message: '最多50字' }] })(
                        <Input placeholder='请输入分享标题'/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label='分享描述'>
                    {getFieldDecorator('shareDesc', { initialValue: this.state.initInfo.shareDesc, rules: [{ required: true, message: '必填项' }, { max: 100, message: '最多100字' }] })(
                        <TextArea placeholder='请输入分享描述' rows={4} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label='分享图片'>
                    {getFieldDecorator('shareImg', {
                        rules: [{ required: true, message: '请上传图片' }],
                        initialValue: this.state.initInfo.shareImg
                    })(
                        <Upload
                            figureWidth={100}
                            figureHeight={100}
                            showImgUrl={getFieldValue('shareImg') || ''}
                            showOrigin={true}
                            imgScaleText='1:1 (建议150*150)'
                        />
                    )}
                </FormItem>
                <FormItem
                    wrapperCol={{
                        xs: { span: 21, offset: 3 },
                        sm: { span: 21, offset: 3 },
                    }}
                >
                    <Button key='submit' type='primary' htmlType='submit'>保存</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(BasicInfoConfig);
