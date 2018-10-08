// 新版频道配置，PC端配置
import React, { Component } from 'react';
import { message } from 'antd';
import fetcher from '../../../utils/fetch';
import BannerPreview from './BannerPreview';
import PropTypes from 'prop-types';
import BannerConfigForPc from '../videoConfig/BannerConfigForPc';
import { List } from 'immutable';
import { REQ_URL } from '../../../constants/constants';

export default class ChannelAppDetail extends Component {
    static PropTypes = {
        channel: PropTypes.object,
        bannerConfigType: PropTypes.number,
        curBannerIndex: PropTypes.number
    }

    initData = {
        banners: []
    }

    state = {
        banners: [],
        cards: [],
        bannerConfigType: this.props.bannerConfigType, // 0为对banner整体的操作，1为对单个banner的操作
        curBannerIndex: this.props.curBannerIndex
    }

    fetchBanners = async() => {
        try {
            const channelId = this.props.channel.id;
            const res = await fetcher(REQ_URL.WEB_BANNER, { channelId });
            if (res.code === 0) {
                return res.data;
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e);
        }
    }

    modifyBannerConfigType = (type, banner) => {
        this.setState({
            bannerConfigType: 1,
        });
    }

    modifyBannerIndex = (bannerIndex) => {
        if (bannerIndex === this.state.curBannerIndex) return;
        this.setState({
            curBannerIndex: bannerIndex,
        });
    }

    getImageId = async(imageUrl) => {
        try {
            const res = await fetcher(REQ_URL.ADD_IMG, { scale: 1, url: imageUrl });
            let imageId = '';
            if (res.code === 0) {
                imageId = res.data.id;
                return imageId;
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e);
        }
    }

    getCurBanner = () => {
        return this.state.banners[this.state.curBannerIndex];
    }

    handleSaveBanner = async(banner) => {
        const apiUrl = banner.id ? REQ_URL.MODIFY_BANNER : REQ_URL.ADD_BANNER;
        const curBanner = this.getCurBanner();
        if (!banner.imageUrl) return message.error('请配置图片');
        try {
            let imageId = banner.imageId;
            if (!curBanner || !curBanner.id || banner.imageUrl !== curBanner.imageUrl) {
                imageId = await this.getImageId(banner.imageUrl);
            }

            if (!curBanner.id) {
                // banner.sort = banner.sort
                banner.channelId = this.props.channel.id;
            }
            const res = await fetcher(apiUrl, { ...banner, imageId });
            if (res.code === 0) {
                message.success('保存成功');
                await this.getInitData();
            } else {
                message.error(res.errmsg);
            }
        } catch (e) {
            console.error(e);
        }
    }

    sortBanners = (banners) => {
        return banners && banners.sort((banner1, banner2) => {
            return banner1.sort - banner2.sort;
        });
    }

    getInitData = async() => {
        let preBanners = await this.fetchBanners();
        if (!preBanners || preBanners.length < 1) {
            preBanners = [{
                sort: 1
            }];
        }
        const banners = this.sortBanners(preBanners);
        this.initData.banners = banners;
        const channel = this.props.channel;
        // 重新获取频道的信息
        const res = await fetcher(REQ_URL.SEARCH_CHANNEL, { channelId: channel.id });
        const nowChannel = res.data;
        const newChannel = {
            ...channel,
            bannerOn: nowChannel.bannerOn
        };
        this.setState({
            banners,
            channel: newChannel
        });
    }

    modifyChannel = async(channel) => {
        try {
            const res = await fetcher(REQ_URL.MODIFY_CHANNEL, channel);
            if (res.code === 0) {
                message.success('修改成功');
                this.setState({ channel });
            } else {
                message.error('修改失败');
            }
        } catch (e) {
            console.error(e);
        }
    }

    enableBanner = (bannerOn) => {
        const { channel } = this.state;
        if (channel.bannerOn !== bannerOn) {
            const channel1 = { ...channel, bannerOn };
            this.modifyChannel(channel1);
        }
    }

    addBanner = () => {
        const { banners, channel } = this.state;
        const lastBanner = banners[banners.length - 1];
        const maxSort = lastBanner ? lastBanner.sort : 0;
        const banners1 = List(banners);
        const banners2 = banners1.push({
            channelId: channel.id,
            title: '',
            secondTitle: '',
            sort: Number(maxSort) + 1,
            imageUrl: ''
        });
        const newBanners = banners2.toArray();
        this.setState({
            curBannerIndex: newBanners.length - 1,
            banners: newBanners,
            bannerConfigType: 1
        });
    }

    deleteBanner = async(banner) => {
        const bannerId = banner.id;
        try {
            const res = await fetcher(REQ_URL.REMOVE_BANNER, { bannerId });
            if (res.code === 0) {
                message.success('删除成功');
                this.setState({
                    curBannerIndex: 0,
                });
                await this.getInitData();
            } else {
                message.error('删除失败');
            }
        } catch (e) {
            console.error(e);
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.bannerConfigType !== nextState.bannerConfigType) {
            this.setState({
                bannerConfigType: nextProps.bannerConfigType,
                curBannerIndex: nextProps.curBannerIndex,
                banners: this.initData.banners
            });
        }
    }

    componentDidMount() {
        this.getInitData();
    }

    render() {
        const { banners, channel, bannerConfigType, curBannerIndex } = this.state;
        const curBanner = banners && banners[curBannerIndex];
        return (
            <div>
                <BannerPreview
                    banners={banners}
                    channel={channel}
                    curBannerIndex={curBannerIndex}
                    modifyBannerIndex={this.modifyBannerIndex}
                    modifyBannerConfigType={this.modifyBannerConfigType}
                />
                <BannerConfigForPc
                    banners={banners}
                    channel={channel}
                    addBanner={this.addBanner}
                    bannerNumber={banners ? banners.length : 0}
                    enableBanner={this.enableBanner}
                    configType={bannerConfigType}
                    banner={curBanner}
                    handleSaveBanner={this.handleSaveBanner}
                    deleteBanner={this.deleteBanner}
                />
            </div>
        );
    }
}
