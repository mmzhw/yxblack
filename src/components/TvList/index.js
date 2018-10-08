import React, { Component } from 'react';
import Bookshelf from '../Bookshelf';
import style from './style.module.css';
import yxFetch from '../../utils/fetch';

class TvList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            channels: []
        };
    }
    componentWillMount() {
    // this.getGroups()
        this.getChannels();
        this.getRedisChannel(this.state.channels);
    }
    getGroups () {
        this.setState({
            groups: [
                {
                    sort: 1,
                    name: 'test23',
                    enable: 1,
                    labels: [
                        { name: '123', enable: 1 },
                        { name: '2', enable: 1 }
                    ]
                },
                {
                    sort: 2,
                    name: 'test2345',
                    enable: 0,
                    labels: [
                        { name: '123', enable: 1 },
                        { name: '2', enable: 1 }
                    ]
                }
            ]
        });
    }
    getChannels () {
        yxFetch('back/tv/channel', {
        })
            .then(({ res }) => {
                if (res.code === 0) {
                    this.setState({
                        channels: res.data || []
                    });
                    if (this.channels.length === 0) {
                        // this.isRedisCahnnelsEmpty = true
                    } else {
                        // this.getChannelTopics(this.channels) // 查询频道主题
                    }
                } else {
                    // this.dialogmsg = res.errmsg || '请求错误！'
                    // this.$refs.snackbar.open()
                }
            }).catch(() => {
                // this.dialogmsg = '系统错误！'
                // this.$refs.snackbar.open()
            });
    }
    getRedisChannel(channels) {
    // const self = this
        for (let i = 0; i < channels.length; i += 1) {
            yxFetch('back/tv/queryChannel', {
                channelId: channels[i].id,
                version: '1.0.0',
                userName: 'test2',
                accessToken: 'test2'
            })
                .then(({ res }) => {
                    // if (res.code === 0) {
                    // this.showNetworkError = false
                    if (res.data) { // 当redis频道不为空
                        // this.isRedisCahnnelsEmpty = false
                        this.setState({
                            groups: res.data.topic || []
                        });
                        // self.redisChannels[i].id = channels[i].id
                        // self.showImageUrl(i, this.redisChannels[i].imageId)
                        // if (i === channels.length - 1) {
                        //   self.copyChannelsToRedis(channels, this.redisChannels) // 如果数据库频道数量不一致
                        // }
                    } else { // 当redis频道为空的时候
                        // this.isRedisCahnnelsEmpty = true
                        // this.redisChannels = []
                        // self.copyChannelsToRedis(channels, this.redisChannels) // 如果数据库频道数量不一致
                    }
                    // }
                });
        }
    }
    deleteLabel () {}
    editLabel () {
    }
    editGroup () {
    }
    addLabel () {
    }
    render() {
        return (
            <div className={style.main}>
                <div> </div>
                <Bookshelf groups={this.state.groups} deleteLabel={this.deleteLabel} editLabel={this.editLabel} editGroup={this.editGroup} addLabel={this.addLabel}/>
            </div>
        );
    }
}

export default TvList;
