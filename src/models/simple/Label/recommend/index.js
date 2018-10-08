import React, { Component } from 'react';
import { Modal, message } from 'antd';
import yxFetch from '../../../../utils/tvFetch';
import YXRecommend from '../../../../components/Bookshelf/recommend';
import YXSearchModal from '../../../../components/SearchModal';

const confirm = Modal.confirm;

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            api: {
                videoLists: 'back/recommend/video/list',
                searchVideoLists: 'back/videoManager/videoCardList',
                deleteVideoList: 'back/recommend/video/delete',
                addVideoList: 'back/recommend/video/add'
            },
            bodys: [{
                name: '删除',
                width: '50%',
                color: '', // 如果color存在且不为空，则显示color，否则显示默认颜色
                icon: 'delete', // 如果icon存在且不为空，则显示icon，否则显示name
                iconSize: '18px', // 如果iconSize存在且不为空，则显示iconSize图标大小，否则显示默认图标大小
                click: this.deleteVideo.bind(this), // 删除
            }],
            footers: [{
                name: '新增',
                width: '25%',
                color: '#F57C00',
                click: this.addVideo.bind(this), // 新增
            }],
            labelId: props.match.match.params.id,
            videoLists: [],
            searchModalVisible: false,
            searchVideoLists: [],
            checkedVideoLists: [],
            confirmedItems: {}
        };
        this.cancelSearchModal = this.cancelSearchModal.bind(this);
        this.confirmSearchModal = this.confirmSearchModal.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }
    cancelSearchModal() {
        this.setState({
            searchModalVisible: false,
            searchVideoLists: [],
            checkedVideoLists: []
        });
    }
    confirmSearchModal() {
        const checkedVideoLists = this.state.checkedVideoLists;
        let count = 0;
        for (let i = 0; i < checkedVideoLists.length; i += 1) {
            let res = yxFetch(this.state.api.addVideoList, checkedVideoLists[i]);
            if (res.code === 0) {
                count += 1;
                if (count === checkedVideoLists.length) {
                    message.success('新增成功！');
                    this.setState({
                        searchModalVisible: false,
                        searchVideoLists: [],
                        checkedVideoLists: []
                    }, () => {
                        this.getVideoLists();
                    });
                }
            }
        }
    }
    onCheckboxChange(index, isChecked) {
        let _checkedVideoLists = this.state.checkedVideoLists;
        if (isChecked) {
            let count = 0;
            for (let i = 0; i < _checkedVideoLists.length; i += 1) {
                if (_checkedVideoLists[i].videoBaseId !== this.state.searchVideoLists[index].videoBaseId) {
                    count++;
                }
            }
            if (count === _checkedVideoLists.length) {
                let _checkedVideoList = {};
                _checkedVideoList.labelId = this.state.labelId;
                _checkedVideoList.videoBaseId = this.state.searchVideoLists[index].videoBaseId;
                _checkedVideoList.sort = 1000 * (this.state.videoLists.length + _checkedVideoLists.length + 1);
                _checkedVideoLists.push(_checkedVideoList);

                let searchVideoLists = this.state.searchVideoLists;
                searchVideoLists[index].checked = true;
                this.setState({ searchVideoLists: searchVideoLists });
            }
        } else {
            const deleteVideoBaseId = this.state.searchVideoLists[index].videoBaseId;
            for (let i = 0; i < _checkedVideoLists.length; i += 1) {
                if (deleteVideoBaseId === _checkedVideoLists[i].videoBaseId) {
                    _checkedVideoLists.splice(i, 1);
                    for (let j = 0; j < _checkedVideoLists.length; j += 1) {
                        _checkedVideoLists[j].sort = 1000 * (this.state.videoLists.length + j + 1);
                    }
                }
            }
            let searchVideoLists = this.state.searchVideoLists;
            searchVideoLists[index].checked = false; // 释放了第index个checkbox
            this.setState({ searchVideoLists: searchVideoLists });
        }
        this.setState({
            checkedVideoLists: _checkedVideoLists
        });
    }
    onInputChange(searchWorld) {
        if (searchWorld.trim() === '') {
            this.setState({
                searchVideoLists: []
            });
        } else {
            yxFetch(this.state.api.searchVideoLists, {
                page: 1,
                size: 30,
                status: 2, // 搜索已上架并且是大象平台的视频
                platformsType: [0],
                name: searchWorld,
            })
                .then(res => {
                    if (res.code === 0) {
                        this.setState({
                            searchVideoLists: this.removeRepeat(this.state.videoLists, res.data.videoBaseCards)
                        }, () => {
                            let searchVideoLists = this.state.searchVideoLists;
                            for (let i = 0; i < searchVideoLists.length; i += 1) {
                                searchVideoLists[i].checked = false;
                                for (let j = 0; j < this.state.checkedVideoLists.length; j += 1) {
                                    if (searchVideoLists[i].videoBaseId === this.state.checkedVideoLists[j].videoBaseId) {
                                        searchVideoLists[i].checked = true;
                                    }
                                }
                            }
                            this.setState({
                                searchVideoLists: searchVideoLists
                            });
                        });
                    } else {
                        message.error(res.errmsg, 5);
                    }
                });
        }
    }
    removeRepeat(lists, allLists) {
        let _allLists = allLists;
        for (let i = 0; i < lists.length; i += 1) {
            for (let j = 0; j < _allLists.length; j += 1) {
                if (lists[i].videoBaseId === _allLists[j].videoBaseId) {
                    _allLists.splice(j, 1);
                }
            }
        }
        return _allLists;
    }
    componentWillMount() {
        this.getVideoLists();
    }
    render() {
        return (
            <div>
                <YXRecommend
                    lists={this.state.videoLists}
                    bodys={this.state.bodys}
                    footers={this.state.footers}
                />
                <YXSearchModal
                    resultLists = {this.state.searchVideoLists} // searchVideoList中字段必须包含checkbox checked字段 true：选中，false未选中
                    checkedVideoLists = {this.state.checkedVideoLists}
                    width = {520}
                    height = {480}
                    visible = {this.state.searchModalVisible}
                    closeButtonVisible = {true}
                    onOk = {this.confirmSearchModal}
                    onCancel = {this.cancelSearchModal}
                    onInputChange = {this.onInputChange}
                    onCheckboxChange = {this.onCheckboxChange}
                />
            </div>
        );
    }
    getVideoLists() {
        yxFetch(this.state.api.videoLists, {
            labelId: this.state.labelId
        })
            .then(res => {
                if (res.code === 0) {
                    const videoLists = res.data || [];
                    this.transform(videoLists);
                } else {
                    message.error(res.errmsg);
                }
            });
    }
    transform(videoLists) {
        let _videoLists = [];
        for (let i = 0; i < videoLists.length; i += 1) {
            let _videoList = {};
            _videoList.name = videoLists[i].videoDigest.name;
            _videoList.labelId = videoLists[i].labelId;
            _videoList.recommendId = videoLists[i].recommendId;
            _videoList.videoBaseId = videoLists[i].videoDigest.videoBaseId;
            _videoLists[i] = _videoList;
        }
        this.setState({
            videoLists: _videoLists
        });
    }
    deleteVideo(listIndex) {
        const self = this;
        confirm({
            title: '删除视频',
            content: '删除后将不再推荐给用户，确认删除吗？',
            onOk() {
                self.deleteVideoReq(self.state.videoLists[listIndex].recommendId);
            },
            onCancel() {
            }
        });
    }
    deleteVideoReq(recommendId) {
        yxFetch(this.state.api.deleteVideoList, {
            videoRecommendId: recommendId
        })
            .then(res => {
                if (res.code === 0) {
                    message.success('删除成功！', 5);
                    this.getVideoLists();
                } else {
                    message.error(res.errmsg);
                }
            });
    }
    addVideo() {
        this.setState({
            searchModalVisible: true
        });
    }
}

export default Recommend;
