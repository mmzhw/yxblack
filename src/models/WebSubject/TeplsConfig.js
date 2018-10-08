// 配置模板页，所有的配置都包裹在这个页面;左侧菜单
import React, { Component } from 'react';
import style from './style.module.css';
import { message, Button, Popconfirm, Spin } from 'antd';
import LayoutMenus from '../../components/Menus/LayoutMenus';
import HeadImageConfig from './HeadImage';
import LiveStream from './LiveStream';
import PlayBack from './PlayBack';
import Advertise from './Advertise';
import AddCardModal from './AddCardModal';
import fetcher from '../../utils/fetch';
import { sortElm } from '../../utils/util';
import { REQ_URL } from '../../constants/constants';

let subjectId = '';

export default class TeplConfig extends Component {
    state = {
        curMenuIndex: 0,
        models: [],
        imageUrl: '',
        flag: true,
        modalOption: {
            visible: false,
            onOk: () => this.addCard(),
            onCancel: () => this.closeModal()
        },
    }

    layoutButtons = [
        (<Button key='新建卡片' type='primary' onClick={() => this.showModal()}>新建卡片</Button>),
        (<Button key='保存排序' type='primary' onClick={() => this.handleSaveMenuOrder()}>保存排序</Button>),
        (<Popconfirm key='删除卡片' title='确定要删除这个卡片吗？' onConfirm={() => this.deleteCard()}>
            <Button type='primary'>删除卡片</Button>
        </Popconfirm>)
    ]

