/**
 * Created by yiming on 2017/6/13.
 */

import React from 'react';
// import Card from './Card'
import { Card } from 'antd';
import {
    Link
} from 'react-router-dom';
import * as urls from '../../constants/urls';
import User from '../../components/User';
import style from './style.module.css';

const Center = (props) => {
    const history = props.history;
    const bodyStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    return (
        <div className={style.center}>
            <User history={history} />
            <div className={style['card-wrap']}>
                <Card className={style.card} bodyStyle={ bodyStyle }><Link to={urls.HOME}>运营后台</Link></Card>
            </div>
        </div>
    );
};

export default Center;
