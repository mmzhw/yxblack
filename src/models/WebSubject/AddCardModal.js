import React, { Component } from 'react';
import { Form, Modal, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;

class AddCardModal extends Component {
    static PropTypes = {
        modalOption: PropTypes.object
    }

    state = {
        cardType: '2'
    }

    uploadDone = (imgScale, key) => {
        this.props.updateImageUrl(key);
    }
    onChangeType = (value) => {
        this.setState({ cardType: value });
    }

    render() {
    // const formItemLayout = {
    //   labelCol: { span: 4 },
    //   wrapperCol: { span: 8 },
    // }
        const { modalOption } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                {...modalOption}
            >
                <Form onSubmit={this.AddCardModal}>
                    <FormItem
                        label='模块名称'
                    >
                        {getFieldDecorator('cardName', {
                            rules: [{ required: true, message: '必填项' }, { max: 20, message: '最长不得超过20个字' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label='卡片类型'
                    >
                        {getFieldDecorator('cardType', {
                            rules: [{ required: true, message: '必填项' }]
                        })(
                            <Select onChange={this.onChangeType}>
                                <Option key='1'>直播</Option>
                                <Option key='2'>点播</Option>
                                <Option key='3'>广告</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(AddCardModal);
