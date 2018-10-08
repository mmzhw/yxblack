import React, { Component } from 'react';
import { Pagination, Popover, Button, Input, message, Row, Col } from 'antd';
import {
    Link,
} from 'react-router-dom';
import yxFetch from '../../../utils/fetch';
import YXVideoCard from '../../../components/VideoCard';
import YXErrorMsg from '../../../components/Errormsg';
import YXFilter from '../../../components/filter';
import style from './style.module.css';
import * as urls from '../../../constants/urls';
import { REQ_URL } from '../../../constants/constants';

const Search = Input.Search;

class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: 20,
            total: 0,
            list: [],
            addVisible: false,
            conditions: [{
                title: { name: '视频分类', key: 'type' },
                content: [
                    { name: '全部', key: 'all' },
                ],
                activeKey: 'all'
            }, {
                title: { name: '视频信息', key: 'updateType' },
                content: [
                    { name: '全部', key: 'all' },
                    { name: '有新的剧集', key: 2 },
                    { name: '有新的播放源', key: 1 },
                    { name: '无更新', key: 0 },
                ],
                activeKey: 'all'
            }, {
                title: { name: '平台', key: 'platformsType' },
                content: [
                    { name: '全部', key: 'all' },
                    { name: '有象', key: 0 },
                    { name: '乐视', key: 1 },
                    { name: '腾讯', key: 2 },
                    { name: '爱奇艺', key: 3 },
                    { name: '优酷', key: 4 },
                    { name: '搜狐', key: 5 },
                    { name: '风行', key: 6 },
                    { name: '新浪', key: 7 },
                    { name: '土豆', key: 8 },
                    { name: '哔哩', key: 9 },
                    { name: '弹幕', key: 10 },
                    { name: '芒果TV', key: 11 },
                    { name: 'PPTV', key: 12 },
                    { name: '华数TV', key: 13 },
                    { name: '其他', key: 99 },
                ],
                activeKey: 'all'
            }],
        };

        this.fetchList = this.fetchList.bind(this);
        this.changePage = this.changePage.bind(this);
        this.filterCallback = this.filterCallback.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.searchList = this.searchList.bind(this);
        this.fetchClassifyList = this.fetchClassifyList.bind(this);
        this.fetchTypeFilter = this.fetchTypeFilter.bind(this);
    }

    handleVisibleChange(visible) {
        this.setState({
            addVisible: visible
        });
    }

    componentDidMount() {
        this.fetchList(this.state.currentPage);
        this.fetchTypeFilter();
    }

    filterCallback(key, value) {
        const conditions = this.state.conditions;
        for (let i = 0, j = conditions.length; i < j; i++) {
            if (this.state.conditions[i].title.key === key) {
                conditions[i].activeKey = value;
            }
        }
        this.setState({
            conditions
        }, this.fetchList());
    }

    // FIXME:获取检索标签, 暂时只筛选分类
    fetchTypeFilter() {
        yxFetch(REQ_URL.SEARCH_GROUP_LABELS, {
        }).then(res => {
            if (res.code === 0) {
                for (let i = 0, j = res.data.groups.length; i < j; i++) {
                    if (res.data.groups[i].groupName === '分类') {
                        const conditions = this.state.conditions;
                        conditions[0].title.key = res.data.groups[i].id;
                        this.setState({
                            conditions: Object.assign([], conditions)
                        });
                    }
                }
                this.fetchClassifyList();
            } else {
                message.error(res.errmsg);
            }
        });
    }

    fetchClassifyList() {
        yxFetch(REQ_URL.CLASS_LIST, {})
            .then(res => {
                if (res.code === 0) {
                    const conditions = this.state.conditions;
                    for (let i = 0, j = res.data.length; i < j; i++) {
                        if (!res.data[i].enable) continue;
                        conditions[0].content.push({
                            name: res.data[i].name,
                            key: res.data[i].id,
                        });
                    }
                    this.setState({
                        conditions: Object.assign([], conditions)
                    });
                } else {
                    message.error(res.errmsg);
                }
            });
    }

    fetchList(page, word = '') {
        const data = {
            currentPage: page,
            pageSize: this.state.pageSize,
            word,
        };
        if (this.state.conditions[0].activeKey !== 'all') {
            data['groups'] = [{
                groupId: this.state.conditions[0].title.key,
                // TODO: 目前单选
                labels: [this.state.conditions[0].activeKey]
            }];
        }
        if (this.state.conditions[1].activeKey !== 'all') data['updateType'] = this.state.conditions[1].activeKey;
        // TODO: 目前单选
        if (this.state.conditions[2].activeKey !== 'all') data['platformsType'] = [this.state.conditions[2].activeKey];
        yxFetch(REQ_URL.SELECT_QUERY, data).then(res => {
            if (res.code === 0) {
                this.setState({
                    total: res.data.records,
                    list: res.data.videos
                });
            } else {
            }
        });
    }

    searchList(event) {
        this.fetchList(1, event.target.value);
    }

    changePage(page) {
        this.setState({
            currentPage: page,
        }, this.fetchList(page));
    }

    render() {
        return (
            <div style={{ position: 'relative' }}>
                <Row>
                    <Col span={6} offset={18}>
                        <div className={style['search']}>
                            <Search
                                placeholder='请输入要搜索的视频'
                                size='large'
                                onChange={ this.searchList }
                            />
                        </div>
                    </Col>
                </Row>
                <div className={style.filter} style={{ marginTop: 20 }}>
                    <YXFilter conditions={this.state.conditions} callback={this.filterCallback}/>
                </div>
                { this.state.list.length > 0 ? (
                    <YXVideoCard list={this.state.list} />
                ) : (
                    <YXErrorMsg errorMessage='亲！还没有视频哦'/>
                )}
                <div className={style.pagination} style={{ marginTop: 20 }}>
                    <Pagination current={this.state.currentPage} total={this.state.total} onChange={this.changePage} pageSize={20} />
                </div>
                <div className={style['add-btn']}>
                    <Popover
                        content={
                            <div>
                                <Link className={style['add-link']} to={`${urls.VIDEO_ADD}?categories=2&bizType=2`}>综艺</Link>
                                <Link className={style['add-link']} to={`${urls.VIDEO_ADD}?categories=2&bizType=1`}>剧集</Link>
                                <Link className={style['add-link']} to={`${urls.VIDEO_ADD}?categories=1`}>视频</Link>
                            </div>
                        }
                        trigger='hover'
                        visible={this.state.addVisible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <Button type='primary'>新增视频</Button>
                    </Popover>
                </div>
            </div>
        );
    }
}

export default VideoList;

