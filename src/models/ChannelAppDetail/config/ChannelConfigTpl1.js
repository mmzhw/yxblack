import React, { Component } from 'react';
import style from './channelConfig.module.css';
import { Form, Switch, Input, Button, Select } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

// 两个模板组合的特殊配置
class ChannelConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked1: this.props.cards[0] ? this.props.cards[0].more : false,
            checked2: this.props.cards[1] ? this.props.cards[1].more : false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.card1Title = values.card1Title || '专题名称1';
                values.card2Title = values.card2Title || '专题名称2';
                if (this.props.onSubmit) {
                    const result = await this.props.onSubmit(values, 1);
                    if (result) {
                        this.props.form.resetFields();
                    }
                }
            }
        });
    }
    handleSelectChange = (value) => {
        if (this.props.onLayoutChange) {
            this.props.onLayoutChange(value);
        }
    }
    onIsMore1Change = (checked) => {
        this.setState({
            checked1: checked,
        });
    }
    componentWillReceiveProps = (nextProps) => {
    // debugger
        if (nextProps.id !== this.props.id) {
            this.setState({
                checked1: nextProps.cards[0].more,
                checked2: nextProps.cards[1].more,
            });
        }
    }
    onIsMore2Change = (checked) => {
        this.setState({
            checked2: checked,
        });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 4 },
        };
        const smallItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 4,
            }
        };
        const { getFieldDecorator } = this.props.form;
        const { checked1, checked2 } = this.state;
        const { isEnable, sectionsLayout, cards, loading } = this.props;
        return (
            <div className={style['config-wrap']}>
                <h2 className={style['title']}>配置</h2>
                <Form style={{ overflow: 'hidden', paddingTop: '15px' }} onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label='组件类型'
                    >
                        <span className='ant-form-text'>专题卡片</span>
                    </FormItem>
                    <FormItem
                        label='状态'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('isEnable', {
                            valuePropName: 'checked',
                            initialValue: isEnable ? Boolean(isEnable) : false
                        })(
                            <Switch />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='模板类型'>
                        {getFieldDecorator('sectionsLayout', {
                            initialValue: String(sectionsLayout)
                        })(
                            <Select onChange={this.handleSelectChange}>
                                <Option value='1'>模板1：（12张，2*3+2*3）</Option>
                                <Option value='2'>模板2：（9张，1*1+2*4）</Option>
                                <Option value='3'>模板3：横图（12张，2*6）</Option>
                                <Option value='4'>模板4：横图单行，数量可选</Option>
                                <Option value='5'>模板5：竖版单行，数量可选</Option>
                                <Option value='6'>模板6：竖图（12张，2*6）</Option>
                            </Select>
                        )}
                    </FormItem>
                    <div className={style['subject-area']}>
                        <div className={style['subject']}>
                            <FormItem
                                {...smallItemLayout}
                                label='专题名称1'>
                                {getFieldDecorator('card1Title', {
                                    rules: [{ required: true, message: '请输入专题名称1' }],
                                    initialValue: cards[0] ? cards[0].title : '专题名称1'
                                })(
                                    <Input maxLength='20'/>
                                )}
                            </FormItem>
                            <FormItem
                                label='更多'
                                {...smallItemLayout}
                            >
                                {getFieldDecorator('card1More', {
                                    valuePropName: 'checked',
                                    initialValue: cards[0] && cards[0].more ? Boolean(cards[0].more) : false
                                })(
                                    <Switch onChange={this.onIsMore1Change}/>
                                )}
                            </FormItem>
                            {
                                checked1
                                    ? <FormItem
                                        {...smallItemLayout}
                                        colon={false}
                                        label=' '>
                                        {getFieldDecorator('card1MoreUrl', {
                                            rules: [{
                                                required: true,
                                                message: '请输入URL！'
                                            }],
                                            initialValue: cards[0] && cards[0].moreUrl
                                        })(
                                            <Input placeholder='URL'/>
                                        )}
                                    </FormItem>
                                    : <FormItem
                                        {...smallItemLayout}
                                        colon={false}
                                        label=' '>
                                        {getFieldDecorator('card1MoreUrl', {
                                            initialValue: cards[0] && cards[0].moreUrl
                                        })(
                                            <Input placeholder='URL'/>
                                        )}
                                    </FormItem>
                            }
                        </div>
                        <div className={style['subject']}>
                            <FormItem
                                {...smallItemLayout}
                                label='专题名称2'>
                                {getFieldDecorator('card2Title', {
                                    rules: [{ required: true, message: '请输入专题名称2' }],
                                    initialValue: cards[1] ? cards[1].title : '专题名称2'
                                })(
                                    <Input maxLength='20'/>
                                )}
                            </FormItem>
                            <FormItem
                                label='更多'
                                {...smallItemLayout}
                            >
                                {getFieldDecorator('card2More', {
                                    valuePropName: 'checked',
                                    initialValue: cards[1] && cards[1].more ? Boolean(cards[1].more) : false
                                })(
                                    <Switch onChange={this.onIsMore2Change}/>
                                )}
                            </FormItem>
                            {
                                checked2
                                    ? <FormItem
                                        {...smallItemLayout}
                                        colon={false}
                                        label=' '>
                                        {getFieldDecorator('card2MoreUrl', {
                                            rules: [{
                                                required: true,
                                                message: '请输入URL！'
                                            }],
                                            initialValue: cards[1] && cards[1].moreUrl
                                        })(
                                            <Input placeholder='URL'/>
                                        )}
                                    </FormItem>
                                    : <FormItem
                                        {...smallItemLayout}
                                        colon={false}
                                        label=' '>
                                        {getFieldDecorator('card2MoreUrl', {
                                            initialValue: cards[1] && cards[1].moreUrl
                                        })(
                                            <Input placeholder='URL'/>
                                        )}
                                    </FormItem>
                            }
                        </div>
                    </div>
                    <FormItem {...tailFormItemLayout}>
                        <Button key='submit' type='primary' htmlType='submit' loading={loading}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(ChannelConfig);
