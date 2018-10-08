import React, { Component } from 'react';
import YXFilter from '../../components/filter';
import { Pagination, Card, Button, Input, Row, Col } from 'antd';
import style from './liveList.module.css';
import YXErrorMsg from '../../components/Errormsg';
import listFetch from '../../utils/fetch';
import { imgPrefix } from '../../utils/index';
import * as urls from '../../constants/urls';
import {
    Link,
} from 'react-router-dom';
import { REQ_URL } from '../../constants/constants';

const Search = Input.Search;

class liveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: 20, // 每页显示的条数
            totalPage: 0, // 总页数
            indexList: [], // 要渲染的数据
            roomStatus: '',
            liveStatus: '',
            searchKey: '',
            filterConditions: [{
                title: { name: '房间状态', key: 'roomState' },
                content: [
                    { name: '全部', key: 'all' },
                    { name: '已上架', key: 'hasShelf' },
                    { name: '未上架', key: 'noShelf' },
                ],
                activeKey: 'all',
            }, {
                title: { name: '直播状态', key: 'liveState' },
                content: [
                    { name: '全部', key: 'all' },
                    { name: '直播中', key: 'living' },
                    { name: '即将开始', key: 'toLive' },
                    { name: '直播结束', key: 'lived' },
                ],
                activeKey: 'all',
            }],
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.searchList = this.searchList.bind(this);
    }
    fetchData(page, roomStatus, liveStatus, title) {
        listFetch(REQ_URL.LIST_LIVEROOM, {
            page,
            size: this.state.pageSize,
            roomStatus,
            liveStatus,
            title,
        }).then(res => {
            this.setState({
                indexList: res.data.liveRoomList,
                totalPage: res.data.records
            });
        }).catch(e => {
        });
    }
    handleFilter(typeKey, optionKey) {
        if (typeKey === 'roomState') {
            let currRoom;
            if (optionKey === 'hasShelf') {
                currRoom = 1;
            } else if (optionKey === 'noShelf') {
                currRoom = 0;
            } else {
                currRoom = '';
            }
            this.fetchData(1, currRoom, this.state.liveStatus, this.state.searchKey);
            this.setState({
                roomStatus: currRoom,
                currentPage: 1,
            });
            let filterConditions = this.state.filterConditions;
            filterConditions[0].activeKey = optionKey;
            this.setState({
                filterConditions
            });
        } else {
            let currLive;
            if (optionKey === 'living') {
                currLive = 0;
            } else if (optionKey === 'toLive') {
                currLive = 1;
            } else if (optionKey === 'lived') {
                currLive = 2;
            } else {
                currLive = '';
            }
            this.fetchData(1, this.state.roomStatus, currLive, this.state.searchKey);
            this.setState({
                liveStatus: currLive,
                currentPage: 1,
            });
            let filterConditions = this.state.filterConditions;
            filterConditions[1].activeKey = optionKey;
            this.setState({
                filterConditions
            });
        }
    }
    handlePagination(page) { // 改变后的页码和每页条数
        this.setState({
            currentPage: page,
        });
        this.fetchData(page, this.state.roomStatus, this.state.liveStatus, this.state.searchKey);
    }
    componentDidMount() {
        this.fetchData(this.state.currentPage, this.state.roomStatus, this.state.liveStatus);
    }
    searchList(event) {
        this.setState({
            searchKey: event.target.value
        });
        this.fetchData(this.state.currentPage, this.state.roomStatus, this.state.liveStatus, event.target.value);
    }
    render() {
        return (
            <div>
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
                <div className='fliter-container'>
                    <YXFilter conditions={ this.state.filterConditions } callback={ this.handleFilter }/>
                </div>
                { this.state.indexList.length ? <div className='liveList-container'>
                    <div className={style['liveitem-container']}>
                        <ul>
                            {
                                this.state.indexList.map((item, i) =>
                                    <Link to={`${urls.LIVE_LIST}/liveDetail/${item.liveRoomId}`} key={i}>
                                        <Card
                                            className={style['card']}
                                            key={i}
                                            extra = { item.roomStatus ? <span className={style['right-top-label-active']}>已上架</span> : <span className={style['right-top-label']}>未上架</span> }
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            <div className={style['custom-image']}>
                                                <img alt='' src={imgPrefix + item.displayImageUrl}/>
                                            </div>
                                            <div className={style['custom-card']}>
                                                <h3>{item.title}</h3>
                                                <p>{item.subTitle}</p>
                                            </div>
                                        </Card>
                                    </Link>
                                )
                            }
                        </ul>
                    </div>
                    <div className={style['pagination-container']}>
                        <Pagination
                            current={this.state.currentPage}
                            onChange={this.handlePagination}
                            total={this.state.totalPage}
                            className={style['pagination']}
                            pageSize={this.state.pageSize}
                        />
                    </div>
                </div>
                    : <YXErrorMsg errorMessage='亲！还没有视频哦'/> }
                <div className={style['add-btn']}>
                    <Link to={`${urls.ADDLIVE}`}>
                        <Button type='primary'>新增直播源</Button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default liveList;
