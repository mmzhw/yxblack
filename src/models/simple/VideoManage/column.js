import React from 'react';
import { getDateTimeByTimeStamp } from '../../../utils/time';
import { imgPrefix } from '../../../utils';
import style from './column.module.css';
import * as urls from '../../../constants/urls';
import { Divider } from 'antd';
import {
    Link
} from 'react-router-dom';

function genCover(imageList) {
    if (!imageList || imageList.length === 0) {
        return require('../../../assets/none.png');
    }
    let imgObj = imageList.find(image => image.scale === 1) || imageList[0];
    return imgPrefix + imgObj.url;
}

function getPlatForm(id) {
    switch (id) {
        case 0: return '有象';
        case 1: return '乐视';
        case 2: return '腾讯';
        case 3: return '爱奇艺';
        case 4: return '优酷';
        case 5: return '搜狐';
        case 6: return '风行';
        case 7: return '新浪';
        case 8: return '土豆';
        case 9: return '哔哩';
        case 10: return '弹幕';
        case 11: return '芒果TV';
        case 12: return 'PPTV';
        case 13: return '华数TV';
        case 14: return '其他';
        default: return '';
    }
}

function getPlatForms(ids) {
    let len = ids.length;
    if (!ids || len === 0) return [];
    let platforms = [];
    for (let i = 0; i < len; i++) {
        platforms.push(getPlatForm(ids[i]));
    }
    return platforms;
}

function transformPlatForms(platforms) {
    return platforms.join(',');
}

export function getColumns() {
    return [{
        title: '封面/标题/编号',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
            return (
                <Link to={`${urls.VIDEO_LIST_SIMPLE}/VideoDetail/${record.videoBaseId}`} className={style.card}>
                    <div className={ style['first-col'] }>
                        <div className={ style['img-wrp'] }><img alt='' src={genCover(record.images)}/></div>
                        <div className={style['txt-wrp']}>
                            <h3 className={style['name']}>{ record.name }</h3>
                            <h4 className={style['sub-name']}>{ record.subName}</h4>
                            <h5 className={style['video-base-id']}>{ record.videoBaseId }</h5>
                        </div>
                    </div>
                </Link>
            );
        },
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
            switch (text) {
                case 0: return '已保存未上架';
                case 1: return '转码中';
                case 2: return '已上架';
                case 3: return '已下架';
                default: return '';
            }
        }
    }, {
        title: '播放平台',
        dataIndex: 'platforms',
        key: 'platforms',
        render: (text, record, index) => {
            if (text) {
                return transformPlatForms(getPlatForms(text));
            }
            return null;
        }
    }, {
        title: '创建时间',
        dataIndex: 'gmtCreated',
        key: 'gmtCreated',
        render: (text, record, index) => {
            if (!text) return '';
            return getDateTimeByTimeStamp(text * 1000);
        }
    },
    // {
    //     title: 'OTT推送',
    //     dataIndex: 'syncFlag',
    //     key: 'syncFlag',
    //     render: (text, record, index) => {
    //         if (!Number(text)) {
    //             return (<a onClick={ this.pushOtt.bind(this, record) }>推送</a>);
    //         }
    //         return (<a style={{ color: '#ccc' }}>已推送</a>);
    //     }
    // },
    {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
            if (record.status === 0) { // 已保存未上架
                return (
                    <Link to={`${urls.VIDEO_LIST_SIMPLE}/VideoDetail/${record.videoBaseId}`} className={style.card}>编辑</Link>
                );
            } else if (record.status === 1) { // 转码中
                return (
                    <Link to={`${urls.VIDEO_LIST_SIMPLE}/VideoDetail/${record.videoBaseId}`} className={style.card}>编辑</Link>
                );
            } else if (record.status === 2) { // 已上架
                return <span>
                    <Link to={`${urls.VIDEO_LIST_SIMPLE}/VideoDetail/${record.videoBaseId}`} className={style.card}>编辑</Link>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.putOffClicked(record); } }>下架</a>
                </span>;
            } else if (record.status === 3) { // 已下架
                return <Link to={`${urls.VIDEO_LIST_SIMPLE}/VideoDetail/${record.videoBaseId}`} className={style.card}>编辑</Link>;
            }
        },
    }];
}
