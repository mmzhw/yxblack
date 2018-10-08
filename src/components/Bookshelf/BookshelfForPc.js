import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import styles from './style.module.css';
import Corner from './corner';
import Header from './header';
import Sortable from 'sortablejs';

let sortArea = null;

export default class Bookshelf extends Component {
    dragAreas = []

    componentDidMount() {
        sortArea = document.getElementById(`groups`);
        Sortable.create(sortArea, {
            animation: 150,
            filter: '.addButtonDiv',
            onEnd: (e) => {
                this.props.dragChannel(e.oldIndex, e.newIndex, this.props.groups, -1);
            }
        });
    }

    componentDidUpdate() {
        this.props.groups.forEach((group, groupIndex) => {
            const subSortArea = this.dragAreas[groupIndex];
            const self = this;
            new Sortable(subSortArea, {
                animation: 150,
                onEnd: function(e) {
                    self.props.dragChannel(e.oldIndex, e.newIndex, self.props.groups[groupIndex].secoundChannels, groupIndex);
                }
            });
        });
    }

    render() {
        return (
            <div className={ styles['bookshelfs'] } id={ 'groups' }>
                {
                    this.props.groups.map((group, groupIndex) => {
                        const groupName = group.name === '新城镇' ? `${group.name}(名称不可修改)` : group.name;
                        return (
                            <div className={ styles['bookshelf'] } key={group.id}>
                                <Corner enable={group.enable} />
                                <Header headerName={groupName} />
                                <div className={ styles['bookshelf-body'] }>
                                    <div className={ styles['bookshelf-body-title'] }>
                                        <div className={ styles['body-title-item'] } style={{ width: '40%' }}>标题</div>
                                        <div className={ styles['body-title-item'] } style={{ width: '20%' }}>状态</div>
                                        <div className={ styles['body-title-item'] } style={{ width: '40%' }}>操作</div>
                                    </div>
                                    <div className={ styles['bookshelf-body-content'] } id={'group-' + groupIndex} ref={(elem) => { this.dragAreas.push(elem); }}>
                                        {
                                            group && group.secoundChannels && group.secoundChannels.map((secoundChannel) => {
                                                return (
                                                    <div className={ styles['body-content-list'] } style={{ marginTop: 50 }} key={secoundChannel.id}>
                                                        <div className={ styles['hover-items'] }>
                                                            <div className={ styles['body-content-list-item'] } style={{ width: '40%' }}>{secoundChannel.name}</div>
                                                            <div className={ styles['body-content-list-item'] } style={{ width: '20%', color: (secoundChannel.enable === 1) ? '#417505' : '#999' }}>{(secoundChannel.enable === 1) ? '已启用' : '未启用'}</div>
                                                            <div className={ styles['body-content-list-item'] } style={{ width: '40%' }}>
                                                                {
                                                                    this.props.bodys.map((button, buttonIndex) => {
                                                                        return (
                                                                            <div key={buttonIndex}>
                                                                                <div className={ styles['label-list-button']} style={{ width: button.width, marginLeft: button.marginLeft }}>
                                                                                    <Button onClick={() => button.click(group, groupIndex, secoundChannel)} style={{ color: button.color }}>
                                                                                        {
                                                                                            button.icon ? <Icon type={button.icon} style={{ fontSize: button.iconSize && button.iconSize && button.iconSize }}/> : button.name
                                                                                        }
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={ styles['bookshelf-footer'] }>
                                    <div className={ styles['bookshelf-footer-actions'] } style={{ width: '100%' }}>
                                        {
                                            this.props.footers.map((button, buttonIndex) => {
                                                return (
                                                    <div className={ styles['footer-action'] } style={{ width: button.width }} key={buttonIndex}>
                                                        <Button style={{ color: button.color }} onClick={() => button.click(group, groupIndex)}>{button.name}</Button>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
                {
                    this.props.addChannel ? (
                        <div className={`addButtonDiv ${styles.addButtonDiv}`}> <Button className={styles.addButton} onClick={() => { this.props.addChannel(0); }}><Icon type='plus'/></Button></div>
                    ) : ''
                }
                <div style={{ clear: 'both' }}/>
            </div>
        );
    }
}
