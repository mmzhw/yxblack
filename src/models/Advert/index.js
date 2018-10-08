import React, { Component } from 'react';
import { Menu, Card, message, Icon } from 'antd';
// import YXErrorMsg from '../../components/Errormsg'
import style from './index.module.css';
import yxFetch from '../../utils/fetch';
import * as urls from '../../constants/urls';
import { imgPrefix } from '../../utils/index';
import {
    Link,
} from 'react-router-dom';

class advert extends Component {
    constructor(props) {
        super(props);
        this.mounted = true;
        this.state = {
            currentKey: 'pc',
            curr: 'app',
            pcAdvertList: {
                index: [],
                play: []
            },
            appAdvertList: {}
        };
        this.testingState = this.testingState.bind(this);
    }
    componentDidMount() {
        this.state.currentKey === 'pc' ? this.fetchPcList() : this.fetchAppList();
        this.testingState();
    }
    componentWillMount() {
        if (this.props.match.match.url.indexOf('/advertAdmin/app') > 0) {
            if (this.mounted) {
                this.setState({
                    currentKey: 'app'
                });
            }
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    testingState() {
        if (this.state.currentKey === 'pc') {
            return this.state.pcAdvertList;
        } else {
            return this.state.appAdvertList;
        }
    }
    handleImgUrl(imgUrl) {
        if (imgUrl.indexOf('http://') === -1) {
            return imgPrefix + imgUrl + '?imageView2/2/w/1180/h/120/q/100|imageslim';
        } else {
            return imgUrl;
        }
    }
    handleAppImgUrl(imgUrl) {
        if (imgUrl.indexOf('http://') === -1) {
            return imgPrefix + imgUrl + '?imageView2/2/w/200/h/355/q/100|imageslim';
        } else {
            return imgUrl;
        }
    }
    setList(state) {
        if (!state.length) return <div className={ style['advert-no']}><Icon type='frown-o' />暂无数据</div>;
        return (
            state.map((item) => {
                const rightExtra = <div className={ style['right-corner'] }>
                    {
                        item.enableStatus ? <div className={ style['use-corner'] }>已启用</div> : <div className={ style['unuse-corner'] }>未启用</div>
                    }
                </div>;
                return (
                    <Card className={style['advert-card']} key={item.adId} title={item.title ? item.title : '未命名'} extra={rightExtra} bodyStyle={{ padding: 10 }}>
                        <div>
                            <Link to={`${urls.ADVERT_ADMIN}/pc/${item.adId}`}>
                                <img alt='' className={style['card-img']} src={item.imageUrl ? this.handleImgUrl(item.imageUrl) : require('../../assets/advert-59-6.png')} />
                            </Link>
                        </div>
                        <div>
                            <p style={{ fontSize: 16 }}>位置：{item.location}</p>
                        </div>
                    </Card>
                );
            })
        );
    }

    setAppList(state) {
        if (Object.keys(state).length !== 0) {
            let res = [];
            for (let key in state) {
                const rightExtra = <div className={style['right-corner']}>
                    {
                        state[key][0].enableStatus ? <div className={style['use-corner']}>已启用</div> : <div className={style['unuse-corner']}>未启用</div>
                    }
                </div>;
                let name = '未知';
                if (state[key][0].adId === '10001') {
                    name = '首页悬浮';
                } else if (state[key][0].adId === '10002') {
                    name = '启动页';
                } else if (state[key][0].adId === '10003') {
                    name = '播放页面';
                }
                res.push(
                    <Card className={style['advert-app-card']} key={state[key][0].adId} title={state[key][0].title ? state[key][0].title : '未命名'} extra={rightExtra} bodyStyle={{ padding: 10 }}>
                        <div>
                            <Link to={`${urls.ADVERT_ADMIN}/app/${state[key][0].adId}`}>
                                <img alt='' className={style['card-img']} src={state[key][0].imageUrl ? this.handleAppImgUrl(state[key][0].imageUrl) : require('../../assets/none-2-3.png')} />
                            </Link>
                        </div>
                        <div>
                            <p style={{ fontSize: 16 }}>位置：{name}</p>
                        </div>
                    </Card>
                );
            }
            return res;
        }
        return <div className={style['advert-no']}><Icon type='frown-o' />暂无数据</div>;
    }

    render() {
        let listData = this.testingState();
        return (
            <div>
                <Menu mode='horizontal' selectedKeys={[this.state.currentKey]}>
                    <Menu.Item key='pc'>
                        <Link to={urls.ADVERT_ADMIN}>PC</Link>
                    </Menu.Item>
                    <Menu.Item key='app'>
                        <Link to={`${urls.ADVERT_ADMIN}/app`}>APP</Link>
                    </Menu.Item>
                </Menu>
                {this.state.currentKey === 'pc' ? <div>
                    <p className={ style['title'] }>首页</p>
                    <div className={ style['liveitem-container'] }>
                        { this.setList(listData.index) }
                    </div>
                    <p className={ style['title'] }>播放页</p>
                    <div className={ style['liveitem-container'] }>
                        { this.setList(listData.play) }
                    </div>
                </div> : <div>
                    <div className={style['liveitem-container']}>
                        {this.setAppList(listData)}
                    </div>
                </div>
                }
            </div>
        );
    }
    async fetchPcList() {
        const advertLocation = ['卡片模块#1之下', '卡片模块#2之下', '卡片模块#3之下', '最后一个卡片模块之下', '#相关推荐#之下', '#猜你喜欢#之下'];
        let res = await yxFetch('back/web/ad/list/v1', {});
        if (res.code === 0) {
            let AdvertList = res.data;
            AdvertList.forEach((item, index) => {
                item.location = advertLocation[index];
            });
            let AdvertListLen = AdvertList.length + 1;
            let pcAdvertList = {};
            pcAdvertList.index = AdvertList.slice(0, 4);
            pcAdvertList.play = AdvertList.slice(4, AdvertListLen);
            if (this.mounted) {
                this.setState({
                    pcAdvertList
                });
            }
        } else {
            message.error(res.errmsg);
        }
    }
    async fetchAppList() {
    // const advertLocation = ['首页悬浮', '启动页']
        let res = await yxFetch('back/ad/list', { adids: '10001,10002,10003' });
        if (res.code === 0) {
            let AdvertList = res.data;
            // AdvertList.forEach((item, index) => {
            //   item.location = advertLocation[index]
            // })
            // let appAdvertList = {}

            if (this.mounted) {
                this.setState({
                    appAdvertList: AdvertList
                });
            }
            // let AdvertListLen = AdvertList.length + 1
            // let pcAdvertList = {}
            // pcAdvertList.index = AdvertList.slice(0, 4)
            // pcAdvertList.play = AdvertList.slice(4, AdvertListLen)
            // if (this.mounted) {
            //   this.setState({
            //     pcAdvertList
            //   })
            // }
        } else {
            message.error(res.errmsg);
        }
    }
}

export default advert;
