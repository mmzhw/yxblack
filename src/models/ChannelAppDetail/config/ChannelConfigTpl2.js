import React, { Component } from 'react';
import style from './channelConfig.module.css';
import { Form, Switch, Input, Button, Select, Row, Col } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

// 普通模板配置
class ChannelConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMore: this.props.more,
            timeLine: this.props.timeLine
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            values.timeLine = this.state.timeLine;
            if (!err) {
                values.sectionType = values.sectionType || '专题名称1';
                if (this.props.onSubmit) {
                    const result = await this.props.onSubmit(values);
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
    handleNumChange = (value) => {
        if (this.props.onNumChange) {
            this.props.onNumChange(Number(value));
        }
    }
    onIsMoreChange = (isMore) => {
        // debugger
        this.setState({
            isMore,
        });
    }
    onTimeLine = (timeLine) => {
        // debugger
        this.setState({
            timeLine,
        });
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.id !== this.props.id) {
            this.setState({
                isMore: nextProps.more,
                timeLine: nextProps.timeLine
            });
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 4 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 2,
            }
        };
        const { getFieldDecorator } = this.props.form;
        const { isMore } = this.state;
        const { isEnable, title, more, moreUrl, sectionsLayout, cards, loading, timeLine } = this.props;
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
                            <Switch/>
                        )}
                    </FormItem>
                    {
                        this.props.sectionsLayout === 4 ? (
                            <FormItem
                                label='时间轴'
                                {...formItemLayout}
                            >
                                {getFieldDecorator('timeLine', {
                                    valuePropName: 'checked',
                                    initialValue: timeLine ? Boolean(timeLine) : false
                                })(
                                    <Switch onChange={this.onTimeLine}/>
                                )}
                            </FormItem>
                        ) : null
                    }
                    <FormItem
                        {...formItemLayout}
                        wrapperCol={{ span: 8 }}
                        label='模板类型'>
                        <Row gutter={8}>
                            <Col span={12}>
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
                            </Col>
                            <Col span={12}>
                                {
                                    sectionsLayout === 4 || sectionsLayout === 5
                                        ? <Select
                                            value={cards[0].videos.length >= 6 ? cards[0].videos.length + '' : '6'}
                                            onChange={this.handleNumChange}
                                            style={{ width: 60 }}>
                                            <Option value='6'>6</Option>
                                            <Option value='7'>7</Option>
                                            <Option value='8'>8</Option>
                                            <Option value='9'>9</Option>
                                            <Option value='10'>10</Option>
                                            <Option value='11'>11</Option>
                                            <Option value='12'>12</Option>
                                            <Option value='13'>13</Option>
                                            <Option value='14'>14</Option>
                                            <Option value='15'>15</Option>
                                            <Option value='16'>16</Option>
                                            <Option value='17'>17</Option>
                                            <Option value='18'>18</Option>
                                            <Option value='19'>19</Option>
                                            <Option value='20'>20</Option>
                                        </Select>
                                        : null
                                }
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='专题名称1'>
                        {getFieldDecorator('sectionType', {
                            rules: [{ required: true, message: '请输入专题名称1' }],
                            initialValue: title || '专题名称1'
                        })(
                            <Input maxLength='20'/>
                        )}
                    </FormItem>
                    <FormItem
                        label='更多'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('more', {
                            valuePropName: 'checked',
                            initialValue: more ? Boolean(more) : false
                        })(
                            <Switch onChange={this.onIsMoreChange}/>
                        )}
                    </FormItem>
                    {
                        isMore
                            ? <FormItem
                                label=' ' // 空格占位
                                colon={false}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('moreUrl', {
                                    rules: [{
                                        required: true,
                                        message: '请输入URL！'
                                    }],
                                    initialValue: moreUrl
                                })(
                                    <Input placeholder='URL'/>
                                )}
                            </FormItem>
                            : <FormItem
                                label=' ' // 空格占位
                                colon={false}
                                {...formItemLayout}
                            >
                                {getFieldDecorator('moreUrl', {
                                    initialValue: moreUrl
                                })(
                                    <Input placeholder='URL'/>
                                )}
                            </FormItem>
                    }
                    <FormItem {...tailFormItemLayout}>
                        <Button key='submit' type='primary' htmlType='submit' loading={loading}>保存</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(ChannelConfig);
