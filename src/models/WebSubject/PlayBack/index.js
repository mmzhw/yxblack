import React, { Component } from 'react';
import style from './style.module.css';
import PlayBackConfig from './PlayBackConfig';
import PlayBackModal from './PlayBackModal';
import FirstTempl from './FirstTempl';
import { Table, Button, message, Popconfirm } from 'antd';
import Sortable from 'sortablejs';
import { imgPrefix } from '../../../utils/index';
import defaultImg from '../../../assets/none.png';

export default class PlayBack extends Component {
    state = {
        modalOption: {
            visible: false,
            onOk: () => this.handleRecordSubmit(),
            onCancel: () => this.closeModal()
        },
        pagination: {
            current: 1,
            pageSize: 100,
            onChange: (page, pageSize) => this.handleChangePageNum(page, pageSize),
            total: this.props.model && this.props.model.mdata && this.props.model.mdata.page && this.props.model.mdata.records
        },
        curVideo: null,
        curEditRecord: null,
        imageUrl: '',
        layoutId: this.props.model ? this.props.model.layoutId : 1,
        firstTemplVideo: this.props.model.mdata && this.props.model.mdata.videos ? this.props.model.mdata.videos[0] : null,
        firstTemplText: this.props.model.mdata && this.props.model.mdata.videos && this.props.model.mdata.videos[0] ? this.props.model.mdata.videos[0].intro : '',
        curTableIndex: 0
    }

    tableData = [{
        key: '1',
        backImg: '',
        title: '',
        url: '',
    }]

    columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '缩略图',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (text, record, index) => {
            if (text) {
                return (
                    <img alt='' width='20' height='20' src={`${imgPrefix}${text}`}/>
                );
            } else {
                return (
                    <img alt='' width='40' height='40' src={`${defaultImg}`}/>
                );
            }
        }
    }, {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, index) => {
            return (
                <div>
                    <a key='edit' onClick={() => this.showModal(record)}
                        style={{ display: 'inline-block', marginRight: '10px' }}>编辑</a>
                    <Popconfirm title='你确定要删除这条记录吗?' onConfirm={() => this.deleteRecord(record)} okText='是'
                        cancelText='否'>
                        <a key='delete'>删除</a>
                    </Popconfirm>
                </div>
            );
        }
    }]

    updateFirstTemplText = (text) => {
        this.setState({
            firstTemplText: text
        });
    }

    updateFirstTemplVideo = (video) => {
        this.setState({
            firstTemplVideo: video
        });
    }

    updateCurVideo = (video) => {
        this.setState({
            curVideo: video
        });
    }

    updateImageUrl = (url) => {
        this.setState({
            imageUrl: url
        });
    }
    // 新增视频layoutId为4的话要特殊处理
    handleRecordSubmit = () => {
        this.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { curEditRecord, imageUrl, curVideo, layoutId, curTableIndex } = this.state;
            const { model } = this.props;
            if (curEditRecord) {
                values = {
                    ...curEditRecord,
                    ...values,
                    videoId: curVideo && curVideo.videoBaseId,
                    imageUrl: imageUrl,
                };
                if (!values.videoName) {
                    values.videoId = '';
                }
                this.props.updateRecord(values);
            } else {
                if (!imageUrl) return message.error('请设置图片');
                if (layoutId === 4) {
                    const videos = this.getVideos();
                    let maxSort = 0;
                    if (curTableIndex === 0) {
                        const curVideos = videos.filter(video => {
                            return video.sort <= 6;
                        });
                        const lastItem = curVideos.pop();
                        maxSort = lastItem ? lastItem.sort : 0;
                        if (maxSort >= 6) return message.warn('最多添加6条');
                    } else {
                        const curVideos = videos.filter(video => {
                            return video.sort > 6;
                        });
                        const lastItem = curVideos.pop();
                        maxSort = lastItem ? lastItem.sort : 7;
                        if (maxSort >= 12) return message.warn('最多添加6条');
                    }
                    values = {
                        cardId: model.id,
                        ...values,
                        videoId: curVideo && curVideo.videoBaseId,
                        imageUrl: imageUrl,
                        sort: Number(maxSort) + 1,
                        leftOrRight: curTableIndex + 1
                    };
                } else if (layoutId === 7) {
                    values = {
                        cardId: model.id,
                        ...values,
                        videoId: curVideo && curVideo.videoBaseId,
                        imageUrl: imageUrl,
                        leftOrRight: curTableIndex + 1
                    };
                } else {
                    values = {
                        cardId: model.id,
                        ...values,
                        videoId: curVideo && curVideo.videoBaseId,
                        imageUrl: imageUrl,
                        leftOrRight: 0
                    };
                }
                this.props.addRecord(values, model.id, layoutId);
            }
            this.form.resetFields();
            this.closeModal();
        });
    }

    showModal = (record) => {
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: true,
            },
            curEditRecord: record,
            curVideo: {
                videoBaseId: record && record.videoId
            },
            imageUrl: record && record.imageUrl
        });
    }

    closeModal = () => {
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: false,
            },
            curEditRecord: null,
            curVideo: null,
            imageUrl: ''
        });
        this.form.resetFields();
    }

    deleteRecord = (record) => {
        this.props.deleteRecord(record, this.props.model.id, this.state.layoutId);
    }

    handleChangePageNum = async (page, pageSize) => {
        // const { model } = this.props
        // const cardId = model.id
        // const {pagination} = this.state
        // const { currentPage, pageSize } = this.state

        // const videos = await this.props.fetchPlayBackVideos({
        //   cardId,
        //   currentPage: page,
        //   pageSize
        // })
        this.setState({
            pagination: {
                ...this.state.pagination,
                current: page,
                pageSize: pageSize
            }
        });
    }

    handleLayoutChange = (layoutId) => {
        if (layoutId === this.state.layoutId) return;
        this.setState({
            layoutId: Number(layoutId),
            pagination: {
                current: 1,
                pageSize: 10,
                onChange: (page, pageSize) => this.handleChangePageNum(page, pageSize),
                total: this.props.model && this.props.model.mdata && this.props.model.mdata.page && this.props.model.mdata.records
            },
            curVideo: null,
            curEditRecord: null,
            imageUrl: '',
            firstTemplVideo: null,
            curTableIndex: 0
        });
    }

    getVideos = () => {
        const { model } = this.props;
        let videos = model && model.mdata && model.mdata.videos.map(video => {
            return {
                ...video,
                key: video.id
            };
        });
        videos = videos && videos.sort((video1, video2) => {
            return video1.sort - video2.sort;
        });
        return videos;
    }

    // 模板2新增视频用
    showAddVideoModal = (curTableIndex) => {
        this.setState({
            curTableIndex
        });
        this.showModal();
    }

    getFirstVidoes = () => {
        const videos = this.getVideos();
        return videos.filter(video => {
            return video.sort <= 6;
        });
    }

    getSecondVideos = () => {
        const videos = this.getVideos();
        return videos.filter(video => {
            return video.sort > 6;
        });
    }

    getLargeShowVideos = () => {
        const videos = this.getVideos();
        return videos.filter(video => {
            return video.type === 0;
        });
    }

    getSmallerShowVideos = () => {
        const videos = this.getVideos();
        return videos.filter(video => {
            return video.type === 1;
        });
    }

    renderTempl = () => {
        const { layoutId, pagination, firstTemplVideo, firstTemplText } = this.state;
        const { savePlayBackOrder, addFirstTemplVideo } = this.props;
        const videos = this.getVideos();
        switch (layoutId) {
            case 1:
                return (
                    <FirstTempl
                        updateFirstTemplVideo={this.updateFirstTemplVideo}
                        updateFirstTemplText={this.updateFirstTemplText}
                        addFirstTemplVideo={() => addFirstTemplVideo(firstTemplVideo, firstTemplText)}
                        text={firstTemplText}
                        words={firstTemplVideo ? (firstTemplVideo.videoName || firstTemplVideo.name) : ''}
                    />
                );
            case 2:
                return (
                    <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                        <Table pagination={pagination} dataSource={videos} columns={this.columns} />
                        <Button type='primary' className={style['area-btn']} onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                        <Button type='primary' className={style['area-btn']}
                            onClick={() => this.showModal()}>新增视频</Button>
                    </div>
                );
            case 3:
                return (
                    <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                        <Table pagination={pagination} dataSource={videos} columns={this.columns} />
                        <Button type='primary' className={style['area-btn']} onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                        <Button type='primary' className={style['area-btn']}
                            onClick={() => this.showModal()}>新增视频</Button>
                    </div>
                );
            case 4:
                let firstVideos = this.getFirstVidoes();
                firstVideos = firstVideos.slice(0, 6);
                let secondVideos = this.getSecondVideos();
                secondVideos = secondVideos.slice(0, 6);
                return (
                    <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                        <div>
                            <Table pagination={false} dataSource={firstVideos} columns={this.columns}>
                            </Table>
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => this.showAddVideoModal(0)}>新增视频</Button>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <Table pagination={false} dataSource={secondVideos} columns={this.columns}>
                            </Table>
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => this.showAddVideoModal(1)}>新增视频</Button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                        <p>竖图视频（<span style={{ color: 'red' }}>视频条数>=4</span>） </p>
                        <Table pagination={pagination} dataSource={videos} columns={this.columns}>
                        </Table>
                        <Button type='primary' className={style['area-btn']} onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                        <Button type='primary' className={style['area-btn']}
                            onClick={() => this.showModal()}>新增视频</Button>
                    </div>
                );
            case 6:
                return (
                    <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                        <p>横图视频（<span style={{ color: 'red' }}>视频条数>=6</span>）</p>
                        <Table pagination={pagination} dataSource={videos} columns={this.columns}>
                        </Table>
                        <Button type='primary' className={style['area-btn']} onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                        <Button type='primary' className={style['area-btn']}
                            onClick={() => this.showModal()}>新增视频</Button>
                    </div>
                );
            case 7:
                let largeShowVideos = this.getLargeShowVideos();
                let smallShowVideos = this.getSmallerShowVideos();
                return (
                    <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                        <div>
                            <p>大横图视频（<span style={{ color: 'red' }}>视频条数>=1</span>）</p>
                            <Table pagination={false} dataSource={largeShowVideos} columns={this.columns} />
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => this.showAddVideoModal(70)}>新增视频</Button>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <p>小横图视频（<span style={{ color: 'red' }}>视频条数=4</span>）</p>
                            <Table pagination={false} dataSource={smallShowVideos} columns={this.columns} />
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => { savePlayBackOrder(this.state.layoutId); }}>保存排序</Button>
                            <Button type='primary' className={style['area-btn']}
                                onClick={() => this.showAddVideoModal(71)}>新增视频</Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    createSortAble = () => {
        const { layoutId } = this.state;
        const elms = document.querySelectorAll('.ant-table-tbody');
        if (elms && elms.length > 0) {
            if (layoutId === 2 || layoutId === 3 || layoutId === 5 || layoutId === 6) {
                return elms.forEach((elm, index) => {
                    new Sortable(elm, {
                        onEnd: (event) => {
                            const { pagination } = this.state;
                            const { current, pageSize } = pagination;
                            const newIndex = (current - 1) * pageSize + event.newIndex;
                            const oldIndex = (current - 1) * pageSize + event.oldIndex;
                            const videos = this.getVideos();
                            this.props.handleSortEnd(newIndex, oldIndex, videos);
                        }
                    });
                });
            }
            if (layoutId === 4) {
                return elms.forEach((elm, index) => {
                    new Sortable(elm, {
                        onEnd: (event) => {
                            const firstVideos = this.getFirstVidoes();
                            const newIndex = index * firstVideos.length + event.newIndex;
                            const oldIndex = index * firstVideos.length + event.oldIndex;
                            const videos = this.getVideos();
                            this.props.handleSortEnd(newIndex, oldIndex, videos);
                        }
                    });
                });
            }
            if (layoutId === 7) {
                return elms.forEach((elm, index) => {
                    new Sortable(elm, {
                        onEnd: (event) => {
                            let newIndex = 0;
                            let oldIndex = 0;
                            const filterVideos = (index === 0) ? this.getLargeShowVideos() : this.getSmallerShowVideos();
                            const videos = this.getVideos();
                            videos.forEach((obj, index) => {
                                if (filterVideos[event.oldIndex].id === obj.id) {
                                    oldIndex = index;
                                }
                                if (filterVideos[event.newIndex].id === obj.id) {
                                    newIndex = index;
                                }
                            });
                            this.props.handleSortEnd(newIndex, oldIndex, videos);
                        }
                    });
                });
            }
        }
    }

    componentDidMount() {
        this.createSortAble();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.model !== this.props.model) {
            this.setState({
                layoutId: nextProps.model.layoutId
            });
        }
    }

    componentDidUpdate(preProps, preState) {
        if (this.state.layoutId !== preState.layoutId) {
            this.createSortAble();
        }
        if (preProps.model !== this.props.model || this.state.layoutId !== preState.layoutId) {
            this.setState({
                firstTemplVideo: this.props.model.mdata && this.props.model.mdata.videos ? this.props.model.mdata.videos[0] : null,
                firstTemplText: this.props.model.mdata && this.props.model.mdata.videos && this.props.model.mdata.videos[0] ? this.props.model.mdata.videos[0].intro : '',
            });
        }
    }

    render() {
        const { modalOption, curEditRecord, layoutId, imageUrl } = this.state;
        const { model, updateModel } = this.props;
        const listType = [
            { label: '1*1', value: 1 },
            { label: '2*6', value: 2 },
            { label: '1*6', value: 3 },
            { label: '2*3+2*3', value: 4 },
            { label: '1行*4个/行', value: 5 },
            { label: '3行*2个/行', value: 6 },
            { label: '1横+2行*2个/行', value: 7 },
        ];
        return (
            <div style={{ overflow: 'hidden' }}>
                {
                    this.renderTempl()
                }
                <div style={{ marginTop: '20px', border: '1px solid #DDD', padding: '10px' }}>
                    <PlayBackConfig
                        cardType={2}
                        componentType='点播'
                        configData={model}
                        updateModel={updateModel}
                        handleLayoutChange={this.handleLayoutChange}
                        listType={listType}
                        layoutId={layoutId}
                    />
                </div>
                <PlayBackModal
                    ref={form => {
                        this.form = form;
                    }}
                    modalOption={modalOption}
                    layoutId={this.state.layoutId}
                    configData={curEditRecord}
                    curTableIndex={this.state.curTableIndex}
                    imageUrl={imageUrl}
                    updateCurVideo={this.updateCurVideo}
                    updateImageUrl={this.updateImageUrl}
                />
            </div>
        );
    }
}
