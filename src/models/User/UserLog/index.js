import React, { Component } from 'react';
import { Table, Input, Button, Icon } from 'antd';
import style from './style.module.css';
import yxFetch from '../../../utils/fetch';
import moment from 'moment';
import { REQ_URL } from '../../../constants/constants';

moment.locale('zh-cn');

class UserLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterDropdownVisible: false,
            datas: [],
            searchText: '',
            filtered: false,
            total: 0,
        };
        this.pageSize = 10;
    }
    componentDidMount() {
        this.fetchUserLog(1);
    }

    tableChange(pagination) {
        this.fetchUserLog(pagination.current);
    }

    async fetchUserLog(page) {
        let res = await yxFetch(REQ_URL.LOG_DETAIL_LIST, {
            page: page,
            size: this.pageSize,
        });

        if (res.code === 0) {
            this.setState({
                datas: this.addKey(res.data.details),
                total: res.data.pager.records,
            });
        }
    }

    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }

    addKey(userInfos) {
        for (let i = 0; i < userInfos.length; i++) {
            userInfos[i].key = i + 1;
        }
        return userInfos;
    }

    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            datas: this.state.dates.map((record) => {
                const match = record.userName.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    userName: (
                        <span>
                            {record.userName.split(reg).map((text, i) => (
                                i > 0 ? [<span className='highlight'>{match[0]}</span>, text] : text
                            ))}
                        </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    render() {
        const pagination = {
            showQuickJumper: true,
            pageSize: this.pageSize,
            total: this.state.total,
        };
        const columns = [{
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            width: '150px',
            filterDropdown: (
                <div className={style['custom-filter-dropdown']}>
                    <Input
                        ref={ele => (this.searchInput = ele)}
                        placeholder='Search name'
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type='primary' onClick={this.onSearch}>Search</Button>
                </div>
            ),
            filterIcon: <Icon type='smile-o' style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }}/>,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput && this.searchInput.focus());
            },
        }, {
            title: 'Operation Time',
            dataIndex: 'gmtCreated',
            key: 'gmtCreated',
            width: '250px',
            sorter: (a, b) => a.gmtCreated - b.gmtCreated,
            render: (text, record, index) => {
                return (<span>{moment(text).format('LLLL')}</span>);
            }
        }, {
            title: 'Info',
            dataIndex: 'logInfo',
            key: 'logInfo',
        }];
        return (
            <Table columns={columns} dataSource={this.state.datas} pagination={pagination} onChange={this.tableChange.bind(this)}/>
        );
    }
}

export default UserLog;
