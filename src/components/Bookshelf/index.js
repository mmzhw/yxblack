import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import styles from './style.module.css';
import Corner from './corner';
import Header from './header';
import Sortable from 'sortablejs';
import { SPECIAL_NAME, OPERATION_NAME } from '../../constants';

class Bookshelf extends Component {
    static defaultProps = {
        groups: []
    }

    componentDidUpdate() {
        let self = this;

        // 拖拽groups
        self.sortable = Sortable.create(self.refs.groups, {
            animation: 150,
            onEnd: (event) => {
                if (event.oldIndex === event.newIndex) {
                    return false;
                }
                self.props.dragGroup(event.oldIndex, event.newIndex, self.props.groups, -1);
            }
        });

        self.props.groups.forEach((group, index) => {
            let el = self.refs['group-' + index];
            if (el) {
                Sortable.create(el, {
                    animation: 150,
                    onEnd: (event) => {
                        if (event.oldIndex === event.newIndex) {
                            return false;
                        }
                        self.props.dragGroup(event.oldIndex, event.newIndex, group.labels, index);
                    }
                });
            }
        });
    }
    getCorner(group) {
        if (group.belong && group.belong === 1) {
            return (
                <Corner enable={-1} />
            );
        } else {
            return (
                <Corner enable={group.enable} />
            );
        }
    }

    render() {
        return (
            <div className={ styles['bookshelfs'] } ref={ 'groups' } style={{ overflow: 'hidden' }}>
                {
                    this.props.groups.map((group, groupIndex) => {
                        return (
                            <div className={ styles['bookshelf'] } key={group.id}>
                                {this.getCorner(group)}
                                <Header headerName={group.name} headerSubName={group.subName} />
                                <div className={ styles['bookshelf-body'] }>
                                    <div className={ styles['bookshelf-body-title'] }>
                                        <div className={ styles['body-title-item'] } style={{ width: '60%' }}>标题</div>
                                        <div className={ styles['body-title-item'] } style={{ width: '15%' }}>状态</div>
                                        <div className={ styles['body-title-item'] } style={{ width: '25%' }}>操作</div>
                                    </div>
                                    <div className={ styles['bookshelf-body-content'] } ref={'group-' + groupIndex}>
                                        {
                                            group && group.labels && group.labels.map((label, labelIndex) => {
                                                return (
                                                    <div className={ styles['body-content-list'] } key={label.id}>
                                                        <div className={ styles['dehaze'] }>
                                                            <span>{ this.props.dehaze ? '#' : ''}</span>
                                                        </div>
                                                        <div className={ styles['hover-items'] }>
                                                            <div className={ styles['body-content-list-item'] } style={{ width: '60%' }}>{label.name}</div>
                                                            <div className={ styles['body-content-list-item'] } style={{ width: '15%', color: (label.enable === 1 || label.isEnable === 1) ? '#417505' : '#999' }}>{(label.enable === 1 || label.isEnable === 1) ? '已启用' : '未启用'}</div>
                                                            <div className={ styles['body-content-list-item'] } style={{ width: '25%' }}>
                                                                {
                                                                    this.props.bodys.map((button, buttonIndex) => {
                                                                        return (
                                                                            <div key={buttonIndex}>
                                                                                <div className={ styles['label-list-button']} style={{ width: button.width, marginLeft: button.marginLeft }}>
                                                                                    <Button onClick={button.click.bind(null, groupIndex, labelIndex)} style={{ color: button.color && button.color.trim().length > 0 ? button.color : '' }}>
                                                                                        {
                                                                                            button.icon && button.icon.trim().length > 0 ? <Icon type={button.icon} style={{ fontSize: button.iconSize && button.iconSize.trim().length > 0 ? button.iconSize : '' }}/> : button.name
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
                                    <div className={ styles['bookshelf-footer-actions'] }>
                                        {
                                            this.props.footers.map((button, buttonIndex) => {
                                                if (group.name === SPECIAL_NAME.immutableChannelName &&
                                                    (button.name === OPERATION_NAME.DELETE || button.name === OPERATION_NAME.EDIT)) {
                                                    return '';// 精选时候不允许修改或删除此频道，所以隐藏掉
                                                }

                                                return (
                                                    <div className={ styles['footer-action'] } style={{ width: button.width }} key={buttonIndex}>
                                                        <Button style={{ color: button.color }} onClick={button.click.bind(null, groupIndex)}>{button.name}</Button>
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

export default Bookshelf;
