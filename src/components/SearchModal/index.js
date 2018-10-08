import React, { Component } from 'react';
import { Modal, Input, Checkbox, Icon } from 'antd';
import style from './style.module.css';

class SearchModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }
    render() {
        return (
            <Modal
                width = {this.props.width}
                style = {{ height: this.props.height }}
                visible = {this.props.visible}
                onOk = {this.onOk}
                onCancel = {this.onCancel}
                closable = {this.props.closeButtonVisible}
            >
                <div className = {style['search-modal-content']}>
                    <div className={style['search-modal-search-icon']}>
                        <Icon type='search'/>
                    </div>
                    <Input onChange={this.onInputChange} className={style['search-modal-input']} value={this.state.value} />
                    <div className = {style['search-modal-results']}>
                        {this.props.resultLists.map((resultItem, index) => (
                            <div className = {style['search-modal-result']} key={index}>
                                <Checkbox onChange={this.onCheckboxChange.bind(this, index)} checked={resultItem.checked}>{ resultItem.name }</Checkbox>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        );
    }
    // 搜索文字改变
    onInputChange(e) {
        this.props.onInputChange(e.target.value);
        this.setState({
            value: e.target.value
        });
    }
    // checkbox触发选择事件
    onCheckboxChange(index, e) {
        this.props.onCheckboxChange(index, e.target.checked);
    }
    onOk() {
        this.props.onOk();
        this.setState({
            value: '',
        });
    }
    onCancel() {
        this.props.onCancel();
        this.setState({
            value: '',
        });
    }
}

export default SearchModal;
