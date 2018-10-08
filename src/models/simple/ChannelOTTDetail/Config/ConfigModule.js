import React, { Component } from 'react';
import style from './style.module.css';
import Upload from '../../../../components/Upload/indexTV';
import { Form, Switch, Input, Select, Button } from 'antd';
import { getImgTypeSize, handleImgUrl } from '../../../../PublicTools';
const FormItem = Form.Item;

function checkIsVideoAllExist(videos) {
    return videos.every((obj) => !!obj.videoId);
}

class ConfigModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconImg: props.card.iconImg || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.card !== this.props.card) {
            this.props.form.resetFields();
            this.setState({
                iconImg: nextProps.card.iconImg || '',

            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                if (this.props.saveModuleData) {
                    values.isEnable = values.isEnable ? 1 : 0;
                    values.isMore = 1;
                    values.layoutId = Number(values.layoutId);
                    values.loop = 1;
                    values.iconImg = this.state.iconImg || '';
                    values.changeLoop = 1;
                    const result = await this.props.saveModuleData(values);
                    if (result) {
                        this.props.form.resetFields();
                    }
                }
            }
        });
    }

    // 更新图片
    uploadDone(scale, iconImg) {
        this.setState({
            iconImg: iconImg,
        });
    }

    render() {
        let formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 4 },
        };

        let tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 2,
            }
        };

        let { getFieldDecorator, getFieldValue } = this.props.form;
        let { card, currentCardsIndex } = this.props;
        console.log('card.videoscard.videoscard.videos', card.videos);
        console.log(checkIsVideoAllExist(card.videos));
        // 这块判断纯属废代码，因为Android不能修改成自动可适应，只能在后台加定死的选择配置
        let moduleSelete = '';
        if (currentCardsIndex === 0) {
            moduleSelete = (<Select
                onChange={this.props.changeModule}>
                <Select.Option value='1'>模板1(4个1177px *506px)</Select.Option>
            </Select>);
        } else if (currentCardsIndex === 1) {
            moduleSelete = (<Select
                onChange={this.props.changeModule}>
                <Select.Option value='2'>模板2(5个336px*188px)</Select.Option>
            </Select>);
        } else {
            moduleSelete = (<Select
                onChange={this.props.changeModule}>
                <Select.Option value='3'>模板3(2个885px*309px)</Select.Option>
                <Select.Option value='4'>模板4(5个336px*504px)</Select.Option>
            </Select>);
        }

        return (
            <div className={style.configModule}>
                <p>配置</p>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                        {...formItemLayout}
                        label='组件类型'
                    >
                        <span className='ant-form-text'>专题卡片</span>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='专辑名称'>
                        {getFieldDecorator('layoutName', {
                            initialValue: card.layoutName
                        })(
                            <Input maxLength='20' disabled={card.layoutId === 1 || card.layoutId === 2} />
                        )}
                    </FormItem>

                    <FormItem
                        label='状态'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('isEnable', {
                            valuePropName: 'checked',
                            initialValue: Boolean(this.props.card.isEnable),
                        })(
                            <Switch />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        wrapperCol={{ span: 8 }}
                        label='模板类型'
                    >
                        {getFieldDecorator('layoutId', {
                            rules: [{ required: true, message: '请选择模板类型' }],
                            initialValue: String(card.layoutId)
                        })(moduleSelete)}
                    </FormItem>

                    {/* <FormItem
                        {...formItemLayout}
                        wrapperCol={{ span: 8 }}
                        label='循环次数'
                    >
                        {getFieldDecorator('loop', {
                            initialValue: String(card.loop)
                        })(
                            <Select
                                onChange={this.props.changeLoop}>
                                <Select.Option value='0'>0</Select.Option>
                                <Select.Option value='1'>1</Select.Option>
                                <Select.Option value='2'>2</Select.Option>
                                <Select.Option value='3'>3</Select.Option>
                                <Select.Option value='4'>4</Select.Option>
                            </Select>
                        )}

                    </FormItem> */}

                    {/* <FormItem
                        label='更多'
                        {...formItemLayout}
                    >
                        {getFieldDecorator('isMore', {
                            valuePropName: 'checked',
                            initialValue: Boolean(this.props.card.isMore),
                        })(
                            <Switch/>
                        )}
                    </FormItem> */}

                    {/* <FormItem
                        {...formItemLayout}
                        label='地址'>
                        {getFieldDecorator('moreUrl', {
                            initialValue: this.props.card.moreUrl
                        })(
                            <Input />
                        )}
                    </FormItem> */}

                    <FormItem
                        {...formItemLayout}
                        label='图标'
                    >
                        <Upload
                            imgScale={getImgTypeSize(5).scale}
                            figureWidth={getImgTypeSize(5).width}
                            figureHeight={getImgTypeSize(5).height}
                            uploadDone={this.uploadDone.bind(this)}
                            showImgUrl={handleImgUrl(this.state.iconImg)}
                            layoutId= {getFieldValue['layoutId']}
                        />
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button key='submit' type='primary' htmlType='submit' loading={this.props.loading} style={{ marginRight: '20px' }}>保存</Button>
                        <Button type='primary' onClick={this.props.deleteModule.bind(this)}>删除</Button>
                    </FormItem>

                </Form>
            </div>
        );
    }
}
export default Form.create()(ConfigModule);
