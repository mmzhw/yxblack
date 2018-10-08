import React from 'react';
import { Link } from 'react-router-dom';
import * as urls from '../../constants/urls';
import { getDateTimeByTimeStamp } from '../../utils/time';
import { Divider } from 'antd';
import style from './marq.module.css';

export function getColumns() {
    return [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        render: (text, record, index) => {
            if (!text) return '';

            let arr = JSON.parse(text);
            let len = arr.length;
            let renderArr = [];
            for (let i = 0; i < len; i++) {
                if (!arr[i]) {
                    renderArr.push('');
                } else {
                    renderArr.push(
                        <span key={i}>{ arr[i]['text'] }</span>
                    );
                }
            }
            return <span className={style['text-col']}>{ renderArr }</span>;
        }
    }, {
        title: '开始时间',
        dataIndex: 'gmtStart',
        key: 'gmtStart',
        render: (text, record, index) => {
            return getDateTimeByTimeStamp(text);
        }
    }, {
        title: '结束时间',
        dataIndex: 'gmtEnd',
        key: 'gmtEnd',
        render: (text, record, index) => {
            return getDateTimeByTimeStamp(text);
        }
    }, {
        title: '创建时间',
        dataIndex: 'gmtCreated',
        key: 'gmtCreated',
        render: (text, record, index) => {
            return getDateTimeByTimeStamp(text);
        }
    }, {
        title: '操作',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
            return (
                <p>
                    <Link to={{
                        pathname: `${urls.MARQ_ADMIN}/del/${record.id}`,
                    }}>
            编辑
                    </Link>
                    <Divider type='vertical' />
                    <a onClick={ () => { this.deleteMarqBtnClicked(record); } }>删除</a>
                </p>
            );
        },
    }];
}
