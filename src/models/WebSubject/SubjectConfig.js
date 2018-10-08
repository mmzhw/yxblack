// 专题标题设置
import React, { Component } from 'react';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import BasicInfoConfig from './BasicInfo';
import ImgInfoConfig from './BasicInfo/imgInfoConfig.js';
import fetcher from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { REQ_URL } from '../../constants/constants';

export default class SubjectConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectId: props.match.match.params.id,
            currButtonIndex: 0,
            configData: {},
            imgButton: false,
            cardButton: false,
            flag: true
        };
    }
    componentDidMount() {
        if (this.state.subjectId) {
            this.getInitData();
        } else {
            this.setState({
                imgButton: true,
                cardButton: true
            });
        }
    }
    getInitData = async() => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_DETAIL, { id: this.props.match.match.params.id });
        if (res.code === 0) {
            const configData = res.data;
            if (configData.headImgMweb === null || configData.headImgPc === null) {
                this.setState({
                    cardButton: true
                });
            }
        }
    }
    // 更新信息
    updateSubject = async(values, step) => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_UPDATE, values);
        if (res.code === 0) {
            message.success('更新成功');
            step && this.setState({ cardButton: false });
        } else {
            message.error(res.errmsg);
        }
    }
    // 新增信息
    addDateSubject = async(values) => {
        if (this.state.flag) {
            this.setState({ flag: false });
            const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_ADD, values);
            if (res.code === 0) {
                message.success('新增成功');
                setTimeout(function() {
                    window.location.href = '/app/websubject/' + res.data.id;
                }, 1500);
            } else {
                message.error(res.errmsg);
            }
        } else {
            return;
        }
    }
    changeIndex = (index) => {
        this.setState({
            currButtonIndex: index
        });
    }
    render() {
        const { currButtonIndex, subjectId, imgButton, cardButton } = this.state;
        return (
            <div>
                <div className={style['button-wrap']}>
                    <Button type='default' style={{ marginRight: '20px' }}
                        onClick={() => { this.changeIndex(0); }}
                        className={style[currButtonIndex === 0 ? 'curr-button' : '']}>
                  基础信息
                    </Button>
                    <Button type='default' style={{ marginRight: '20px' }}
                        disabled={imgButton} onClick={() => { this.changeIndex(1); }}
                        className={style[currButtonIndex === 1 ? 'curr-button' : '']}>
                  图片配置
                    </Button>
                    <Button type='default' disabled={cardButton}><Link to={`${urls.WEBSUBJECT}/${subjectId}/tepls-config`}>卡片配置</Link></Button>
                </div>
                {
                    currButtonIndex === 0 ? (
                        <BasicInfoConfig
                            subjectId={subjectId}
                            updateSubject={this.updateSubject}
                            addDateSubject={this.addDateSubject}
                        />
                    ) : (
                        <ImgInfoConfig
                            subjectId={subjectId}
                            updateSubject={this.updateSubject}
                        />)
                }
            </div>
        );
    }
}
