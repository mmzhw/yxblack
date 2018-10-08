import React, { Component } from 'react';
import { Layout, Icon, Menu, Dropdown, Button, Alert } from 'antd';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { menuTypeSet } from '../actions';
import YXBreadcrunb from '../components/Breadcrumb';
import YXMenu from '../components/Menus';
import style from './style.module.css';
import * as urls from '../constants/urls';
import User from '../components/User';

const { Content, Sider } = Layout;
const MenuItem = Menu.Item;

class MainLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    _nav = (
        <Menu>
            <MenuItem key='1'><a onClick={() => this.changeMenuType(urls.HOME)}>运营管理系统</a></MenuItem>
            <MenuItem key='2'><a onClick={() => this.changeMenuType(urls.SIMPLE)}>BOSS影院</a></MenuItem>
        </Menu>
    )
    changeMenuType = (path) => {
        this.props.dispatch(menuTypeSet({ menuType: path }));
        this.props.match.history.push(path);
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        let MainContent = this.props.content;
        const history = this.props.match.history;
        return (
            <Layout className={style.layout}>
                <Sider className={style.sidebar}
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}>
                    <div className={style.logo}>
                        <Link className={style['to-home']} to={urls.HOME}>
                            <img src={require('../assets/logo.png')} alt='logo' />
                            <span>Cernarius</span>
                        </Link>
                    </div>
                    <div className={style.menu}>
                        <YXMenu selectedMenu={this.props.selectedMenu} mode={this.state.collapsed}/>
                    </div>
                </Sider>
                <Layout className={ this.state.collapsed ? style['main-content-collapsed'] : style['main-content']}>
                    {(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))
                        ? '' : <Alert message='请使用google chrome浏览器使用系统' banner closable />}
                    <div className={style['header']}>
                        <div className={style['header-button']} onClick={this.toggle}>
                            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                        </div>
                        <Dropdown overlay={this._nav}>
                            <Button style={{ marginLeft: 8, marginTop: 9 }}>
                系统导航 <Icon type='down' />
                            </Button>
                        </Dropdown>
                        <User history={history}/>
                    </div>
                    <div style={{ padding: '0 24px 24px' }}>
                        <Route render={({ location, match }) => {
                            return (<YXBreadcrunb location={location} match={match} routes={this.props.routes} />);
                        }}/>
                        <Content style={{ padding: 24, margin: 0, minHeight: 280, backgroundColor: '#FFF' }}>
                            <MainContent {...this.props}/>
                        </Content>
                    </div>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedMenu: state.menuReducer.selectedMenu
    };
};

const mapDispatchToProps = dispatch => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

