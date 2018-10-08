import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'md5';
import { Form, Input, Button, Row } from 'antd';
import { toLogin, toTvLogin } from '../../actions';
import style from './style.module.css';
import * as urls from '../../constants/urls';

const FormItem = Form.Item;

const loginType = {
    1: 'CERNARIUS',
    2: 'TV'
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginType: loginType[1],
            userName: '',
            passwd: ''
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswdChange = this.handlePasswdChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleNameChange(event) {
        this.setState({
            userName: event.target.value
        });
    }

    handlePasswdChange(event) {
        this.setState({
            passwd: event.target.value
        });
    }

    handleLogin() {
        const { history, dispatch } = this.props;
        const loginData = {
            userName: this.state.userName,
            passwd: md5(this.state.passwd)
        };
        if (this.state.loginType === loginType[1]) {
            dispatch(toLogin(loginData, history, urls.HOME));
        }
        if (this.state.loginType === loginType[2]) {
            dispatch(toTvLogin(loginData, history, urls.SIMPLE));
        }
    }

    changeLoginType(loginType) {
        this.setState({ loginType });
    }

    render() {
        return (
            <div className={style.form}>
                <div className={style['login-header']}>
                    <div className={this.state.loginType === loginType[1] ? `${style['logo']} ${style['logo-choosen']}` : style['logo']} onClick = {() => this.changeLoginType(loginType[1])}>
                        <img alt={'logo'} src={require('../../assets/logo.png')} />
                        <span>Cernarius</span>
                    </div>
                    <div className={this.state.loginType === loginType[2] ? `${style['logo']} ${style['logo-choosen']}` : style['logo']} onClick = {() => this.changeLoginType(loginType[2])}>
                        <img alt={'logo'} src={require('../../assets/logo.png')} />
                        <span>BOSS影线</span>
                    </div>
                </div>
                <form>
                    <FormItem hasFeedback>
                        <Input size='large' value={this.state.userName} onPressEnter={this.handleLogin} placeholder='输入帐号' onChange={this.handleNameChange} />
                    </FormItem>
                    <FormItem hasFeedback>
                        <Input size='large' value={this.state.passwd} type='password' onPressEnter={this.handleLogin} placeholder='输入密码' onChange={this.handlePasswdChange} />
                    </FormItem>
                    <Row>
                        <Button type='primary' size='large' onClick={this.handleLogin}>登录</Button>
                    </Row>
                </form>
            </div>
        );
    }
}

export default connect()(Login);

