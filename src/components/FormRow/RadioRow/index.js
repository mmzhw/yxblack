import React, { Component } from 'react';
import { Radio } from 'antd';
const RadioGroup = Radio.Group;

class RadioRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            label: props.label,
            labelCol: props.labelCol ? props.labelCol : 2,
            wrapperCol: props.wrapperCol ? props.wrapperCol : 4,
            radioMap: props.radioMap ? props.radioMap : {},
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props) {
            this.setState({
                value: props.value ? props.value : ''
            });
        }
    }

    onChange(e) {
        this.props.onChange(e.target.value);
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
                hasFeedback
                label={this.state.label}
            >
                {getFieldDecorator(this.state.id, {
                    rules: [{
                        required: this.state.required,
                        message: this.state.message,
                    }],
                    onChange: this.onChange,
                    initialValue: this.props.initialValue,
                })(
                    <RadioGroup>
                        {Object.keys(this.state.radioMap).map((key, idx) => (
                            <Radio value={key} key={idx}> { this.state.radioMap[key] } </Radio>
                        ))}
                    </RadioGroup>
                )}
            </FormItem>
        );
    }
}

export default RadioRow;
