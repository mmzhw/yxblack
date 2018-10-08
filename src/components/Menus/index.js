import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {
    withRouter,
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import * as urls from '../../constants/urls';
import { menuKeySet } from '../../actions';
import MdVideo from 'react-icons/lib/md/ondemand-video';
import getMenuMap from './menuRouterMap';

const SubMenu = Menu.SubMenu;
const allKeys = ['sub1', 'sub-video', 'App', 'sub-live', 'channel', 'ott', 'tv-live', 'user-video'];

class YXMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'inline',
            currentPage: 1,
            pageSize: 20,
            openKeys: allKeys,
            selectKeys: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            mode: nextProps.mode ? 'vertical' : 'inline',
            openKeys: nextProps.mode ? [] : allKeys,
            menuKey: nextProps.selectedMenu.menuKey
        });
    }

    _setKey = ({ key }) => {
        this.props.dispatch(menuKeySet({ menuKey: key }));
    }
    _appMenu = () =>
        <Menu mode={this.state.mode} openKeys={this.state.openKeys} onClick={this._setKey} defaultSelectedKeys={[this.props.selectedMenu.menuKey || getMenuMap(this.props.location.pathname + this.props.location.search)]}>
            <Menu.Item key='user-info-manage'>
                <Link to={`${urls.USER_INFO_MANAGE}`}>
                    <Icon><MdVideo /></Icon><span style={{ verticalAlign: 'middle' }}>用户信息管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item className='nav-text' key='video-manage'>
                <Link to={urls.VIDEO_MANAGE}>
                    <Icon><MdVideo /></Icon><span style={{ verticalAlign: 'middle' }}>视频管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item key='user-video-manage'>
                <Link to={urls.USER_VIDEO_MANAGE}>
                    <Icon><MdVideo /></Icon><span style={{ verticalAlign: 'middle' }}>短视频管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item className='nav-text' key='label-list'>
                <Link to={urls.LABEL}>
                    <Icon type='tag-o' /><span>标签管理</span>
                </Link>
            </Menu.Item>
            <SubMenu
                key='channel'
                title={<span><Icon type='bars' /><span className='nav-text'>频道管理</span></span>}
            >
                <Menu.Item key='channel-list'><Link to={urls.CHANNELAPP}>APP频道配置</Link></Menu.Item>
                <Menu.Item key='channel-town'><Link to={`${urls.HOME}/channel-town`}>APP新城镇频道配置</Link></Menu.Item>
                <Menu.Item key='channel-app-pc'><Link to={`${urls.HOME}/channel-app-pc`}>PC频道配置</Link></Menu.Item>
            </SubMenu>
            <SubMenu
                key='ott'
                title={<span><Icon type='mobile' /><span className='nav-text'>OTT配置</span></span>}
            >
                <Menu.Item key='channel-app-ott'><Link to={urls.OTT_CHANNEL}>频道配置</Link></Menu.Item>
                <Menu.Item key='OTTLive'><Link to={`${urls.OTT_LIVE}?1`}>点播配置</Link></Menu.Item>
                <Menu.Item key='OTTNew'><Link to={`${urls.OTT_LIVE}?2`}>资讯配置</Link></Menu.Item>
                <Menu.Item key='OTTRecommend'><Link to={`${urls.OTT_LIVE}?3`}>推荐配置</Link></Menu.Item>
            </SubMenu>
            <SubMenu
                key='sub-live'
                title={<span><Icon type='video-camera' /><span className='nav-text'>直播管理</span></span>}
            >
                <Menu.Item key='live-list'><Link to={urls.LIVE_LIST}>活动直播</Link></Menu.Item>
                <Menu.Item key='webpage-subject'><Link to={urls.WEBSUBJECT}>网页专题管理</Link></Menu.Item>
            </SubMenu>
            <SubMenu
                key='tv-live'
                title={<span><Icon type='laptop' /><span className='nav-text'>TV管理</span></span>}
            >
                <Menu.Item key='tv-admin'><Link to={urls.TV_ADMIN}>播放管理</Link></Menu.Item>
                <Menu.Item key='tv-marq'><Link to={urls.MARQ_ADMIN}>轮播跑马灯管理</Link></Menu.Item>
            </SubMenu>
            <Menu.Item className='nav-text' key='advert'><Link to={urls.ADVERT_ADMIN}>
                <Icon type='coffee' /><span>广告管理</span></Link>
            </Menu.Item>
            <SubMenu
                key='App'
                title={<span><Icon type='mobile' /><span className='nav-text'>版本更新</span></span>}
            >
                <Menu.Item key='remind-A'><Link to={`${urls.HOME}/UpdateRemind/A`}>android更新提示</Link></Menu.Item>
                <Menu.Item key='remind-I'><Link to={`${urls.HOME}/UpdateRemind/I`}>ios更新提示</Link></Menu.Item>
            </SubMenu>
        </Menu>
    _simpleMenu = () =>
        <Menu mode={this.state.mode} openKeys={this.state.openKeys} onClick={this._setKey} defaultSelectedKeys={[this.props.selectedMenu.menuKey || getMenuMap(this.props.location.pathname + this.props.location.search)]}>
            <Menu.Item className='nav-text' key='video-manage-simple'>
                <Link to={urls.VIDEO_MANAGE_SIMPLE}>
                    <Icon><MdVideo /></Icon><span style={{ verticalAlign: 'middle' }}>视频管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item className='nav-text' key='label-list-simple'>
                <Link to={urls.LABEL_SIMPLE}>
                    <Icon type='tag-o' /><span>标签管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item className='nav-text' key='label-channel-ott-detail-simple'>
                <Link to={`${urls.CHANNEL_OTT_DETAIL_SIMPLE}/100`}>
                    <Icon type='tag-o' /><span>电影频道配置</span>
                </Link>
            </Menu.Item>
            {/* <Menu.Item className='nav-text' key='OTTRecommendDetail'>
                <Link to={`${urls.OTT_LIVE_SIMPLE}`}>
                    <Icon type='tag-o' /><span>推荐配置</span>
                </Link>
            </Menu.Item> */}
        </Menu>
    render() {
        if ((!this.props.selectedMenu.menuType || this.props.selectedMenu.menuType === urls.HOME) && !this.props.location.pathname.startsWith('/simple')) {
            return (
                this._appMenu()
            );
        }
        if (this.props.selectedMenu.menuType === urls.SIMPLE || this.props.location.pathname.startsWith('/simple')) {
            return (
                this._simpleMenu()
            );
        }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(YXMenu));
