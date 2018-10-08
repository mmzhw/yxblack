import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

class DPRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            txtWidth: props.txtWidth ? props.txtWidth : '300px',
            id: props.id,
            // native antd apis for datepicker
            allowClear: !!(props.allowClear !== false),
            disabled: props.disabled ? props.disabled : false,
            style: props.style ? props.style : {},
            popupStyle: props.popupStyle ? props.popupStyle : {},
            size: props.size ? props.size : '',
            locale: props.locale ? props.locale : '',
            disabledDate: props.disabledDate ? props.disabledDate : '',
            getCalendarContainer: props.getCalendarContainer ? props.getCalendarContainer : '',
            open: props.open ? props.open : '',
            onOpenChange: props.onOpenChange ? props.onOpenChange : '',
            placeholder: props.placeholder ? props.placeholder : '',
            // native antd props for datepicker
            format: props.format ? props.format : 'YYYY-MM-DD',
            labelCol: props.labelCol ? props.labelCol : 2,
            wrapperCol: props.wrapperCol ? props.wrapperCol : 6,
            message: props.message ? props.message : '请输入日期',
            showTime: props.showTime,
            required: props.required,
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            disabled: props.disabled,
            initialValue: props.initialValue ? props.initialValue : new Date().getTime()
        });
    }

    onChange(date, dateString) {
        let timestamp = null;
        if (date) {
            timestamp = date.toDate().getTime();
        }
        if (this.props.onChange) {
            this.props.onChange(timestamp);
        }

        this.setState({
            value: moment(timestamp)
        });
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
                        type: 'object',
                        required: this.state.required,
                        message: this.state.message,
                    }],
                    initialValue: this.props.initialValue ? moment(this.props.initialValue) : null,
                    onChange: this.handleChange,
                })(
                    <DatePicker
                        allowClear = { this.state.allowClear }
                        showTime = { this.state.showTime }
                        format = { this.state.format }
                        onChange = { this.onChange }
                        disabled = { this.state.disabled }
                        style = { this.state.style }
                    />
                )}
            </FormItem>
        );
    }
}

export default DPRow;
