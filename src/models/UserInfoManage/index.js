import React, { Component } from 'react';
import './index.css';
import { Form, Row, Col, Input, InputNumber, DatePicker, Select, Button, Table, Divider, Popover, Radio, Modal, message } from 'antd';
import moment from 'moment';
import FormDownload from '../../components/DownLoad/FormDownload';
import storage from '../../utils/storage';
import { Link } from 'react-router-dom';
import * as urls from '../../constants/urls';
import fetcher from '../../utils/fetch';
import { baseUrl } from '../../utils';
import { REQ_URL } from '../../constants/constants';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const statusMap = {
    0: '正常',
    1: '黑名单'
};

const formLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

class InfoManage extends Component {
    state = {
        list: [],
        pointConfig: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    }
    _columns = [
        {
            title: '序号',
            key: 'no',
            render: (text, record, index) => {
                return <span>{((this.state.pagination.currentPage - 1) * this.state.pagination.pageSize) + index + 1 }</span>;
            }
        },
        {
            title: '手机号',
            key: 'mobileNo',
            dataIndex: 'mobileNo',
        },
        {
            title: '昵称',
            key: 'nickName',
            dataIndex: 'nickName',
        },
        {
            title: '用户等级',
            key: 'level',
            dataIndex: 'level',
            render: (text, record, index) => {
                const filterArray = this.state.pointConfig.filter((obj) => {
                    return String(obj.level) === String(text);
                });
                return (filterArray && filterArray[0]) ? filterArray[0].userLevel : '';
            }
        },
        {
            title: '注册时间',
            key: 'registerTime',
            dataIndex: 'registerTime',
            render: (text, record, index) => {
                return (
                    <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>
                );
            }
        },
        {
            title: '作品总数',
            key: 'works',
            dataIndex: 'works'
        },
        {
            title: '积分（金币）',
            key: 'points',
            dataIndex: 'points'
        },
        {
            title: '积分（金币）更新时间',
            key: 'pointsRefreshTime',
            dataIndex: 'pointsRefreshTime',
            render: (text, record, index) => {
                return (
                    <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>
                );
            }
        },
        // {
        //     title: '经验值',
        //     key: 'experience',
        //     dataIndex: 'experience',
        //     render: (value, recode, index) => {
        //         if (!Number(value)) {
        //             return '--';
        //         } else {
        //             return value;
        //         }
        //     }
        // },
        // {
        //     title: '经验值更新时间',
        //     key: 'experRefreshTime',
        //     dataIndex: 'experRefreshTime',
        //     render: (value, record, index) => {
        //         if (!value) {
        //             return '--';
        //         } else {
        //             return (
        //                 value ? <span>{moment(value).format('YYYY-MM-DD HH:mm')}</span> : ''
        //             );
        //         }
        //     }
        // },
        {
            title: '操作管理',
            key: 'method',
            render: (text, record, index) => {
                return (
                    <div>
                        <Link to={`${urls.USER_SINGLE_INFO}/${record.uid}`}>查看</Link>
                        <Divider type='vertical' />
                        <Popover
                            content={
                                <div>
                                    <RadioGroup value={record.status || 0} onChange={() => { this._videoChange(record.uid, record.status); }}>
                                        <Radio value={0}>正常</Radio>
                                        <Radio value={1}>黑名单</Radio>
                                    </RadioGroup>
                                </div>
                            }
                            title='用户状态'
                            trigger='click'
                        >
                            <a>用户状态</a>
                        </Popover>
                    </div>
                );
            }
        },
    ]
    _videoChange = (uid, status) => {
        Modal.confirm({
            content: `是否确认设为${statusMap[!status ? 1 : 0]}`,
            onOk: async () => {
                let res = await fetcher(REQ_URL.UPDATE_USER_STATUS, {
                    uid,
                    status: !status ? 1 : 0
                });
                if (res.code === 0) {
                    message.success('设置成功！');
                    this._getList(this._getArgs(this.state.pagination.currentPage, this.state.pagination.pageSize));
                }
            }
        });
    }
    // 获取列表
    _getList = async (params) => {
        let res = await fetcher(REQ_URL.USER_INFO_LIST, params);
        if (res.code === 0) {
            this.setState({
                list: res.data.backUserInfoVoList,
                pagination: {
                    ...res.data.pager,
                    currentPage: res.data.pager.pageNo,
                    total: res.data.pager.records
                },
            });
        } else {
            console.error(res.errmsg);
        }
    }

