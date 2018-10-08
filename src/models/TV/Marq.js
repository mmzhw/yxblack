import React, { Component } from 'react';
import style from './marq.module.css';
import yxFetch from '../../utils/fetch';
import { Switch, Button, Modal, Table, message } from 'antd';
import * as urls from '../../constants/urls';
import { Link } from 'react-router-dom';
import { getColumns } from './marqData';
import MarqScheduleModal from '../../components/Tv/marqScheduleModal';
import { getDateTimeByTimeStamp } from '../../utils/time';
import { REQ_URL } from '../../constants/constants';

class Marq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marqOpened: false,
            timeAlreadySet: false,
            marqList: [],
            pageInfo: {
                totalCount: 0,
                pageNo: 0,
            },
            validPeriod: {
                startTime: null,
                endTime: null,
            },
            scheduleModalVisible: false
        };
        this.columns = getColumns.call(this);
        this.pageSize = 10;
    }
    componentDidMount() {
        this.fetchMarqList({
            currentPage: 1,
            pageSize: this.pageSize,
        });
        this.getMarqValidPeriod();
        this.getMarkOpenStatus();
    }
    handleModalOk = (dateRange) => {
        this.setSchedule(dateRange);
    }
    closeScheduleModal = () => {
        this.setState({
            scheduleModalVisible: false
        });
    }
    openScheduleModal = () => {
        this.setState({
            scheduleModalVisible: true
        });
    }
    showMarqToggleDialog = () => {
        Modal.confirm({
            title: '',
            content: `确认${this.state.marqOpened ? '关闭' : '打开'}轮播跑马灯？`,
            onOk: () => { this.toggleMarq(); },
            onCancel() {},
        });
    }
    deleteMarqBtnClicked = (marq) => {
        Modal.confirm({
            title: '',
            content: `确认删除该通知？`,
            onOk: () => { this.deleteMarq(marq); },
            onCancel() {},
        });
    }
    cancelScheduleBtnClicked = () => {
        Modal.confirm({
            title: '',
            content: `确认取消定时设置？`,
            onOk: () => { this.cancelSchedule(); },
            onCancel() {},
        });
    }
    toggleMarq = () => {
        this.state.marqOpened ? this.closeMarq() : this.openMarq();
    }
    render() {
        let pagination = {
            pageSize: this.pageSize,
            total: this.state.pageInfo.records,
            current: this.state.pageInfo.currentPage,
            onChange: (currentPage, pageSize) => {
                this.fetchMarqList({
                    currentPage,
                    pageSize: this.pageSize,
                });
            },
        };
        return (
            <div>
                <Switch onChange={this.showMarqToggleDialog} checked={this.state.marqOpened}/>
                <span className={style['marq-label']}>
                    { this.state.marqOpened ? '打开轮播跑马灯' : '关闭轮播跑马灯' }
                </span>
                {
                    this.state.timeAlreadySet ? (
                        <div className={style['marq-opened']}>
                            <p className={style['valid-period']}>生效时间：{ getDateTimeByTimeStamp(this.state.validPeriod.startTime) } - { getDateTimeByTimeStamp(this.state.validPeriod.endTime) }</p>
                            <Button onClick={this.openScheduleModal} type='primary' ghost>定时设置</Button>
                            <Button onClick={this.cancelScheduleBtnClicked} type='primary' ghost style={ { marginLeft: '20px' } }>取消定时</Button>
                        </div>) : (
                        <div className={style['marq-closed']}>
                            <p className={style['valid-period']}>未开启定时器</p>
                            <Button onClick={this.openScheduleModal} type='primary' ghost>定时设置</Button>
                        </div>
                    )
                }
                <section className={style['table']}>
                    <Button type='primary' style={ { marginBottom: '20px' } }>
                        <Link to={{
                            pathname: `${urls.MARQ_ADMIN}/add`,
                        }}>
              新增
                        </Link>
                    </Button>
                    <Table dataSource={this.state.marqList} columns={this.columns} rowKey={'id'} pagination={pagination}/>
                </section>
                <MarqScheduleModal
                    gmtStart={this.state.validPeriod.startTime}
                    gmtEnd={this.state.validPeriod.endTime}
                    visible={this.state.scheduleModalVisible}
                    handleOk={this.handleModalOk}
                    handleCancel={this.closeScheduleModal}
                />
            </div>
        );
    }
    setSchedule = async (dateRange) => { // 设置生效时间
        let res = await yxFetch(REQ_URL.SET_RUN_BANNER, dateRange);
        if (res.code === 0) {
            message.success('生效时间设置成功!');
            this.closeScheduleModal();
            this.getMarqValidPeriod();
        } else {
        }
    }
    getMarkOpenStatus = async () => {
        let res = await yxFetch(REQ_URL.IS_SHOW_INFO_RUN_BANNER, {});
        if (res.code === 0) {
            this.setState({
                marqOpened: res.data
            });
        } else {
        }
    }
    getMarqValidPeriod = async () => { // 得到跑马灯生效时间
        let res = await yxFetch(REQ_URL.SET_INFO_RUN_BANNER, {});
        if (res.code === 0) {
            let { startTime, endTime } = res.data;
            this.setState({
                validPeriod: {
                    startTime,
                    endTime
                },
                timeAlreadySet: !!(startTime && endTime)
            });
        } else {
        }
    }
    cancelSchedule = async () => { // 取消定时
        let res = await yxFetch(REQ_URL.CANCEL_SET_RUN_BANNER, {});
        if (res.code === 0) {
            message.success('取消定时设置成功!');
            this.getMarqValidPeriod();
        } else {
        }
    }
    deleteMarq = async (record) => {
        let res = await yxFetch(REQ_URL.DEL_RUN_BANNER, {
            id: record.id
        });
        if (res.code === 0) {
            message.success('删除成功!');
            this.fetchMarqList({
                currentPage: 1,
                pageSize: this.pageSize
            });
        } else {
        }
    }
    closeMarq = async () => {
        let res = await yxFetch(REQ_URL.IS_SHOW_INFO_RUN_BANNER, {
            isOpen: 0,
        });
        if (res.code === 0) {
            this.setState((preState) => {
                return {
                    marqOpened: !preState.marqOpened
                };
            });
        } else {
        }
    }
    openMarq = async () => {
        let res = await yxFetch(REQ_URL.IS_SHOW_RUN_BANNER, {
            isOpen: 1,
        });
        if (res.code === 0) {
            this.setState((preState) => {
                return {
                    marqOpened: !preState.marqOpened
                };
            });
        } else {
        }
    }
    fetchMarqList = async (params) => {
        let res = await yxFetch(REQ_URL.LISTS_RUN_BANNER, params);
        if (res.code === 0) {
            this.setState({
                marqList: res.data.data,
                pageInfo: res.data.pages,
            });
        } else {
        }
    }
}

export default Marq;
