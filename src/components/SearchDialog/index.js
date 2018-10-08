import { Modal, Input, Checkbox } from 'antd';
import React, { Component } from 'react';
import style from './style.module.css';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // (prop)
            resultList: [], // 搜索结果列表 (prop)
            confirmedItems: {}, // 已经选中的items (prop)
            checkedItems: {}, // 弹窗内选中的items
        };
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.toggleCheck = this.toggleCheck.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible,
            resultList: nextProps.resultList,
            confirmedItems: nextProps.confirmedItems,
        });
    }
    // 按确定
    onOk() {
        this.setState({
            visible: false
        });
        this.props.onConfirm();
    }
    // 关闭
    onCancel() {
        this.setState({
            visible: false
        });
        this.props.onCancel();
    }
    // 搜索文字改变
    onInputChange(e) {
        let word = e.target.value;
        this.props.onInputChange(word);
    }
    // 改变选中状态
    toggleCheck(itemId, itemVal) {
        let checkedItems = this.state.checkedItems;
        if (!checkedItems[itemId]) {
            checkedItems[itemId] = itemVal;
        } else {
            delete checkedItems[itemId];
        }
        this.props.toggleCheck();
    }
    render() {
        return (
            <Modal
                className = {style['search-dialog']}
                visible = {this.state.visible}
                maskClosable = {true}
                onOk = {this.onOk}
                onCancel = {this.onCancel}
                width = {570}
            >
                <Input onChange={this.onInputChange}/>
                <div className = {style['search-results']}>
                    {this.state.resultList.map((resultItem, index) => (
                        <div className = {style['search-result']} key={index}>
                            <Checkbox onChange={this.toggleCheck.bind(this, resultItem['videoBaseId'], resultItem['name'])}>{ resultItem['name'] }</Checkbox>
                        </div>
                    ))}
                </div>
            </Modal>
        );
    }
}

export default App;