    _getPointsConfig = async () => {
        try {
            let res = await fetcher(REQ_URL.POINTS_CONFIG, {});
            if (res.code === 0) {
                this.setState({
                    pointConfig: res.data
                });
            } else {
                console.error(res.errmsg);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 获取请求参数
    _getArgs = (currentPage = 1, pageSize = 10) => {
        const { getFieldsValue } = this.props.form;
        const values = getFieldsValue();
        return {
            ...values,
            startRegisterTime: (values.time && values.time[0]) ? (new Date(values.time[0].format())).getTime() : undefined,
            endRegisterTime: (values.time && values.time[1]) ? (new Date(values.time[1].format())).getTime() : undefined,
            level: values.level || undefined,
            currentPage,
            pageSize
        };
    }

    componentDidMount() {
        this._getList(this._getArgs());
        this._getPointsConfig();
    }

    render() {
        const { getFieldDecorator, getFieldsValue, getFieldValue } = this.props.form;
        const userInfo = storage.get('user');
        return (
            <div>
                <div className='form-filter'>
                    <Form layout='inline' onSubmit={this._download}>
                        <Row gutter={8}>
                            <Col span={8}>
                                <FormItem
                                    label='手机号'
                                >
                                    {
                                        getFieldDecorator('mobileNo')(
                                            <Input placeholder='手机号' type='text' className='info_field_x' />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <FormItem
                                    label='昵称'
                                >
                                    {
                                        getFieldDecorator('nickName')(
                                            <Input placeholder='昵称' type='text' className='info_field_x' />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <FormItem
                                    label='用户等级'
                                >
                                    {
                                        getFieldDecorator('level', {
                                            initialValue: 0
                                        })(
                                            <Select className='info_field_x'>
                                                <Option value={0} key={10000}>全部</Option>
                                                {
                                                    this.state.pointConfig.map((point) => {
                                                        return <Option key={point.level} value={point.level}>{point.userLevel}</Option>;
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={8}>
                                <FormItem
                                    label='注册时间'
                                    {
                                    ...formLayout
                                    }
                                >
                                    {
                                        getFieldDecorator('time')(
                                            <RangePicker
                                                showTime={{ format: 'HH:mm' }}
                                                format='YYYY-MM-DD HH:mm'
                                                placeholder={['开始时间', '结束时间']}
                                                className='info_field_x'
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <FormItem
                                    label='作品总数'
                                >
                                    {
                                        getFieldDecorator('works')(
                                            <Input className='info_field_x' placeholder='作品总数' />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <FormItem
                                    label='积分(金币)'
                                >
                                    {
                                        getFieldDecorator('startPoints')(
                                            <InputNumber className='info_field_x_num' placeholder='' min={0} />
                                        )
                                    }
                                </FormItem>
                                <p style={{ width: '25px', textAlign: 'left', height: '39px', lineHeight: '39px', display: 'inline-block' }}>~</p>
                                <FormItem>
                                    {
                                        getFieldDecorator('endPoints')(
                                            <InputNumber className='info_field_x_num' placeholder='' min={0} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {/* <Row gutter={8}>
                            <Col span={8} style={{ textAlign: 'left' }}>
                                <FormItem
                                    label='经验值'
                                >
                                    {
                                        getFieldDecorator('startExper')(
                                            <InputNumber className='info_field_x_num' placeholder='' min={0} />
                                        )
                                    }
                                </FormItem>
                                <p style={{ width: '25px', textAlign: 'left', height: '39px', lineHeight: '39px', display: 'inline-block' }}>~</p>
                                <FormItem>
                                    {
                                        getFieldDecorator('endExper')(
                                            <InputNumber className='info_field_x_num' placeholder='' min={0} />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row> */}
                    </Form>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right', margin: '30px 0 10px' }}>
                            <Button type='primary' style={{ marginRight: '10px' }} onClick={() => this._getList(this._getArgs())}>提交查询</Button>
                            <Button type='primary' style={{ marginRight: '10px' }} onClick={() => { this.props.form.resetFields(); this._getList(this._getArgs()); }}>重置查询</Button>
                            <FormDownload
                                btnWords='导出表格'
                                action={baseUrl + REQ_URL.USER_INFO_EXPORT}
                                values={{
                                    ...getFieldsValue(),
                                    userName: userInfo.userName,
                                    accessToken: userInfo.accessToken,
                                    startRegisterTime: (getFieldValue('time') && getFieldValue('time')[0]) ? (new Date(getFieldValue('time')[0].format())).getTime() : undefined,
                                    endRegisterTime: (getFieldValue('time') && getFieldValue('time')[1]) ? (new Date(getFieldValue('time')[1].format())).getTime() : undefined,
                                    time: ''
                                }}
                            />
                        </Col>
                    </Row>
                </div>
                {/* <p>注意：更新积分体系新版本的用户，原积分换算为金币，只显示金币和经验值。未更新的用户，只显示积分无经验值。</p> */}
                <Table
                    columns={this._columns}
                    rowKey='mobileNo'
                    dataSource={this.state.list}
                    bordered={true}
                    type='line'
                    pagination={{
                        ...this.state.pagination,
                        current: this.state.pagination.currentPage,
                        pageSize: this.state.pagination.pageSize,
                        total: this.state.pagination.records,
                        onChange: (current, pageSize) => this._getList(this._getArgs(current, pageSize)),
                        showTotal: (total, range) => `总数 ${total} 条`
                    }}
                />
            </div>
        );
    }
}

export default Form.create()(InfoManage);
