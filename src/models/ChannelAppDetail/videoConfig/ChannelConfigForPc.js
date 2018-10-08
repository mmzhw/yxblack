import React, { Component } from 'react';
import style from './newStyle.module.css';
import { Form, Switch, Input, Button, Select } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class ChannelConfigForPc extends Component {
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
        };
        const smallItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form style={{ overflow: 'hidden', paddingTop: '15px' }}>
                <h2 className={style.title}>配置</h2>
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
                    {getFieldDecorator('enable', {
                        valuePropName: 'checked',
                        // initialValue: modalChannel ? Boolean(modalChannel.enable) : false
                    })(
                        <Switch />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='模板类型'>
                    {getFieldDecorator('type')(
                        <Select defaultValue='lucy' style={{ width: 120 }}>
                            <Option value='jack'>Jack</Option>
                            <Option value='lucy'>Lucy</Option>
                            <Option value='disabled' disabled>Disabled</Option>
                            <Option value='Yiminghe'>yiminghe</Option>
                        </Select>
                    )}
                </FormItem>
                <div className={style['subject-area']}>
                    <div className={style['subject']}>
                        <FormItem
                            {...smallItemLayout}
                            label='专题名称1'>
                            {getFieldDecorator('type')(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label='更多'
                            {...formItemLayout}
                        >
                            {getFieldDecorator('enable', {
                                valuePropName: 'checked',
                                // initialValue: modalChannel ? Boolean(modalChannel.enable) : false
                            })(
                                <Switch />
                            )}
                        </FormItem>
                        <FormItem
                            {...smallItemLayout}
                            label='URL'>
                            {getFieldDecorator('type')(
                                <Input />
                            )}
                        </FormItem>
                    </div>
                </div>
                <Button style={{ marginLeft: '153px' }} key='submit' type='primary' htmlType='submit'>保存</Button>
            </Form>
        );
    }
}

export default Form.create()(ChannelConfigForPc);
