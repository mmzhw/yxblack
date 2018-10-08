import React, { Component } from 'react';
import { Select } from 'antd';
const Option = Select.Option;

class SelRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            mode: props.mode ? props.mode : '',
            label: props.label,
            optLabel: props.optLabel ? props.optLabel : '',
            value: props.value ? props.value : props.mode ? [] : '',
            filterOption: props.filterOption === undefined ? true : props.filterOption,

            labelCol: props.labelCol ? props.labelCol : 2,
            wrapperCol: props.wrapperCol ? props.wrapperCol : 6,
            message: props.message ? props.message : '请至少选一个',
            disabled: props.disabled ? props.disabled : false,
            required: props.required,
        };

        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.value) {
            this.setState({
                value: props.value
            });
        }
    }

    onChange(value) {
        this.props.onChange(value);
    }

    onSearch(word) {
        if (this.props.onSearch) {
            this.props.onSearch(word);
        }
    }

    onSelect(value) {
        if (this.props.onSelect) {
            this.props.onSelect(value);
        }
    }

    onFocus() {
        if (this.props.onFocus) {
            this.props.onFocus();
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
        let selectStyle = this.props.selectStyle || { width: '100%' };
        return (
            <FormItem
                {...formItemLayout}
                hasFeedback
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
                        mode = { this.state.mode }
                        id = { this.state.id }
                        onSelect = { this.onSelect }
                        filterOption = { this.state.filterOption }
                        onSearch = { this.onSearch }
                        disabled = { this.state.disabled }
                        style={ selectStyle }
                        showArrow = { this.props.showArrow }
                        labelInValue = { this.props.labelInValue }
                        optionLabelProp = { this.props.optionLabelProp }
                        onFocus = { this.onFocus }
                        dropdownStyle = { this.props.dropdownStyle }
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

export default SelRow;
