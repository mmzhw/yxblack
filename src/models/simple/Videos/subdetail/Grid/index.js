import React, { Component } from 'react';
import { Button } from 'antd';
import style from './style.module.css';

class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value ? props.value : 0,
            disabled: !!props.disabled,
            tag: props.tag ? props.tag : '',
        };
    }
    componentWillReceiveProps(props) {
        this.setState({
            disabled: props.disabled,
            value: props.value
        });
    }
    componentDidMount() {
    }
    render() {
        return (
            <Button className={`${style['grid']} ${this.state.tag ? style[this.state.tag] : ''}`} disabled={this.state.disabled}>
                {this.state.value}
            </Button>
        );
    }
}

export default Grid;
