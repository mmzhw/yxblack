// pc 端频道配置页面
import React, { Component } from 'react';
import Bookshelf from '../../components/Bookshelf/BookshelfForPc';
import { message, Modal } from 'antd';
import { REQ_URL } from '../../constants/constants';

import { List } from 'immutable';

import fetcher from '../../utils/fetch';
import UpdateModal from './UpdateModal';

const { confirm } = Modal;

export default class ChannelApp extends Component {
    state = {
        channels: [], // 一共有多少个频道
        secondChannelsByDrag: null,
        pid: 0, // 要改变的频道的pid
        modalType: null, // 新增和更新两种, 'ADD', 'UPDATE'
        // modalType: false, // 'ADD', 'UPDATE' 新增和更新两种
        modalChannel: null, // 要更改的 channel 的所有信息
        modalConfig: null, // 弹出的 modal 层的配置信息
        modalParentChannel: null, // 要更改的 channel 的父级，二级菜单增加用
    }
    // 二级频道对应的操作
    bodys = [{
        name: '修改', // 操作的名称
        click: (group, groupIndex, secoundChannel) => this.editChannel.call(null, group.id, secoundChannel),
        width: '30%',
        iconSize: '18px',
        icon: 'edit', // 操作对应的 icon
    }, {
        name: '设置',
        click: (channel, channelIndex, secoundChannel) => this.handleClickSetBtn(secoundChannel),
        width: '30%',
        iconSize: '18px',
        icon: 'setting',
    }, {
        name: '删除',
        click: (channel, channelIndex, secoundChannel) => this.handleClickRemoveBtn(secoundChannel),
        width: '30%',
        iconSize: '18px',
        icon: 'close',
    }]
    // 一级频道对应的操作
    footers = [{
        name: '新增二级',
        click: (channel) => this.addChannel.call(null, 1, channel),
        width: '20%',
        color: '#49a9ee',
    }, {
        name: '删除',
        click: (channelData) => this.handleClickRemoveBtn(channelData),
        width: '20%',
        color: '#49a9ee'
    }, {
        name: '编辑',
        click: (channel) => this.editChannel.call(null, 0, channel),
        width: '20%',
        color: '#49a9ee'
    }, {
        name: '频道配置',
        click: (channel) => this.handleClickSetBtn(channel),
        width: '20%',
        color: '#49a9ee'
    }, {
        name: '发布',
        click: (channel) => this.publish(channel),
        width: '20%',
        color: '#49a9ee'
    }]

    async publish(channel) {
        let channelIds = [];
        channelIds.push(channel.id);
        // 因为二级频道存在，需要一起发布
        if (channel.secoundChannels && channel.secoundChannels.length > 0) {
            channel.secoundChannels.forEach((secoundChannel) => {
                channelIds.push(secoundChannel.id);
            });
        }
        const res = await fetcher(REQ_URL.PC_PUBLISH, { channelIds: channelIds });
        if (res.code === 0) {
            message.success('发布成功');
        } else {
            message.error(res.errmsg);
        }
    }

