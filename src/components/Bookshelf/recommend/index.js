import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import style from './style.module.css';
// import Corner from './corner'
// import Header from './header'

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bodys: this.props.bodys,
            footers: this.props.footers.reverse()
        };
    }
    render() {
        return (
            <div className={ style['bookshelf'] }>
                <div className={ style['bookshelf-body'] }>
                    <div className={ style['bookshelf-body-title'] }>
                        <div className={ style['body-title-item'] } style={{ width: '75%' }}>标题</div>
                        <div className={ style['body-title-item'] } style={{ width: '25%' }}>状态</div>
                    </div>
                    <div className={ style['bookshelf-body-content'] }>
                        {
                            this.props.lists.map((list, listIndex) => {
                                return (
                                    <div className={ style['body-content-list'] } key={listIndex}>
                                        <div className={ style['body-content-list-item'] } style={{ width: '75%' }}>{list.name}</div>
                                        <div className={ style['body-content-list-item'] } style={{ width: '25%' }}>
                                            {
                                                this.state.bodys.map((button, buttonIndex) => {
                                                    return (
                                                        <div key={buttonIndex}>
                                                            <div className={ style['label-list-button']}>
                                                                <Button onClick={button.click.bind(this, listIndex)} style={{ color: button.color && button.color.trim().length > 0 ? button.color : '' }}>
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
                                );
                            })
                        }
                    </div>
                </div>
                <div className={ style['bookshelf-footer'] }>
                    <div className={ style['bookshelf-footer-actions'] }>
                        {
                            this.state.footers.map((button, buttonIndex) => {
                                return (
                                    <div className={ style['footer-action'] } style={{ width: button.width }} key={buttonIndex}>
                                        <Button style={{ color: button.color }} onClick={button.click.bind(this)}>{button.name}</Button>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Recommend;
