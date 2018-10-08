import React, { Component } from 'react';
import { Row, Col, Pagination, message, Input } from 'antd';
import Content from './common/Content/Content';
import yxFetch from '../../../utils/fetch';
import YXFilter from '../../../components/filter';
const Search = Input.Search;

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoLists: [], // 视频列表
            videoNum: 0, // 搜索的视频总数
            currentType: 'all', // 视频当前类型
            pageSize: 20, // 每一页能显示的视频数量
            currentPage: 1, // 当前是第几页
            filterConditions: [{
                title: { name: '视频分类', key: 'videoCategory' },
                content: [
                    { name: '全部', key: 'all' },
                ],
                activeKey: 'all',
            }],
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.fetchTypeList = this.fetchTypeList.bind(this);
        this.fetchVideoLists = this.fetchVideoLists.bind(this);
        this.clickType = this.clickType.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.searchList = this.searchList.bind(this);
    }
    componentDidMount() {
        this.fetchTypeList();
        this.fetchVideoLists();
    }
    handleFilter(key, val) {
        let filterConditions = this.state.filterConditions;
        let videoCategory;
        if (val === 0 || !!val) {
            filterConditions[0].activeKey = val;
            val === 'all' ? videoCategory = 'all' : videoCategory = filterConditions[0].content.find(item => item.key === val).name;
            this.setState({
                filterConditions,
                currentPage: 1,
                currentType: videoCategory,
            }, () => this.fetchVideoLists(videoCategory));
        }
    }
    // 获取视频分类
    fetchTypeList() {
        yxFetch('back/thirdParty/view/pendingVideoCategories', {}).then(res => {
            if (res.code === 0) {
                let typeList = res.data;
                let filterConditions = this.state.filterConditions;
                typeList.forEach((listItemName, listItemCode) => {
                    filterConditions[0].content.push({
                        name: listItemName,
                        key: listItemCode
                    });
                });
                this.setState({
                    filterConditions: Object.assign([], filterConditions)
                }, () => {});
            } else {
                message.error(res.errmsg);
            }
        });
    }
    // 查询视频列表
    fetchVideoLists(videoCategory = '', name = '') {
        if (videoCategory === 'all') {
            videoCategory = '';
        }
        yxFetch('back/thirdParty/view/pendingVideoInfo', {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            videoCategory,
            name,
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    videoNum: res.data.records,
                    videoLists: res.data.pendingApproveSources,
                }, () => {});
            } else {
                message.error(res.errmsg);
            }
        });
    }
    searchList(e) {
        const searchName = e.target.value.trim();
        this.fetchVideoLists('', searchName);
    }
    // 点击页码button
    handlePageChange(page) {
        this.state.currentPage = page;
        this.fetchVideoLists(this.state.currentType);
    }
    // 点击视频类型item
    clickType(type) {
        this.setState({
            currentPage: 1,
            currentType: type,
        });
        if (type === 'all') {
            this.fetchVideoLists('');
        } else {
            this.fetchVideoLists(type);
        }
    }

    render() {
        return (
            <div className='container'>
                <Row>
                    <Col span={6} offset={18}>
                        <div className='searchBar'>
                            <Search
                                placeholder='请输入要搜索的视频'
                                size='large'
                                onChange={ this.searchList }
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='fliter-container' style={{ marginTop: 20 }}>
                            <YXFilter
                                conditions={ this.state.filterConditions }
                                callback={ this.handleFilter }
                            />
                        </div>
                    </Col>
                    <Col>
                        <Content data={ this.state.videoLists }></Content>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='pagination' style={{ textAlign: 'center' }}>
                            <Pagination
                                showQuickJumper
                                current={this.state.currentPage}
                                defaultCurrent={1}
                                total={ this.state.videoNum }
                                onChange={this.handlePageChange}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Review;