    closeModal = () => {
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: false,
            },
            imageUrl: '',
            flag: true,
            loading: false
        });
    }

    deleteCard = async() => {
        const { curMenuIndex, models } = this.state;
        const curMenu = models[curMenuIndex];
        const id = curMenu.id;
        const res = await fetcher(REQ_URL.SPECIAL_CARD_DELETE, { id });
        if (res.code === 0) {
            this.setState({
                curMenuIndex: 0
            });
            await this.getInitData();
            message.success('删除成功');
        } else {
            message.error(res.ermsg);
        }
    }

    addCard = (values) => {
        if (this.state.flag) {
            this.setState({ flag: false });
            const form = this.form;
            form.validateFields(async(err, values) => {
                if (err) {
                    return;
                }
                values.backImg = this.state.imageUrl;
                values.channelId = subjectId;
                switch (values.cardType) {
                    case '1':
                        values.layoutId = 1;
                        break;
                    case '2':
                        values.layoutId = 3;
                        break;
                    case '3':
                        values.layoutId = 1;
                        break;
                    default:
                        break;
                }
                let res = {};
                try {
                    res = await fetcher(REQ_URL.SPECIAL_CARD_ADD, values);
                } catch (error) {
                    this.setState({
                        loading: false
                    });
                }
                if (res.code === 0) {
                    await this.getInitData();
                    message.success('新建成功');
                } else {
                    message.error(res.errmsg);
                }
                form.resetFields();
                this.setState({
                    imageUrl: ''
                });
                this.closeModal();
            });
        } else {
            return;
        }
    }

    showModal = () => {
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: true,
            }
        });
    }

    updateImageUrl = (url) => {
        this.setState({
            imageUrl: url
        });
    }

    hanleLiveStreamSortEnd = (newIndex, oldIndex) => {
        const { models, curMenuIndex } = this.state;
        const model = models[curMenuIndex];
        const videos = model.mdata;
        let newVideos = sortElm(newIndex, oldIndex, videos);
        newVideos = newVideos.map((video, index) => {
            return {
                ...video,
                sort: index,
            };
        });
        const newModels = models.slice();
        newModels[curMenuIndex] = {
            ...models[curMenuIndex],
            mdata: newVideos
        };
        this.setState({
            models: newModels
        });
    }

    handleDeleteLiveStreamRecord = async(id) => {
        const res = await fetcher(REQ_URL.SPECIAL_LIVE_DELETE, { id });
        if (res.code === 0) {
            message.success('删除成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    saveLiveRoomOrder = async() => {
        const { models, curMenuIndex } = this.state;
        const curModel = models && models[curMenuIndex];
        const cardId = curModel.id;
        let sortIdData = [];
        curModel.mdata.forEach(record => {
            sortIdData.push(record.id);
        });
        const res = await fetcher(REQ_URL.SPECIAL_LIVE_SORT, {
            cardId,
            sortIdData
        });
        if (res.code === 0) {
            message.success('更新成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    addLiveRoom = async(values) => {
        const res = await fetcher(REQ_URL.SPECIAL_LIVE_ADD, values);
        if (res.code === 0) {
            await this.getInitData();
            message.success('新增成功');
        } else {
            message.error(res.errmsg);
        }
    }

    updateLiveRoom = async(values) => {
    // values.id = this.state.models[this.state.curMenuIndex].id
        const res = await fetcher(REQ_URL.SPECIAL_LIVE_UPDATE, values);
        if (res.code === 0) {
            await this.getInitData();
            message.success('更新成功');
        } else {
            message.error(res.errmsg);
        }
    }

    updateModel = async(values) => {
        if (String(values.layoutId) === '7') {
            const bigImgs = values.mdata.videos.filter((obj) => {
                return obj.type === 0;
            });
            const smallImgs = values.mdata.videos.filter((obj) => {
                return obj.type === 1;
            });
            if (bigImgs.length < 1) {
                message.error('当前模板类型大横图视频条数不符要求');
                return;
            }
            if (smallImgs.length !== 4) {
                message.error('当前模板类型小横图视频条数不符要求');
                return;
            }
        }
        if (String(values.layoutId) === '6') {
            if (values.mdata.videos.length < 6) {
                message.error('当前模板类型横图视频条数不符要求');
                return;
            }
        }
        if (String(values.layoutId) === '5') {
            if (values.mdata.videos.length < 4) {
                message.error('当前模板类型竖图视频条数不符要求');
                return;
            }
        }
        this.setState({
            loading: true
        });
        let res = {};
        try {
            res = await fetcher(REQ_URL.SPECIAL_CARD_UPDATE, values);
        } catch (error) {
            this.setState({
                loading: false
            });
        }
        if (res.code === 0) {
            this.getInitData();
            message.success('更新成功');
        } else {
            message.error(res.errmsg);
        }
    }

    fetchModels = async() => {
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_LISTS, { id: subjectId });
        if (res.code === 0) {
            return res.data && res.data.models;
        } else {
            message.error(res.ermsg);
        }
    }

    changeMenuItem = (menuIndex) => {
        this.setState({
            curMenuIndex: menuIndex
        });
    }

    fetchPlayBackVideos = async(data) => {
        const res = await fetcher(REQ_URL.SPECIAL_VIDEO_LISTS, data);
        if (res.code === 0) {
            return res.data;
        } else {
            message.error(res.ermsg);
        }
    }

    deleteSiglePlayBack = async(record, cardId, layoutId) => {
        this.setState({
            loading: true
        });
        let res = {};
        try {
            res = await fetcher(REQ_URL.SPECIAL_VIDEO_DELETE, record);
        } catch (error) {
            this.setState({
                loading: true
            });
        }
        if (res.code === 0) {
            message.success('删除成功');
            if (cardId && layoutId) {
                this.getInitDataWithLayoutId(cardId, layoutId);
            } else {
                this.getInitData();
            }
        } else {
            message.error(res.ermsg);
        }
    }

    addFirstTemplVideo = async(video, text) => {
        let data = {};
        let res = null;
        const { models, curMenuIndex } = this.state;
        const model = models[curMenuIndex];
        // 编辑操作
        if (model && model.mdata && model.mdata.videos && model.mdata.videos.length) {
            const firstVideo = model.mdata.videos[0];
            data = {
                id: firstVideo.id,
                videoId: video.videoBaseId,
                intro: text
            };
            res = await fetcher(REQ_URL.SPECIAL_VIDEO_UPDATE, data);
        } else {
            data = {
                cardId: model.id,
                name: model.cardName,
                videoId: video.videoBaseId,
                intro: text
            };
            res = await fetcher(REQ_URL.SPECIAL_VIDEO_ADD_SINGLE, data);
        }
        if (res.code === 0) {
            message.success('保存成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    handlePlayBackSortEnd = (newIndex, oldIndex) => {
        const { models, curMenuIndex } = this.state;
        const model = models[curMenuIndex];
        const videos = model.mdata.videos;
        const newVideos = sortElm(newIndex, oldIndex, videos);
        const newModels = models.slice();
        newModels[curMenuIndex] = {
            ...models[curMenuIndex],
            mdata: {
                ...models[curMenuIndex].mdata,
                videos: newVideos
            }
        };
        this.setState({
            models: newModels
        });
    }

    updatePlayBackOrder = async(layoutId) => {
        const { models, curMenuIndex } = this.state;
        const curModel = models && models[curMenuIndex];
        const cardId = curModel.id;
        let sortIdData = [];

        if (Number(curModel.layoutId) === 4) { // 模板4的情况下最多12个
            let firstVideos = curModel.mdata.videos.filter(video => {
                return video.sort <= 6;
            });
            firstVideos = firstVideos.slice(0, 6);
            if (firstVideos.length < 6) {
                firstVideos.length = 6;
            }
            let secondVideos = curModel.mdata.videos.filter(video => {
                return video.sort > 6;
            });
            secondVideos = secondVideos.slice(0, 6);
            if (secondVideos.length < 6) {
                secondVideos.length = 6;
            }
            curModel.mdata.videos = firstVideos.concat(secondVideos);
        }
        const videos = curModel.mdata.videos;
        // debugger
        for (let i = 0; i < videos.length; i++) {
            sortIdData.push(videos[i] ? videos[i].id : null);
        }
        // curModel.mdata.videos.forEach(record => {
        //   sortIdData.push(record ? record.id : null)
        // })
        const res = await fetcher(REQ_URL.SPECIAL_VIDEO_SORT, {
            cardId,
            sortIdData
        });
        if (res.code === 0) {
            message.success('更新成功');
            if (cardId && layoutId) {
                this.getInitDataWithLayoutId(cardId, layoutId);
            } else {
                this.getInitData();
            }
        } else {
            message.error(res.errmsg);
        }
    }

    addPlayBackRecord = async(record, cardId, layoutId) => {
        const res = await fetcher(REQ_URL.SPECIAL_VIDEO_ADD, record);
        if (res.code === 0) {
            message.success('添加成功');
            if (cardId && layoutId) {
                this.getInitDataWithLayoutId(cardId, layoutId);
            } else {
                this.getInitData();
            }
        } else {
            message.error(res.errmsg);
        }
    }

    updatePlayBackRecord = async(record) => {
        record.scheduleTime = Date.parse(record.scheduleTime);
        const res = await fetcher(REQ_URL.SPECIAL_VIDEO_UPDATE, record);
        if (res.code === 0) {
            message.success('更新成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    addAdvertise = async(advertise) => {
        const res = await fetcher(REQ_URL.SPECIAL_AD_ADD, advertise);
        if (res.code === 0) {
            message.success('新增成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    updateAdvertise = async(advertise) => {
        const res = await fetcher(REQ_URL.SPECIAL_AD_UPDATE, advertise);
        if (res.code === 0) {
            message.success('更新成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    updateHeadImage = async(values) => {
        const res = await fetcher(REQ_URL.SPECIAL_HEADER_UPDATE, values);
        if (res.code === 0) {
            message.success('更新成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    // 卡片类型（1：直播 2：点播视频 3：广告 4：头图 5：尾图）
    _renderModel = (model) => {
        if (model === undefined || model === null) return;
        switch (model.cardType) {
            case 1:
                return (
                    <div className={style['config-area']}>
                        <div className={style['header']}>直播</div>
                        <LiveStream
                            model={model}
                            updateModel={this.updateModel}
                            addLiveRoom={this.addLiveRoom}
                            updateLiveRoom={this.updateLiveRoom}
                            hanleLiveStreamSortEnd={this.hanleLiveStreamSortEnd}
                            saveLiveRoomOrder={this.saveLiveRoomOrder}
                            handleDeleteLiveStreamRecord={this.handleDeleteLiveStreamRecord}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className={style['config-area']}>
                        <div className={style['header']}>点播</div>
                        <PlayBack
                            model={model}
                            updateModel={this.updateModel}
                            addRecord={this.addPlayBackRecord}
                            updateRecord={this.updatePlayBackRecord}
                            handleSortEnd={this.handlePlayBackSortEnd}
                            savePlayBackOrder={this.updatePlayBackOrder}
                            deleteRecord={this.deleteSiglePlayBack}
                            fetchPlayBackVideos={this.fetchPlayBackVideos}
                            addFirstTemplVideo={this.addFirstTemplVideo}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className={style['config-area']}>
                        <div className={style['header']}>广告</div>
                        <Advertise
                            model={model}
                            updateModel={this.updateModel}
                            addAdvertise={this.addAdvertise}
                            updateAdvertise={this.updateAdvertise}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className={style['config-area']}>
                        <div className={style['header']}>头图</div>
                        <HeadImageConfig
                            model={model}
                            updateModel={this.updateModel}
                            updateHeadImage={this.updateHeadImage}
                        />
                    </div>
                );
            case 5:
                return (
                    <div className={style['config-area']}>
                        <div className={style['header']}>尾图</div>
                        <HeadImageConfig model={model} updateModel={this.updateModel}/>
                    </div>
                );
            default:
                return null;
        }
    }

    dragMenuItem = (newIndex, oldIndex) => {
        const { models } = this.state;
        const newModels = sortElm(newIndex, oldIndex, models);
        this.setState({
            models: newModels,
            curMenuIndex: newIndex
        });
    }

    handleSaveMenuOrder = async() => {
        const { models } = this.state;
        let sortData = [];
        models.forEach(model => {
            sortData.push(model.id);
        });
        const res = await fetcher(REQ_URL.SPECIAL_CARD_SORT, { sortData, channelId: subjectId });
        if (res.code === 0) {
            message.success('更新成功');
            await this.getInitData();
        } else {
            message.error(res.errmsg);
        }
    }

    getInitData = async() => {
        let models = [];
        try {
            models = await this.fetchModels();
        } catch (error) {
            this.setState({
                loading: false
            });
        }
        const newModels = models && models.map(model => {
            return {
                ...model,
                menuName: model.cardName
            };
        });
        this.setState({
            models: newModels,
            loading: false
        });
    }

    getInitDataWithLayoutId = async (cardId, layoutId) => {
        let models = [];
        try {
            models = await this.fetchModels();
        } catch (error) {
            this.setState({
                loading: false
            });
        }
        const newModels = models && models.map(model => {
            if (String(model.id) === String(cardId)) {
                model.layoutId = Number(layoutId);
            }
            return {
                ...model,
                menuName: model.cardName
            };
        });
        this.setState({
            models: newModels,
            loading: false
        });
    }

    async componentDidMount() {
        subjectId = this.props.match && this.props.match.match && this.props.match.match.params && this.props.match.match.params.id;
        await this.getInitData();
    }

    render() {
        const { curMenuIndex, models, modalOption, imageUrl } = this.state;
        const curModel = models && models[curMenuIndex];
        return (
            <div style={{ display: 'flex' }}>
                <LayoutMenus
                    menus={models}
                    curMenuIndex={curMenuIndex}
                    changeMenuItem={this.changeMenuItem}
                    dragMenuItem={this.dragMenuItem}
                    buttons={this.layoutButtons}
                />
                <Spin spinning={this.state.loading} />
                {
                    this._renderModel(curModel)
                }
                <AddCardModal
                    ref={form => { this.form = form; }}
                    modalOption={modalOption}
                    imageUrl={imageUrl}
                    addCard={this.addCard}
                    updateImageUrl={this.updateImageUrl}
                />
            </div>
        );
    }
}
