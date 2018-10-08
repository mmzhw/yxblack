import React, { Component } from 'react';
import { Select } from 'antd';
const Option = Select.Option;

export default class SingleSelRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            label: props.label,
            optLabel: props.optLabel ? props.optLabel : '',
            value: props.value ? props.value : props.mode ? [] : '',
            labelCol: props.labelCol ? props.labelCol : 2,
            wrapperCol: props.wrapperCol ? props.wrapperCol : 6,
            disabled: props.disabled ? props.disabled : false,
            required: props.required,
            message: props.message,
        };

        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.value) {
            this.setState({
                value: props.value
            });
        }
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        const Form = this.props.formEle;
        const FormItem = Form.Item;
        const formMethods = this.props.formMethods;
        const { getFieldDecorator } = formMethods;
        const formItemLayout = {
            labelCol: { span: this.state.labelCol },
            wrapperCol: { span: this.state.wrapperCol },
        };

        return (
            <FormItem
                {...formItemLayout}
                label={this.state.label}
            >
                {getFieldDecorator(this.state.id, {
                    rules: [{
                        required: this.state.required,
                        message: this.state.message,
                    }],
                    initialValue: this.props.initialValue,
                    onChange: this.onChange,
                })(
                    <Select
                        id = { this.state.id }
                        showArrow = { this.props.showArrow }
                    >
                        {this.props.selList && this.props.selList.map((select, index) => (
                            <Option value={select[this.props.optVal] + ''} key={index}>
                                {select[this.props.optLabel + '']}
                            </Option>
                        ))}
                    </Select>
                )}
            </FormItem>
        );
    }
}