    // 获取所有频道数据 --- done
    fetchChannelApps = async () => {
        try {
            const res = await fetcher(REQ_URL.CHANNEL_DATA, {});
            if (res.code === 0) {
                const channels = res.data;
                return channels;
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e.message || e);
        }
    }
    // 删除频道（一级/二级）---- done
    removeChannel = async channelId => {
        try {
            const res = await fetcher(REQ_URL.REMOVE_CHANNEL, {
                channelId
            });
            if (res.code === 0) {
                message.success('删除成功!');
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e.message || e);
        }
    }
    // 点击频道配置按钮(一级/二级) --- done
    handleClickSetBtn = (channel) => {
        this.props.match.history.push('/app/channel-detail/' + channel.id, channel);
    }
    // 点击删除频道按钮(一级/二级) --- done
    handleClickRemoveBtn = channelData => {
        const that = this;
        // 解构赋值
        const { id: channelId, pid: channelPid, enable } = channelData;
        let canDelete = Number(enable) === 0;
        if (!channelPid) { // channelPid = 0 的为一级菜单
            // 删除的如果是一节菜单，需要判断其二级菜单的启用情况
            // 只有一级和二级菜单都不启用时才能删除
            const secoundChannels = channelData.secoundChannels || [];
            canDelete = channelData.enable === 0 && secoundChannels.every(secoundChannel => secoundChannel.enable !== 1);
        }
        // 根据删除的是一级还是二级频道来确定提示文字
        let content = '删除后用户将不再能看到该视频，且删除后不可恢复，确认删除么？';
        switch (Number(channelPid)) {
            case 0:
                content = '一级菜单删除后，对应的二级菜单和所作的配置也将被删除，确定要删除吗？';
                break;
            default:
                break;
        }
        confirm({
            title: '提示',
            content,
            async onOk () {
                if (!canDelete) {
                    message.error('该菜单处于启用状态，不能删除!');
                    return;
                }
                await that.removeChannel(channelId);
                that.getInitData();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // 点击编辑按钮（一级/二级）--- done
    editChannel = (pid, channel) => {
        this.setState({
            pid,
            modalType: 'UPDATE',
            modalChannel: channel,
            modalConfig: {
                visible: true,
                title: '编辑',
                onOk: this.handleSubmit,
                onCancel: this.closeUpdateModal
            },
            modalParentChannel: null,
        });
    }
    // 新增一级 pid= 0, 不需要 fatherchannel
    // 新增二级 pid 需要 fatherchannel
    addChannel = (pid, channel) => {
    // 如果是新增一级频道, channel 传过来 为null
        this.setState({
            pid,
            modalType: 'ADD',
            modalParentChannel: channel,
            modalConfig: {
                visible: true,
                title: '新增',
                onOk: this.handleSubmit,
                onCancel: this.closeUpdateModal
            }
        });
    }

    // 关闭 modal 层 --- done
    closeUpdateModal = () => {
    // 清空表单数据
        this.updateForm.resetFields();
        this.setState({
            modalType: null,
            modalConfig: null,
            modalChannel: null,
            modalParentChannel: null
        });
    }
    // 应该是更改整个channel，得到一个新的channel
    dragChannel = (oldIndex, newIndex, dragChannels, leavel) => {
    // oldIndex 按下拖动的频道的 index
        const channelsByDrag = dragChannels.slice();
        const moveChannel = channelsByDrag[oldIndex];
        channelsByDrag.splice(oldIndex, 1);
        const beforeChangeChannels = channelsByDrag.slice(0, newIndex);
        const changeChannels = channelsByDrag.slice(newIndex);
        const newChannels = beforeChangeChannels.concat(moveChannel, changeChannels).map((channel, index) => {
            return {
                ...channel,
                sort: index + 1
            };
        });
        let resultChannels = null;
        // 一级排序
        if (leavel !== -1) {
            let channels1 = List(this.state.channels);
            channels1.get(leavel).secoundChannels = newChannels;
            resultChannels = channels1.toArray();
        } else {
            resultChannels = newChannels;
        }
        if (resultChannels) {
            this.updateSort(resultChannels, leavel);
        }
    }

    handleSubmit = () => {
        const form = this.updateForm;
        const { pid, modalChannel, modalParentChannel } = this.state;
        form.validateFields(async(err, values) => {
            if (err) {
                return;
            }
            const newValues = {
                ...modalChannel,
                ...values,
                enable: Number(values.enable),
                bannerOn: modalChannel ? modalChannel.bannerOn : 0
            };
            if (modalParentChannel) {
                newValues.pid = modalParentChannel.id;
            } else {
                newValues.pid = 0;
            }
            // debugger
            // 有 modalChannel 为修改
            const api = modalChannel ? REQ_URL.MODIFY_CHANNEL : REQ_URL.ADD_CHANNEL;
            try {
                const res = await fetcher(api, { pid, ...newValues });
                if (res.code === 0) {
                    message.success(modalChannel ? '修改成功！' : '新增成功！');
                    await this.getInitData();
                } else {
                    message.error(res.errmsg);
                }
            } catch (e) {
                console.error(e);
            }

            form.resetFields();
            this.closeUpdateModal();
        });
    }

    showUpdateModal() {
        this.setState({
            isShowModal: true
        });
    }

    closeUpdateModal = () => {
        this.updateForm.resetFields();
        this.setState({
            modalConfig: null,
            modalChannel: null,
            modalParentChannel: null
        });
    }
    // 排序需要整理数据
    transformIdToChannelId = (channel) => {
        if (!channel) return;
        let newChannel = { ...channel };
        newChannel.channelId = newChannel.id;
        return newChannel;
    }
    // 更新排序
    async updateSort(newChannel, leavel) {
        this.setState({
            channels: newChannel,
        });

        let channelsByDrag = null;
        if (leavel === -1) {
            channelsByDrag = newChannel;
        } else {
            channelsByDrag = newChannel[leavel].secoundChannels;
        }
        if (!channelsByDrag) return;
        const newChannelsByDrag = channelsByDrag.map(this.transformIdToChannelId);
        try {
            // debugger
            const res = await fetcher(REQ_URL.SORT_WEB_CHANNEL, { json: newChannelsByDrag });
            if (res.code === 0) {
                message.success('更新成功！');
                await this.getInitData();
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // 拖拽排序
    sortChannels = (channels) => {
        return channels.sort((channel1, channel2) => {
            return channel1.sort - channel2.sort;
        });
    }

    initSort = (channels) => {
        let newChannels = this.sortChannels(channels);
        newChannels.forEach(channel => {
            if (Array.isArray(channel.secoundChannels)) {
                channel.secoundChannels = this.sortChannels(channel.secoundChannels);
            }
        });
        return newChannels;
    }

    getInitData = async() => {
        const channels = await this.fetchChannelApps();
        const newChannels = this.initSort(channels);
        if (channels) this.setState({ channels: newChannels });
    }

    componentDidMount() {
        this.getInitData();
    }

    render() {
        const { channels, modalConfig, modalChannel } = this.state;
        return (
            <div style={{ overflow: 'hidden' }}>
                <UpdateModal
                    ref={(form) => { this.updateForm = form; }}
                    modalConfig={modalConfig}
                    modalChannel={modalChannel}
                />
                <Bookshelf
                    groups={channels}
                    bodys={this.bodys}
                    footers={this.footers}
                    dragChannel={this.dragChannel}
                    addChannel={this.addChannel.bind(this)}
                    dehaze={false}
                />
            </div>
        );
    }
}
