import React from 'react';
import { Link } from 'react-router-dom';
import * as urls from '../../constants/urls';
import { transPlayTime, getDateTimeByTimeStamp } from '../../utils/time';
import { Divider } from 'antd';

export function getPlayColumns() {
    return [{
        title: '当前播放 or 待播放',
        dataIndex: 'queueId',
        key: 'queueId',
        render: (text, record, index) => {
            if (index === 0) {
                return <span>当前播放</span>;
            } else if (index === 1) {
                return <span>待播放</span>;
            } else {
                return null;
            }
        },
    }, {
        title: '队列名称 or 插播名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '定时播放时间',
        dataIndex: 'scheduleTime',
        key: 'scheduleTime',
        render: (text, record, index) => {
            if (record.status === 10) { // 0-队列中，5-待播放，7-暂停， 10-正在播放
                return <span></span>;
            } else if (record.status === 7) {
                return <span>暂停</span>;
            } else if (record.status === 5) {
                return <span>{ getDateTimeByTimeStamp(text) }</span>;
            } else if (record.status === 0) {
                return <span>队列中</span>;
            }
        },
    }];
}

export function getQueueColumns() {
    return [{
        title: '序号',
        dataIndex: 'queueId',
        key: 'queueId',
        render: (text, record, index) => {
            if (record.status !== 10 && record.status !== 7) {
                return <Link to={ { pathname: `${urls.TV_ADMIN}/queueSet/${record.queueId}`, state: { scheduleTime: record.scheduleTime }} }>{text}</Link>;
            } else {
                return <span>{text}</span>;
            }
        }
    }, {
        title: '队列名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '队列时长',
        dataIndex: 'totalDuration',
        key: 'totalDuration',
        render: (text, record) => {
            return transPlayTime(text);
        }
    }, {
        title: '队列状态',
        dataIndex: 'status',
        key: 'status', // 0-队列中，5-待播放，7-暂停， 10-正在播放
        render: (text, record) => {
            switch (text) {
                case 0: return '队列中';
                case 5: return '待播放';
                case 10: return '正在播放';
                case 7: return '暂停中';
                default: return '';
            }
        }
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => {
            if (record.status === 10) { // 正在播放
                return <span>
                    <a onClick={ () => { this.intervalSetBtnClicked(record); } }>广告设置</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.queueDetailBtnClicked(record); } }>列表</a>
                </span>;
            } else if (record.status === 7) { // 暂停中
                return <span>
                    <a onClick={ () => { this.intervalSetBtnClicked(record); } }>广告设置</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.queueDetailBtnClicked(record); } }>列表</a>
                </span>;
            } else if (record.status === 5) { // 待播放
                return <span>
                    <Link to={ { pathname: `${urls.TV_ADMIN}/queueSet/${record.queueId}`, state: { scheduleTime: record.scheduleTime }} }>编辑</Link>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.intervalSetBtnClicked(record); } }>广告设置</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.cancelScheduleBtnClick(record); } }>取消定时播放</a>
                </span>;
            } else if (record.status === 0) { // 队列中
                return <span>
                    <Link to={ { pathname: `${urls.TV_ADMIN}/queueSet/${record.queueId}`, state: { scheduleTime: record.scheduleTime }} }>编辑</Link>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.intervalSetBtnClicked(record); } }>广告设置</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.onlineQueueBtnClicked(record); } }>上线</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.deleteQueueBtnClicked(record); } }>删除</a>
                </span>;
            }
        },
    }];
}

export function getCutColumns() {
    return [{
        title: '插播序号',
        dataIndex: 'cutVideoId',
        key: 'cutVideoId',
        render: (text, record, index) => {
            if (record.playStatus === 0) {
                return <span>{text}</span>;
            }
            return <Link to={`${urls.TV_ADMIN}/interrupt/${record.cutVideoId}`}>{text}</Link>;
        }
    }, {
        title: '插播名称',
        dataIndex: 'cutVideoName',
        key: 'cutVideoName',
    }, {
        title: '插入时间',
        dataIndex: 'scheduleTime',
        key: 'scheduleTime',
        render: (text, record) => {
            // 有定时播放和正在播放的都显示插播时间
            if (record.playStatus === 0 || record.onlineType === 2) {
                if (record.playStatus === 0) { // 正在播放返回onlineTime
                    return getDateTimeByTimeStamp(record.onlineTime);
                }
                return getDateTimeByTimeStamp(text);
            } else {
                return null;
            }
        }
    }, {
        title: '插播状态',
        dataIndex: 'playStatus',
        key: 'playStatus',
        render: (text, record) => {
            switch (text) {
                case 0: return '正在播放';
                case 1: return '待播放';
                default: return '';
            }
        }
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => {
            // playStatus: 播放状态 1-未播放，0-正在播放
            // onlineType: 上线方式 1：手动上线 2：定时上线
            if (record.playStatus === 0) {
                return <span>
                    {/* <a onClick={ () => { this.setPreCutVideoBtnClicked(record) } }>广告设置</a>
          <Divider type='vertical' /> */}
                    <a onClick={ () => { this.offlineCutVideoBtnClicked(record); } }>下线</a>
                </span>;
            } else if (record.onlineType === 2) { // 未播放 & 定时上线
                return <span>
                    <Link to={`${urls.TV_ADMIN}/interrupt/${record.cutVideoId}`}>编辑</Link>
                    <Divider type='vertical' />
                    {/* <a onClick={ () => { this.setPreCutVideoBtnClicked(record) } }>广告设置</a>
          <Divider type='vertical' /> */}
                    <a onClick={ () => { this.cancelScheduleCutVideoBtnClicked(record); } }>取消定时播放</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.deleteCutVideoBtnClicked(record); } }>删除</a>
                </span>;
            } else {
                return <span>
                    <Link to={`${urls.TV_ADMIN}/interrupt/${record.cutVideoId}`}>编辑</Link>
                    <Divider type='vertical' />
                    {/* <a onClick={ () => { this.setPreCutVideoBtnClicked(record) } }>广告设置</a>
          <Divider type='vertical' /> */}
                    <a onClick={ () => { this.onlineCutVideoBtnClicked(record); } }>上线</a>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.deleteCutVideoBtnClicked(record); } }>删除</a>
                </span>;
            }
        },
    }];
}

