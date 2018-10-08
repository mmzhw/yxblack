import React, { Component } from 'react';
import { Form, Modal, Input } from 'antd';
import PropTypes from 'prop-types';
import Upload from '../../../components/Upload';
import { handleImgUrl } from '../../../utils/util';

const FormItem = Form.Item;

class PlayBackModal extends Component {
    static PropTypes = {
        modalOption: PropTypes.object,
        configData: PropTypes.configData,
        imageUrl: PropTypes.string,
        imageUrlPc: PropTypes.string,
        imgTypeSize: PropTypes.array
    }
    state = {
        size: ''
    }
    uploadDone = (imgScale, key) => {
        this.props.updateImageUrl(key);
    }

    uploadDonePc = (imgScale, key) => {
        this.props.updateImageUrlPc(key);
    }

    render() {
    // const formItemLayout = {
    //   labelCol: { span: 4 },
    //   wrapperCol: { span: 8 },
    // }
        const { imageUrl, imageUrlPc, imgTypeSize } = this.props;
        const { modalOption, configData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                {...modalOption}
            >
                <Form>
                    <FormItem
                        label='标题'
                    >
                        {getFieldDecorator('title', {
                            initialValue: configData && configData.title,
                            rules: [{ required: true, message: '必填项' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label='地址'
                    >
                        {getFieldDecorator('contentUrl', {
                            initialValue: configData && configData.contentUrl,
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label='PC端广告图'
                    >
                        <Upload
                            figureWidth={295}
                            figureHeight={60}
                            uploadDone={this.uploadDonePc}
                            showImgUrl={handleImgUrl(imageUrlPc)}
                            imgScale='1'
                            imgScaleText={imgTypeSize[0]}
                        />
                    </FormItem>
                    <FormItem
                        label='App端广告图'
                    >
                        <Upload
                            figureWidth={295}
                            figureHeight={60}
                            uploadDone={this.uploadDone}
                            showImgUrl={handleImgUrl(imageUrl)}
                            imgScale='1'
                            imgScaleText={imgTypeSize[1]}
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(PlayBackModal);
