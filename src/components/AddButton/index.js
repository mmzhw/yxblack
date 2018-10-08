import React, { Component } from 'react';
import style from './style.module.css';

class AddButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.setToolTip = this.props.setToolTip;
    }
    render() {
        return (
            <div className={style['add-button']}>
                <div className={style['add-button-tooltip']}>
                    {this.setToolTip}
                </div>
                <button className={style['plus-icon']} onClick={this.props.onClick}>+</button>
            </div>
        );
    }
}

export default AddButton;
