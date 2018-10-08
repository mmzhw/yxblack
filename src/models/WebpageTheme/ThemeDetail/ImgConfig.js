import React, { Component } from 'react';
import { Button, Form, Input, Row, Col, Radio, message } from 'antd';
import Upload from '../../../components/Upload';
import style from '../style.module.css';
import fetcher from '../../../utils/fetch';
import { handleImgUrl } from '../../../utils/util';
import { REQ_URL } from '../../../constants/constants';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ImgConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultData: {} // 存放原始数据
        };
    }

    componentDidMount() {
        this.props.id && this.getInitData();
    }

    // 提交数据
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) return message.error('配置不完整，无法保存');
            let params = {
                ...values,
                id: this.props.id,
                // 背景图需要存放backPc和backMweb，而默认图只需要存放颜色，但是后端共用的字段，故如此处理
                backPc: values.backPc || values.backBG,
                backMweb: values.backMweb || values.backBG,
                footImgPc: values.footImgPc ? values.footImgPc : '',
                footImgMweb: values.footImgMweb ? values.footImgMweb : '',
            };
            // 开始改变信息
            const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_UPDATE, params);
            if (res.code === 0) {
                message.success('更新成功');
                await this.getInitData(this.props.id);
                this.props.form.resetFields();
            } else {
                message.error(res.errmsg);
            }
        });
    }

    // 如果是编辑初始化数据
    getInitData = async () => {
        try {
            const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DETAIL, { id: this.props.id });
            res.code === 0 && this.setState({
                defaultData: res.data
            });
        } catch (error) {
            console.error(error);
            message.error('获取频道详情失败');
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { defaultData } = this.state;
        return (
            <Form onSubmit={this.handleSubmit} className={style['basic-img']}>
                <h3 className={style['basic-img']}>头图设置：</h3>
                <Row>
                    <Col span={11}>
                        <FormItem label='PC尺寸'>
                            {getFieldDecorator('headImgPc', {
                                rules: [{ required: true, message: '请上传图片' }],
                                initialValue: defaultData.headImgPc
                            })(
                                <Upload
                                    figureWidth={300}
                                    figureHeight={179}
                                    showImgUrl={
                                        handleImgUrl(
                                            getFieldValue('headImgPc')
                                        )
                                    }
                                    showOrigin={true}
                                    imgScaleText='(建议1920*1150)'
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label='M站尺寸'>
                            {getFieldDecorator('headImgMweb', {
                                rules: [{ required: true, message: '请上传图片' }],
                                initialValue: defaultData.headImgMweb
                            })(
                                <Upload
                                    figureWidth={173}
                                    figureHeight={191}
                                    showImgUrl={
                                        handleImgUrl(
                                            getFieldValue('headImgMweb')
                                        )
                                    }
                                    showOrigin={true}
                                    imgScaleText='(建议1080*1190)'
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <h3 className={style['basic-img']}>背景设置：
                    <span style={{ fontSize: 12 }}>背景图时如果长度不够会平铺展示</span>
                </h3>
                {getFieldDecorator('backType', {
                    initialValue: defaultData.backType ? String(defaultData.backType) : '0',
                    rules: [{
                        require: true
                    }]
                })(
                    <RadioGroup className={style['img-info-radio']}>
                        <Radio value={'0'}>背景图</Radio>
                        <Radio value={'1'}>纯色底</Radio>
                    </RadioGroup>
                )}
                {
                    getFieldValue('backType') === '0'
                        ? <Row>
                            <Col span={11}>
                                <FormItem label='PC尺寸'>
                                    {getFieldDecorator('backPc', {
                                        initialValue: defaultData.backPc
                                    })(
                                        <Upload
                                            figureWidth={300}
                                            figureHeight={120}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('backPc')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScaleText='(建议宽度1920)'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11}>
                                <FormItem label='M站尺寸'>
                                    {getFieldDecorator('backMweb', {
                                        initialValue: defaultData.backMweb
                                    })(
                                        <Upload
                                            figureWidth={300}
                                            figureHeight={120}
                                            showImgUrl={
                                                handleImgUrl(
                                                    getFieldValue('backMweb')
                                                )
                                            }
                                            showOrigin={true}
                                            imgScaleText='(建议宽度1080)'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        : <div>
                            点击色板选取颜色，默认为白色
                            {getFieldDecorator('backBG', {
                                initialValue: (defaultData.backType === 1) ? defaultData.backPc : '#ffffff'
                            })(
                                <Input type='color' className={style['color-input']} />
                            )}
                        </div>
                }
                <h3 className={style['basic-img']}>尾图设置：</h3>
                <FormItem>
                    {getFieldDecorator('footType', {
                        initialValue: defaultData.footType ? String(defaultData.footType) : '0'
                    })(
                        <RadioGroup className={style['img-info-radio']}>
                            <Radio value={'0'}>背景图</Radio>
                            <Radio value={'1'}>默认图（PC：延长背景图150px M站：延长背景图100px）</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                {
                    getFieldValue('footType') === '0' && <Row>
                        <Col span={11}>
                            <FormItem label='PC尺寸'>
                                {getFieldDecorator('footImgPc', {
                                    initialValue: defaultData.footImgPc
                                })(
                                    <Upload
                                        figureWidth={300}
                                        figureHeight={120}
                                        showImgUrl={
                                            handleImgUrl(
                                                getFieldValue('footImgPc')
                                            )
                                        }
                                        showOrigin={true}
                                        imgScaleText='(建议宽度1180)'
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <FormItem label='M站尺寸'>
                                {getFieldDecorator('footImgMweb', {
                                    initialValue: defaultData.footImgMweb
                                })(
                                    <Upload
                                        figureWidth={300}
                                        figureHeight={120}
                                        showImgUrl={
                                            handleImgUrl(
                                                getFieldValue('footImgMweb')
                                            )
                                        }
                                        showOrigin={true}
                                        imgScaleText='(建议宽度1034)'
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                }
                <Button className={style['img-info-button']} key='submit' type='primary' htmlType='submit'>保存</Button>
            </Form>
        );
    }
}

export default Form.create()(ImgConfig);
