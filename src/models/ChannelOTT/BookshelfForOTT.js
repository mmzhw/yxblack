import React, { Component } from 'react';
import style from './BookshelfForOTT.module.css';
import Sortable from 'sortablejs';
import { Button, Icon } from 'antd';
import { message } from 'antd/lib/index';

export default class Bookshelf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupsAppears: {},
        };
        this.dragSecondAreas = [];
        this.dragCardsAreas = [];
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        // 初始化每个卡片中间部分显示状态
        if (nextProps !== self.props) {
            let groupsAppears = this.state.groupsAppears;
            nextProps.groups.forEach((group) => {
                groupsAppears[group.sort] = groupsAppears[group.sort] || false;
            });
            self.setState({ groupsAppears });
        }
    }

    componentDidUpdate() {
        let self = this;

        Sortable.create(this.refs.groups, {
            animation: 150,
            filter: '.addButtonDiv',
            onEnd: (e) => {
                if (e.oldIndex >= self.props.groups.length || e.newIndex >= self.props.groups.length) {
                    return;
                }
                self.props.dragChannel(e.oldIndex, e.newIndex, self.props.groups, -1);
            }
        });

        // // 二级排序，关键词dragSecondAreas,secondChannels
        this.props.groups.forEach((group, groupIndex) => {
            if (self.dragSecondAreas.length > 0) {
                let subSortArea = this.dragSecondAreas[groupIndex];
                new Sortable(subSortArea, {
                    animation: 150,
                    onEnd: function(e) {
                        self.props.dragChannel(e.oldIndex, e.newIndex, self.props.groups[groupIndex].secondChannels, -2, groupIndex);
                    }
                });
            }
        });
        // 一级卡片排序，关键词dragCardsAreas,cards
        this.props.groups.forEach((group, groupIndex) => {
            if (self.dragCardsAreas.length > 0) {
                let subSortArea = this.dragCardsAreas[groupIndex];
                new Sortable(subSortArea, {
                    animation: 150,
                    filter: '.filterMenu',
                    onEnd: function(e) {
                        if (e.oldIndex === 0 || e.newIndex === 0) {
                            message.error('不支持修改第一个模块的顺序，即将刷新页面', 2, () => {
                                window.location.reload();
                            });
                            return;
                        }
                        self.props.dragChannel(e.oldIndex, e.newIndex, self.props.groups[groupIndex].cards, -3, groupIndex);
                    }
                });
            }
        });
    }

    // 切换显示二级标题或一级卡片
    changeAppearContent(id) {
        let groupsAppears = this.state.groupsAppears;
        groupsAppears[id] = !groupsAppears[id];
        this.setState({ groupsAppears });
    }

    render() {
        return (
            <div className={style.bookshelfs} ref='groups'>
                {
                    this.props.groups && this.props.groups.map((group, groupIndex) => {
                        return (
                            <div className={style.bookshelf} key={group.sort}>
                                <div className={style.title}>
                                    <p>{group.name}</p>
                                    <span style={{ background: (group.enable === 1) ? '#7ED41A' : '#CCCCCC' }}>{(group.enable === 1) ? '已启用' : '未启用'}</span>
                                    <div className={style.clear}/>
                                </div>
                                <div className={style.subTitle}>
                                    <div style={{ width: '40%' }}>{this.state.groupsAppears[group.sort] ? '二级标题' : '一级模块'}</div>
                                    <div style={{ width: '20%' }}>状态</div>
                                    <div style={{ width: '40%' }}>操作</div>
                                    <i className={style.clear} />
                                </div>

                                <div className={style.content} ref={(elem) => { this.dragSecondAreas.push(elem); }} style={{ display: this.state.groupsAppears[group.sort] ? 'block' : 'none' }}>
                                    {
                                        group && group.secondChannels && group.secondChannels.map((secondChannel, secondChannelIndex) => {
                                            return (
                                                <div key={group.sort}>
                                                    <div style={{ width: '40%' }}>{secondChannel.name}</div>
                                                    <div style={{ width: '20%' }}>{(secondChannel.enable === 1) ? '已启用' : '未启用'}</div>
                                                    <div style={{ width: '40%' }} className={style.operation}>
                                                        <Button onClick={() => { this.props.editChannel(secondChannel.pid, secondChannel); }} title='编辑频道'>
                                                            <Icon type={'edit'}/>
                                                        </Button>
                                                        <Button onClick={() => { this.props.toEditChannel(secondChannel); }} title='配置频道'>
                                                            <Icon type={'setting'}/>
                                                        </Button>
                                                        <Button onClick={() => { this.props.removeChannel(secondChannel); }} title='删除频道'>
                                                            <Icon type={'close'}/>
                                                        </Button>
                                                    </div>
                                                    <i className={style.clear}/>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <div className={style.content} ref={(elem) => { this.dragCardsAreas.push(elem); }} style={{ display: this.state.groupsAppears[group.sort] ? 'none' : 'block' }}>
                                    {
                                        group && group.cards && group.cards.map((card, cardIndex) => {
                                            return (
                                                <div key={card.sort} className={cardIndex === 0 ? 'filterMenu' : ''}>
                                                    <div style={{ width: '40%' }}>{card.layoutName}</div>
                                                    <div style={{ width: '20%' }}>{(card.isEnable === 1) ? '已启用' : '未启用'}</div>
                                                    <div style={{ width: '40%' }} className={style.operation}>
                                                        <Button onClick={() => { this.props.toEditChannel(group, cardIndex); }} title='配置模块'>
                                                            <Icon type={'setting'}/>
                                                        </Button>
                                                        <Button onClick={() => { this.props.removeCard(group, cardIndex); }} title='删除模块'>
                                                            <Icon type={'close'}/>
                                                        </Button>
                                                    </div>
                                                    <i className={style.clear}/>
                                                </div>
                                            );
                                        })
                                    }
                                </div>

                                <div className={style.footer}>
                                    <Button onClick={() => { this.props.publish(group.id); }} style={{ color: '#009688' }} >发布</Button>
                                    <Button onClick={() => { this.props.editChannel(0, group); }} style={{ color: '#417BFF' }}>编辑频道</Button>
                                    <Button onClick={() => { this.props.removeChannel(group); }} style={{ color: '#FC363E' }}>删除频道</Button>
                                    <Button onClick={() => { this.props.toEditChannel(group); }} style={{ color: '#F57C00' }}>频道配置</Button>
                                    <Button onClick={() => { this.props.addChannel(group.id, group); }} style={{ color: '#ee49c9' }} >新增二级</Button>
                                    <Button onClick={this.changeAppearContent.bind(this, group.sort)} style={{ color: '#a2bf33' }} >切换显示</Button>
                                    <i className={style.clear}/>
                                </div>
                            </div>
                        );
                    })
                }
                <div className={`addButtonDiv ${style.addButtonDiv}`}> <Button className={style.addButton} onClick={() => { this.props.addChannel(0); }}><Icon type='plus'/></Button></div>

                <div className={style.clear}/>
            </div>
        );
    }
}
