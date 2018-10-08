// pc 端频道配置页面
import React, { Component } from 'react';
import Bookshelf from './BookshelfForOTT';
import UpdateModal from './UpdateModal';
import { message, Modal } from 'antd/lib/index';
import fetcher from '../../utils/fetch';
import { REQ_URL } from '../../constants/constants';

export default class ChannelOTT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: 0,
            channels: [], // 一共有多少个频道
            modalChannel: null, // 要更改的 channel 的所有信息
            modalConfig: null, // 弹出的 modal 层的配置信息
            modalType: 1, // 1:增加频道，0：修改频道
        };
        this.dragChannel.bind(this);
    }

    componentDidMount() {
        // todo 获取初始化数据
        this.initChannel();
    }

    async initChannel() {
        let channels = await this.fetchChannelApps();
        if (this.state.channels) {
            channels = channels.map((channel, index) => {
                if (this.state.channels.length > 0) {
                    channel.isSecondAppear = this.state.channels.isSecondAppear;
                }
                return channel;
            });
        }
        channels = this.formatSort(channels);
        this.setState({
            channels: channels,
        });
    }

    formatSort(channels) {
        channels.map((channel, index) => {
            channel.secondChannels = channel.secondChannels.map((secondChannel, sIndex) => {
                secondChannel.sort = sIndex + 1;
                return secondChannel;
            });
            channel.cards = channel.cards.map((card, cIndex) => {
                card.sort = cIndex + 1;
                return card;
            });
            channel.sort = index + 1;
            return channel;
        });
        return channels;
    }

    // 获取所有频道数据 --- done
    async fetchChannelApps() {
        try {
            const res = await fetcher(REQ_URL.OTT_CHANNEL_DATA, { 'version': '1.0.0' });
            if (res.code === 0) {
                const channels = res.data;
                console.log('channels', channels);
                return channels;
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e.message || e);
        }
    }

    async sortChannels(channels, oldIndex, newIndex) {
        let data = [];
        channels.forEach((channel) => {
            data.push({
                channelId: channel.id,
                sort: channel.sort,
            });
        });

        try {
            const res = await fetcher(REQ_URL.SORT_CHANNEL, {
                json: data,
            });
            if (res.code === 0) {
                message.success('排序成功！');
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // 修改频道数据
    async sortCards(cards, channelId) {
        try {
            const res = await fetcher(REQ_URL.OTT_CARDS_CHANNEL, {
                channelId: channelId,
                version: '1.0.0',
                json: JSON.stringify({
                    cards: cards
                })
            });
            if (res.code === 0) {
                message.success('排序成功');
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            message.error(e.message || e);
        }
    }

    // 应该是更改整个channel，得到一个新的channel
    dragChannel(oldIndex, newIndex, dragChannels, leavel, index) {
        let channels = this.state.channels;
        dragChannels.splice(newIndex, 0, ...dragChannels.splice(oldIndex, 1));
        if (leavel === -1) {
            channels = this.formatSort(dragChannels);
            this.sortChannels(channels, oldIndex, newIndex);
        } else if (leavel === -2) { // 二级排序，关键词secoundChannels
            channels[index].secoundChannels = dragChannels;
            channels = this.formatSort(channels);
            this.sortChannels(channels, oldIndex, newIndex);
        } else if (leavel === -3) { // 一级卡片排序，关键词cards
            channels[index].cards = dragChannels;
            channels = this.formatSort(channels);
            this.sortCards(dragChannels, channels[index].id);
        }
        // this.initChannel();
    }

    // 新增一级 pid为0
    // 新增二级 pid为一级的id
    addChannel(pid, channel) {
        let sort = 0;
        if (pid === 0) {
            sort = this.state.channels.length;
        } else {
            sort = channel.secondChannels.length;
        }
        // 如果是新增一级频道, channel 传过来 为null
        this.setState({
            pid,
            modalType: 1,
            modalChannel: null,
            modalConfig: {
                visible: true,
                title: '新增',
                onOk: this.handleSubmit.bind(this, sort),
                onCancel: this.closeUpdateModal.bind(this)
            }
        });
    }

    // 点击编辑按钮（一级/二级）
    editChannel(pid, channel) {
        this.setState({
            pid,
            modalType: 0,
            modalChannel: channel,
            modalConfig: {
                visible: true,
                title: '编辑',
                onOk: this.handleSubmit.bind(this, null),
                onCancel: this.closeUpdateModal.bind(this)
            },
        });
    }

    // 点击删除频道按钮(一级/二级) --- done
    handleClickRemoveBtn(channelData) {
        let self = this;
        // 解构赋值
        let { id: channelId, pid: channelPid, enable } = channelData;

        let canDelete = Number(enable) === 0;
        if (!channelPid) { // channelPid = 0 的为一级菜单
            // 删除的如果是一节菜单，需要判断其二级菜单的启用情况
            // 只有一级和二级菜单都不启用时才能删除
            let secoundChannels = channelData.secoundChannels || [];
            canDelete = channelData.enable === 0 && secoundChannels.every(secoundChannel => secoundChannel.enable !== 1);
        }
        // 根据删除的是一级还是二级频道来确定提示文字
        let content = Number(channelPid) === 0 ? '一级菜单删除后，对应的二级菜单和所作的配置也将被删除，确定要删除吗？' : '删除后用户将不再能看到该视频，且删除后不可恢复，确认删除么？';

        Modal.confirm({
            title: '提示',
            content,
            async onOk() {
                if (!canDelete) {
                    message.error('该菜单处于启用状态，不能删除!');
                    return;
                }
                await self.removeChannel(channelId);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    async removeChannel(channelId) {
        try {
            let res = await fetcher(REQ_URL.OTT_DELETE_CHANNEL, {
                channelId
            });
            if (res.code === 0) {
                this.initChannel();
                message.success('删除成功!');
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e.message || e);
        }
    }

    closeUpdateModal() {
        this.updateForm.resetFields();
        this.setState({
            modalConfig: null,
            modalChannel: null,
        });
    }

    handleSubmit(sort) {
        const form = this.updateForm;
        const { pid, modalChannel, modalType } = this.state;
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            const newValues = {
                pid,
                ...modalChannel,
                ...values,
                enable: Number(values.enable),
            };

            if (sort) {
                newValues.sort = sort;
            }

            // modalType：1为增加，0为修改
            const api = modalType ? REQ_URL.OTT_ADD_CHANNEL : REQ_URL.OTT_MODIFY_CHANNEL;
            try {
                const res = await fetcher(api, { ...newValues });
                if (res.code === 0) {
                    message.success(modalChannel ? '修改成功！' : '新增成功！');
                    await this.initChannel();
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

    // 点击频道配置按钮(一级/二级) --- done
    toEditChannel(channel, sort) {
        if (sort) {
            this.props.match.history.push('/app/channelOTTDetail/' + channel.id + '?' + sort || 0, channel);
        } else {
            this.props.match.history.push('/app/channelOTTDetail/' + channel.id, channel);
        }
    }

    async publish(id) {
        let res = await fetcher(REQ_URL.OTT_PUBLISH, {
            channelId: id,
            version: '1.0.0',
        });
        if (res.code === 0) {
            message.success('发布成功');
        } else {
            message.error('发布失败');
        }
    }

    // 修改，保存频道数据
    async updataChannelReq(cards, channelId) {
        try {
            const res = await fetcher(REQ_URL.OTT_CARDS_CHANNEL, {
                channelId: channelId,
                version: '1.0.0',
                json: JSON.stringify({
                    cards: cards
                })
            });
            if (res.code === 0) {
                this.initChannel();
                message.success('修改成功');
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            message.error(e.message || e);
        }
    }

    removeCard(group, cardIndex) {
        let cards = group.cards;
        let channelId = group.id;
        cards = cards.filter((carad, index) => {
            return cardIndex !== index;
        });
        this.updataChannelReq(cards, channelId);
    }

    render() {
        return (
            <div>
                <UpdateModal
                    ref={(form) => {
                        this.updateForm = form;
                    }}
                    modalConfig={this.state.modalConfig}
                    modalChannel={this.state.modalChannel}
                />
                <Bookshelf
                    groups={this.state.channels}
                    dragChannel={this.dragChannel.bind(this)}
                    addChannel={this.addChannel.bind(this)}
                    editChannel={this.editChannel.bind(this)}
                    removeChannel={this.handleClickRemoveBtn.bind(this)}
                    removeCard={this.removeCard.bind(this)}
                    toEditChannel={this.toEditChannel.bind(this)}
                    publish={this.publish.bind(this)}
                />
            </div>
        );
    }
}
