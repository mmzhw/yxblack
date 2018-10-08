import React, { Component } from 'react';
import { Modal, Form, Switch, Input } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

class UpdateModal extends Component {
    static PropTypes = {
        modalConfig: PropTypes.object,
        modalChannel: PropTypes.object
    }

    render() {
        const { modalConfig, modalChannel } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                maskClosable={false}
                {...modalConfig}
            >
                <Form>
                    <FormItem
                        label='名称'
                    >
                        {getFieldDecorator('name', { initialValue: modalChannel ? modalChannel.name : '', rules: [{ required: true, max: 10, message: '必填项，且长度不得超过10位' }] })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label='启用'
                    >
                        {getFieldDecorator('enable', { valuePropName: 'checked', initialValue: modalChannel ? Boolean(modalChannel.enable) : false })(
                            <Switch
                            />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(UpdateModal);
