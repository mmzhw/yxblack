/**
 * Created by yiming on 2017/6/13.
 */
import React from 'react';
import {
    Link
} from 'react-router-dom';
import style from './style.module.css';

function Card(props) {
    const { to } = props;
    return (
        <div className={style.card}>
            <Link className={style.link} to={to}>{props.label}</Link>
        </div>
    );
}

export default Card;
