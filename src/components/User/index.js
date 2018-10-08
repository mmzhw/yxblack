import React, { Component } from 'react';
import { Menu, Icon, message } from 'antd';
import style from './index.module.css';
import yxFetch from '../../utils/fetch';
import storage from '../../utils/storage';
import { Link } from 'react-router-dom';
import * as urls from '../../constants/urls';

const SubMenu = Menu.SubMenu;

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout(item) {
        switch (item.key) {
            case 'edit':
                break;
            case 'log':
                break;
            case 'logout':
                yxFetch('back/auth/logout', {
                }).then(res => {
                    if (res.code === 0) {
                        // localStorage.removeItem('user')
                        storage.remove('user');
                        const h = this.props.history;
                        h.push('/login');
                    } else {
                        message.error(res.errmsg);
                    }
                });
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        let user = storage.get('user');
        if (!user) {
            user = {};
            user.userName = '未登录';
        }
        this.setState({
            user
        });
    }
    render() {
        const user = this.state.user;
        return (
            <div className={style['right-warpper']}>
                <Menu mode='horizontal' onClick={this.handleLogout}>
                    <SubMenu style={{
                        float: 'right',
                    }} title={< span > <Icon type='user' />
                        {user.userName} </span>}
                    >
                        <Menu.Item key='edit'><Link to={urls.USER_INFO}>个人信息</Link></Menu.Item>
                        <Menu.Item key='log'><Link to={urls.USER_LOG}>操作日志</Link></Menu.Item>
                        <Menu.Item key='logout'>退出</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        );
    }
}

export default User;
