import React, { Component } from 'react';
import { message, Modal } from 'antd';
import Bookshelf from '../../components/Bookshelf/BookshelfForPc';
import fetcher from '../../utils/fetch';
import { sortElm } from '../../utils/util';
import UpdateModal from './UpdateModal';
import WrapFormModal from './WrapFormModal';
import { REQ_URL } from '../../constants/constants';

const { confirm } = Modal;

// 获取数据之后有处理，获取成功提示
// 是否拉取新的数据
const handleFetchFn = (fn) => {
    return async(...args) => {
        try {
            const res = await fn.apply(null, args);
            if (res.code === 0) {
                return res.data;
            } else {
                message.error(res.errmsg);
            }
        } catch (error) {
            console.error(error);
        }
    };
};

const handleUpdateFn = (fn, context, msg) => {
    return async(...args) => {
        try {
            const res = await fn.apply(null, args);
            if (res.code === 0) {
                message.success(msg);
                await context.getInitData();
            } else {
                message.error(res.errmsg);
            }
        } catch (error) {
            console.error(error);
        }
    };
};

class ChannelAppForTown extends Component {
    state = {
        channel: null,
        modalTitle: '',
        curUpdateChannel: null
    }

    bodys = [{
        name: '修改', // 操作的名称
        click: (group, groupIndex, secoundChannel) => this.showEditChannelModal(secoundChannel),
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
        click: (channel, channelIndex, secoundChannel) => this.handleChannelRemove(secoundChannel),
        width: '30%',
        iconSize: '18px',
        icon: 'close',
    }]

    footers = [{
        name: '新增二级',
        click: (channel) => this.showAddChannelModal(),
        width: '20%',
        color: '#49a9ee',
    }, {
        name: '编辑',
        click: (channel) => this.showEditChannelModal(channel),
        width: '20%',
        color: '#49a9ee'
    }, {
        name: '更新排序',
        click: (channel, channelIndex) => this.updateSort(channelIndex),
        width: '20%',
        color: '#49a9ee'
    }]

    removeChannel = handleUpdateFn(async(channel) => {
        const res = await fetcher(REQ_URL.REMOVE_MOVE_CHANNEL, { channelId: channel.id });
        return res;
    }, this, '删除成功')

    handleChannelRemove = (channel) => {
        if (channel.enable === 1) {
            message.warn('已启用状态的频道不可删除');
        } else {
            confirm({
                title: '提示',
                content: '菜单删除后，所作的配置也将被删除，确定要删除吗？',
                onOk: () => this.removeChannel(channel)
            });
        }
    }

    showAddChannelModal = (channel) => {
        this.props.showModal();
        this.setState({
            modalTitle: '新增',
            curUpdateChannel: null
        });
    }

    showEditChannelModal = (channel) => {
        this.props.showModal();
        this.setState({
            modalTitle: '编辑',
            curUpdateChannel: channel
        });
    }

    handleClickSetBtn = (channel) => {
        this.props.match.history.push('/app/channel-town/' + channel.id, channel);
    }

    dragChannel = (oldIndex, newIndex, channels) => {
        if (oldIndex === newIndex) return;
        const newChannels = sortElm(newIndex, oldIndex, channels);
        const secoundChannels = newChannels;
        this.setState({
            channel: {
                ...this.state.channel,
                secoundChannels
            }
        });
    }

    updateSort = handleUpdateFn(async() => {
        const { channel } = this.state;
        if (!channel || !channel.secoundChannels) return;
        const { secoundChannels } = channel;
        const channels = secoundChannels.map((secoundChannel, index) => {
            return {
                // ...secoundChannel,
                channelId: secoundChannel.id,
                sort: index
            };
        });
        const res = await fetcher(REQ_URL.SORT_MOVE_CHANNEL, {
            json: JSON.stringify(channels)
        });
        return res;
    }, this, '保存排序成功')

    getCurSecondMaxSort = (channel) => {
        if (!channel || !Array.isArray(channel.secoundChannels) || channel.secoundChannels.length < 1) return 1;
        return Number(channel.secoundChannels[channel.secoundChannels.length - 1].sort);
    }

    handleEditChannel = handleUpdateFn(async(values) => {
        const { channel, modalTitle, curUpdateChannel } = this.state;
        const api = modalTitle === '新增' ? REQ_URL.ADD_MOVE_CHANNEL : REQ_URL.MODIFY_MOBILE_CHANNEL;
        const sort = modalTitle === '新增' ? this.getCurSecondMaxSort(channel) + 1 : curUpdateChannel.sort;
        values = {
            ...values,
            enable: Number(values.enable),
            sort,
            bannerOn: 0,
            pid: channel.id
        };
        if (modalTitle !== '新增') {
            values = {
                ...values,
                id: curUpdateChannel.id
            };
        }
        const res = await fetcher(api, values);
        return res;
    }, this, '更新成功')

    fetchAllChannels = handleFetchFn(async() => {
        const res = await fetcher(REQ_URL.NEW_TOEN_CHANNEL, {});
        return res;
    })

    getInitData = async() => {
        const channel = await this.fetchAllChannels();
        if (channel) {
            channel.secoundChannels = channel.secondChannel;
        }
        this.setState({
            channel
        });
    }

    async componentDidMount() {
        await this.getInitData();
    }

    render() {
        const { setForm, formVisible, handleSubmit, closeModal } = this.props;
        const { channel, modalTitle, curUpdateChannel } = this.state;
        let channels = channel ? [channel] : [];
        const modalConfig = {
            visible: formVisible,
            title: modalTitle,
            onOk: () => handleSubmit(this.handleEditChannel),
            onCancel: closeModal
        };
        return (
            <div>
                <Bookshelf
                    groups={channels}
                    bodys={this.bodys}
                    footers={this.footers}
                    dragChannel={this.dragChannel}
                    dehaze={false}
                />
                <UpdateModal
                    ref={setForm}
                    modalConfig={modalConfig}
                    modalChannel={curUpdateChannel}
                />
            </div>
        );
    }
}

export default WrapFormModal(ChannelAppForTown);
