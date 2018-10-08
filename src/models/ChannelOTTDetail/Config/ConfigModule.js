import React, { Component } from 'react';
import style from './style.module.css';
import Upload from '../../../components/Upload';
import { Form, Switch, Input, Select, Button } from 'antd';
import { getImgTypeSize, handleImgUrl } from '../../../PublicTools';
const FormItem = Form.Item;

class ConfigModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconImg: props.card.iconImg || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.card !== this.props.card) {
            this.props.form.resetFields();
            this.setState({
                iconImg: nextProps.card.iconImg || '',

            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                if (this.props.saveModuleData) {
                    values.isEnable = values.isEnable ? 1 : 0;
                    values.isMore = values.isMore ? 1 : 0;
                    values.layoutId = Number(values.layoutId);
                    values.loop = Number(values.loop);
                    values.iconImg = this.state.iconImg || '';
                    const result = await this.props.saveModuleData(values);
                    if (result) {
                        this.props.form.resetFields();
                    }
                }
            }
        });
    }

    // 更新图片
    uploadDone(scale, iconImg) {
        this.setState({
            iconImg: iconImg,
        });
    }

    render() {
        let formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 4 },
        };

        let tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 2,
            }
        };

        let { getFieldDecorator } = this.props.form;
        let { card, channelName, currentCardsIndex } = this.props;

        // 这块判断纯属废代码，因为Android不能修改成自动可适应，只能在后台加定死的选择配置
        let moduleSelete = '';
        if (channelName === '精选推荐') {
            if (currentCardsIndex === 0) {
                moduleSelete = (<Select
                    onChange={this.props.changeModule}>
                    <Select.Option value='2'>模板2(1个726*362，3个272*362)</Select.Option>
                </Select>);
            } else {
                moduleSelete = (<Select
                    onChange={this.props.changeModule}>
                    <Select.Option value='1'>模板1(4个426*240)</Select.Option>
                    <Select.Option value='3'>模板3(6个320*426)</Select.Option>
                    <Select.Option value='5'>模板5(2个885*450)</Select.Option>
                    <Select.Option value='6'>模板6(1个726*362，2个272*362)</Select.Option>
                    <Select.Option value='7'>模板7(6个275*155)</Select.Option>
                </Select>);
            }
        } else if (channelName === '新城镇') {
            if (currentCardsIndex === 0) {
                moduleSelete = (<Select
                    onChange={this.props.changeModule}>
                    <Select.Option value='5'>模板5(2个885*450)</Select.Option>

                </Select>);
            } else {
                moduleSelete = (<Select
                    onChange={this.props.changeModule}>
                    <Select.Option value='1'>模板1(4个426*240)</Select.Option>
                    <Select.Option value='2'>模板2(1个726*362，3个272*362)</Select.Option>
                    <Select.Option value='3'>模板3(6个320*426)</Select.Option>
                    <Select.Option value='6'>模板6(1个726*362，2个272*362)</Select.Option>
                    <Select.Option value='7'>模板7(6个275*155)</Select.Option>
                </Select>);
            }
        } else if (channelName === '电视剧' || channelName === '电影' || channelName === '综艺') {
            if (currentCardsIndex === 0) {
                moduleSelete = (<Select
                    onChange={this.props.changeModule}>
                    <Select.Option value='6'>模板6(1个726*362，2个272*362)</Select.Option>
                </Select>);
            } else {
                moduleSelete = (<Select
                    onChange={this.props.changeModule}>
                    <Select.Option value='1'>模板1(4个426*240)</Select.Option>
                    <Select.Option value='2'>模板2(1个726*362，3个272*362)</Select.Option>
                    <Select.Option value='3'>模板3(6个320*426)</Select.Option>
                    <Select.Option value='5'>模板5(2个885*450)</Select.Option>
                    <Select.Option value='7'>模板7(6个275*155)</Select.Option>
                </Select>);
            }
        } else if (channelName === '资讯') {
            moduleSelete = (<Select
                onChange={this.props.changeModule}>
                <Select.Option value='1'>模板1(4个426*240)</Select.Option>
            </Select>);
        } else if (channelName === '更多') {
            moduleSelete = (<Select
                onChange={this.props.changeModule}>
                <Select.Option value='4'>模板4(3个342*730，6个320*350)</Select.Option>
            </Select>);
        } else {
            moduleSelete = (<Select
                onChange={this.props.changeModule}>
                <Select.Option value='1'>模板1(4个426*240)</Select.Option>
                <Select.Option value='2'>模板2(1个726*362，3个272*362)</Select.Option>
                <Select.Option value='3'>模板3(6个320*426)</Select.Option>
                <Select.Option value='4'>模板4(3个342*730，6个320*350)</Select.Option>
                <Select.Option value='5'>模板5(2个885*450)</Select.Option>
                <Select.Option value='6'>模板6(1个726*362，2个272*362)</Select.Option>
                <Select.Option value='7'>模板7(6个275*155)</Select.Option>
            </Select>);
        }

        return (
            <div className={style.configModule}>
                <p>配置</p>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label='组件类型'
                    >
                        <span className='ant-form-text'>专题卡片</span>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='专辑名称'>
                        {getFieldDecorator('layoutName', {
                            rules: [{ required: true, message: '请输入专辑名称' }],
                            initialValue: card.layoutName
                        })(
                            <Input maxLength='20'/>
                        )}
                    </FormItem>

                    <FormItem
                        label='状态'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('isEnable', {
                            valuePropName: 'checked',
                            initialValue: Boolean(this.props.card.isEnable),
                        })(
                            <Switch />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        wrapperCol={{ span: 8 }}
                        label='模板类型'
                    >
                        {getFieldDecorator('layoutId', {
                            rules: [{ required: true, message: '请选择模板类型' }],
                            initialValue: String(card.layoutId)
                        })(moduleSelete)}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        wrapperCol={{ span: 8 }}
                        label='循环次数'
                    >
                        {getFieldDecorator('loop', {
                            initialValue: String(card.loop)
                        })(
                            <Select
                                onChange={this.props.changeLoop}>
                                <Select.Option value='0'>0</Select.Option>
                                <Select.Option value='1'>1</Select.Option>
                                <Select.Option value='2'>2</Select.Option>
                                <Select.Option value='3'>3</Select.Option>
                                <Select.Option value='4'>4</Select.Option>
                            </Select>
                        )}

                    </FormItem>

                    <FormItem
                        label='更多'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('isMore', {
                            valuePropName: 'checked',
                            initialValue: Boolean(this.props.card.isMore),
                        })(
                            <Switch/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='地址'>
                        {getFieldDecorator('moreUrl', {
                            initialValue: this.props.card.moreUrl
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='图标'
                    >
                        <Upload
                            imgScale={getImgTypeSize(5).scale}
                            figureWidth={getImgTypeSize(5).width}
                            figureHeight={getImgTypeSize(5).height}
                            uploadDone={this.uploadDone.bind(this)}
                            showImgUrl={handleImgUrl(this.state.iconImg)}
                        />
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button key='submit' type='primary' htmlType='submit' loading={this.props.loading} style={{ marginRight: '20px' }}>保存</Button>
                        <Button type='primary' onClick={this.props.deleteModule.bind(this)}>删除</Button>
                    </FormItem>

                </Form>
            </div>
        );
    }
}
export default Form.create()(ConfigModule);
