import React, { Component } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

class InputRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            labelCol: props.labelCol ? props.labelCol : 2,
            wrapperCol: props.wrapperCol ? props.wrapperCol : 6,
            id: props.id,
            message: props.message ? props.message : '请输入内容',
            autosize: props.autosize ? props.autosize : false,
            type: props.type ? props.type : 'text',
            disabled: props.disabled ? props.disabled : false,
            required: props.required,
            maxlength: props.maxlength ? props.maxlength : '',
            placeholder: props.placeholder ? props.placeholder : '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.getValueFromEvent = this.getValueFromEvent.bind(this);
    }
    componentWillReceiveProps(props) {
    // this.props.formMethods.resetFields([props.id])
        this.setState({
            disabled: props.disabled,
        });
    }
    componentWillMount() {
    }
    getValueFromEvent(event) {
        if (this.props.maxlength) {
            let maxLen = parseInt(this.props.maxlength, 10);
            return event.target.value.slice(0, maxLen);
        }
        return event.target.value;
    }
    handleChange(event) {
        !!this.props.onChangeHandle && this.props.onChangeHandle(this.getValueFromEvent(event));
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
        let renderedEle = <Input
            id = { this.state.id }
            type = { this.state.type }
            disabled = { this.state.disabled }
            placeholder = { this.state.placeholder }
        />;
        if (this.state.autosize) {
            renderedEle = <TextArea
                id = { this.state.id }
                autosize = { this.state.autosize }
                type = { this.state.type }
                disabled = { this.state.disabled }
            />;
        }
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
                    getValueFromEvent: this.getValueFromEvent,
                    initialValue: this.props.initialValue,
                    onChange: this.handleChange,
                })(
                    renderedEle
                )}
            </FormItem>
        );
    }
}
export default InputRow;
