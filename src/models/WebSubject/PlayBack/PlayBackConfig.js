import React, { Component } from 'react';
import { Form, Switch, Button, Input, Select, Radio, Row, Col, Divider } from 'antd';
import Upload from '../../../components/Upload';
import style from './style.module.css';
import { handleImgUrl } from '../../../utils/util';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xl: { span: 8 },
        xxl: { span: 6 }
    },
    wrapperCol: {
        xl: { span: 16 },
        xxl: { span: 18 }
    },
};

const styleMap = {
    1: ['', ''],
    2: ['1180px*346px', '1180px*1592px'],
    3: ['1180px*186px', '1180px*1592px'],
    4: ['1180px*346px', '1180px*1592px'],
    5: ['1180px*502px', '1180px*1108px'],
    6: ['1180px*1154px', '1180px*1592px'],
    7: ['1180px*480px', '1180px*2067px'],
};

class PlayBackConfig extends Component {
    static PropTypes = {
        configData: PropTypes.object,
        updateModel: PropTypes.func,
        enableImg: PropTypes.boolean,
        listType: PropTypes.array,
        componentType: PropTypes.String
    }

    static defaultProps = {
        enableImg: false
    }

    state = {
        cardType: ''
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = {
                    ...this.props.configData,
                    ...values,
                };
                values.enable = Number(values.enable);
                this.props.updateModel(values);
            }
        });
    }

    renderCardName2 = () => {
        const { configData, layoutId } = this.props;
        const { getFieldDecorator } = this.props.form;
        if (configData.cardType === 2 && Number(layoutId) === 4) {
            return (
                <FormItem
                    {...formItemLayout}
                    label='专题名称2'
                >
                    {getFieldDecorator('cardName2', {
                        initialValue: configData && configData.cardName2,
                        rules: [{ required: true, message: '必填项' }, { max: 20, message: '最长不得超过20个字' }]
                    })(
                        <Input/>
                    )}
                </FormItem>
            );
        }
    }

    handleLayoutChange = (layoutId) => {
        this.props.handleLayoutChange(layoutId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.configData.backImg !== this.props.configData.backImg) {
            this.setState({
                imageUrl: nextProps.configData.backImg,
            });
        }
        if (nextProps.configData.imageBannerUrl !== this.props.configData.imageBannerUrl) {
            this.setState({
                imageBannerUrl: nextProps.configData.imageBannerUrl,
            });
        }
        if (nextProps.configData !== this.props.configData) {
            this.props.form.resetFields();
        }
        if (nextProps.cardType !== this.state.cardType) {
            this.setState({
                cardType: nextProps.cardType,
            });
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { configData, enableImg, listType, componentType } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span = {12}>
                        <FormItem
                            {...formItemLayout}
                            label='组件类型'
                        >
                            <span className='ant-form-text'>{componentType}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span = {12}>
                        <FormItem
                            {...formItemLayout}
                            label='专题名称'
                        >
                            {getFieldDecorator('cardName', {
                                initialValue: configData && configData.cardName,
                                rules: [{ required: true, message: '必填项' }, { max: 20, message: '最长不得超过20个字' }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span = {12}>
                        {
                            this.renderCardName2()
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span = {12}>
                        <FormItem
                            {...formItemLayout}
                            label='模板类型'
                        >
                            {getFieldDecorator('layoutId', {
                                initialValue: configData ? String(configData.layoutId) : listType[0].value,
                                rules: [{ required: true, message: '必填项' }]
                            })(
                                <Select onChange={this.handleLayoutChange}>
                                    {
                                        listType && listType.map((item) => {
                                            return (
                                                <Option key={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span = {12}>
                        {
                            this.props.cardType === 2 &&
                            <FormItem
                                {...formItemLayout}
                                label='标题样式'
                            >
                                {getFieldDecorator('titleStyleType', {
                                    initialValue: (configData && configData.titleStyleType !== undefined && configData.titleStyleType !== null) ? String(configData.titleStyleType) : '0',
                                    rules: [{ required: true, message: '必填项' }]
                                })(
                                    <RadioGroup>
                                        <Radio value={'0'}>默认样式{
                                            getFieldValue('titleStyleType') === '0' && <span>（PC端：默认字体 24号 黑色，移动端：默认字体 16号 黑色）</span>
                                        }</Radio><br />
                                        <Radio value={'1'}>上传图片样式</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        }
                    </Col>
                    <Col span={12}>
                        {
                            this.props.cardType === 2 && getFieldValue('titleStyleType') === '1' &&
                            <Col span={8}>
                                <FormItem
                                    label='pc站标题样式'
                                >
                                    {getFieldDecorator('imgTitleStyleUrl', {
                                        initialValue: (configData && configData.imgTitleStyleUrl !== undefined && configData.imgTitleStyleUrl !== null) ? String(configData.imgTitleStyleUrl) : '',
                                        rules: [{ required: true, message: '必填项' }]
                                    })(
                                        <Upload
                                            figureWidth={270}
                                            figureHeight={115}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('imgTitleStyleUrl')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScale='1'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            this.props.cardType === 2 && getFieldValue('titleStyleType') === '1' &&
                            <Col span={8}>
                                <FormItem
                                    label='M站标题样式'
                                >
                                    {getFieldDecorator('imgTitleStyleUrlM', {
                                        initialValue: configData && configData.imgTitleStyleUrlM ? String(configData.imgTitleStyleUrlM) : '',
                                        rules: [{ required: true, message: '必填项' }]
                                    })(
                                        <Upload
                                            figureWidth={270}
                                            figureHeight={115}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('imgTitleStyleUrlM')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScale='1'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            this.props.cardType === 2 && getFieldValue('layoutId') === '4' && getFieldValue('titleStyleType') === '1' &&
                            <Col span={8}>
                                <FormItem
                                    label='M站标题样式2'
                                >
                                    {getFieldDecorator('imgTitleStyleUrlM2', {
                                        initialValue: configData && configData.imgTitleStyleUrlM2 ? String(configData.imgTitleStyleUrlM2) : '',
                                        rules: [{ required: true, message: '必填项' }]
                                    })(
                                        <Upload
                                            figureWidth={270}
                                            figureHeight={115}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('imgTitleStyleUrlM2')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScale='1'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        }
                    </Col>
                </Row>
                {
                    this.props.cardType === 2 && <Divider />
                }
                <Row>
                    <Col span = {12}>
                        {
                            this.props.cardType === 2 &&
                    <FormItem
                        {...formItemLayout}
                        label='底框样式'
                    >
                        {getFieldDecorator('buttomStyleType', {
                            initialValue: (configData && configData.buttomStyleType !== undefined && configData.buttomStyleType !== null) ? String(configData.buttomStyleType) : '1',
                            rules: [{ required: true, message: '必填项' }]
                        })(
                            <RadioGroup onChange={this.onChange}>
                                <Radio value={'1'}>默认样式
                                    {
                                        getFieldValue('buttomStyleType') === '1' && <span>（透明白底）</span>
                                    }
                                </Radio><br />
                                <Radio value={'0'}>上传图片样式</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                        }
                    </Col>
                    <Col span = {12}>
                        {
                            this.props.cardType === 2 && getFieldValue('buttomStyleType') === '0' &&
                            <Col span={8}>
                                <FormItem
                                    label={ 'pc站 ' + styleMap[Number(getFieldValue('layoutId'))][0] }
                                >
                                    {getFieldDecorator('imgButtomStyleUrl', {
                                        initialValue: configData && configData.imgButtomStyleUrl ? String(configData.imgButtomStyleUrl) : '',
                                        rules: [{ required: true, message: '必填项' }]
                                    })(
                                        <Upload
                                            figureWidth={270}
                                            figureHeight={125}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('imgButtomStyleUrl')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScale='2.016'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            this.props.cardType === 2 && getFieldValue('buttomStyleType') === '0' &&
                            <Col span={8}>
                                <FormItem
                                    label={ 'M站 ' + styleMap[Number(getFieldValue('layoutId'))][1] }
                                >
                                    {getFieldDecorator('imgButtomStyleUrlM', {
                                        initialValue: configData && configData.imgButtomStyleUrlM ? String(configData.imgButtomStyleUrlM) : '',
                                        rules: [{ required: true, message: '必填项' }]
                                    })(
                                        <Upload
                                            figureWidth={270}
                                            figureHeight={125}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('imgButtomStyleUrlM')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScale='2.016'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            this.props.cardType === 2 && getFieldValue('layoutId') === '4' && getFieldValue('buttomStyleType') === '0' &&
                            <Col span={8}>
                                <FormItem
                                    label={ 'M站2 ' + styleMap[Number(getFieldValue('layoutId'))][1] }
                                >
                                    {getFieldDecorator('imgButtomStyleUrlM2', {
                                        initialValue: configData && configData.imgButtomStyleUrlM2 ? String(configData.imgButtomStyleUrlM2) : '',
                                        rules: [{ required: true, message: '必填项' }]
                                    })(
                                        <Upload
                                            figureWidth={270}
                                            figureHeight={125}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('imgButtomStyleUrlM2')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScale='2.016'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        }
                    </Col>
                </Row>
                {
                    this.props.cardType === 2 && <Divider />
                }
                <Row>
                    <Col span={12}>
                        {
                            getFieldValue('layoutId') === '1' &&
                            <FormItem
                                {...formItemLayout}
                                label='banner图片上传'
                            >
                                {getFieldDecorator('imageBannerUrl', {
                                    initialValue: configData && configData.imageBannerUrl ? configData.imageBannerUrl : ''
                                })(
                                    <Upload
                                        figureWidth={100}
                                        figureHeight={100}
                                        showImgUrl={handleImgUrl(
                                            getFieldValue('imageBannerUrl')
                                        )}
                                        imgScale='1'
                                    />
                                )}
                            </FormItem>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='启用组件'
                        >
                            {getFieldDecorator(
                                'enable',
                                {
                                    initialValue: configData && Boolean(configData.enable),
                                    rules: [{ required: true }],
                                    valuePropName: 'checked'
                                }
                            )(
                                <Switch/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        {
                            enableImg &&
                    <FormItem
                        {...formItemLayout}
                        label='背景图片上传'
                    >
                        {getFieldDecorator('backImg', {
                            initialValue: configData && configData.backImg ? configData.backImg : '',
                            rules: [{ required: true, message: '必填项' }]
                        })(
                            <Upload
                                figureWidth={100}
                                figureHeight={100}
                                showImgUrl={
                                    handleImgUrl(
                                        getFieldValue('backImg')
                                    )
                                }
                                imgScale='1'
                                imgScaleText='1080*1106'
                            />
                        )}
                    </FormItem>
                        }
                    </Col>
                </Row>
                <Button type='primary' htmlType='submit' className={style['area-btn']}>保存</Button>
            </Form>

        );
    }
}

export default Form.create()(PlayBackConfig);
