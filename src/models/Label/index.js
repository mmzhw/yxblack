import React, { Component } from 'react';
import YXBookshelf from '../../components/Bookshelf';
import { Modal, Switch, message } from 'antd';
import yxFetch from '../../utils/fetch';
import YXAddButton from '../../components/AddButton';
import style from './style.module.css';
import * as urls from '../../constants/urls';

class Bookshelf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            api: {
                groups: 'back/label/group/list',
                updateLabel: 'back/label/update',
                addLabel: 'back/label/add',
                updateGroup: 'back/label/group/update',
                addGroup: 'back/label/group/add',
            },
            groups: [],
            bodys: [{
                name: '设置',
                width: '50%',
                color: '', // 如果color存在且不为空，则显示color，否则显示默认颜色
                icon: 'setting', // 如果icon存在且不为空，则显示icon，否则显示name
                iconSize: '18px', // 如果iconSize存在且不为空，则显示iconSize图标大小，否则显示默认图标大小
                click: this.linkLabel.bind(this), // 删除标签
            }, {
                name: '编辑',
                width: '50%',
                color: '',
                icon: 'edit',
                iconSize: '18px',
                click: this.editLabel.bind(this), // 编辑标签
            }],
            footers: [{
                name: '编辑',
                width: '25%',
                color: '#039BE5',
                click: this.editGroup.bind(this), // 编辑标签组
            }, {
                name: '新增',
                width: '25%',
                color: '#F57C00',
                click: this.addLabel.bind(this), // 新增标签
            }],
            isModalShow: false,
            modalTitle: '',
            groupIndex: 0,
            labelIndex: 0,
            inputValue: '',
            popupView: '',
            checked: true,
            belong: 0,
            // drag param
            oldIndex: 0,
            newIndex: 0,
            sort: 0,
            headerClassName: '',
            dehaze: true
        };
        this.inputChange = this.inputChange.bind(this);
        this.switchChange = this.switchChange.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.getSwitchStatus = this.getSwitchStatus.bind(this);
        // drag function
        this.dragGroup = this.dragGroup.bind(this);
        this.dragLabel = this.dragLabel.bind(this);
    }
    componentWillMount() {
        this.getGroupsData();
    }
    render() {
        return (
            <div>
                <Modal
                    title={this.state.modalTitle}
                    style={{ width: 300 }}
                    visible={this.state.isModalShow}
                    onOk={() => this.setModalVisible(false, 0, 1)}
                    onCancel={() => this.setModalVisible(false, 0, 0)}
                >
                    <div>
                        <div className={style['label-input-title']}>标题</div>
                        <input type='text' className={style['label-input-text']} value={this.state.inputValue} onChange={this.inputChange} placeholder='请输入标题名'/>
                        { this.setSwitch(this.state.belong) }
                    </div>
                </Modal>
                <YXBookshelf
                    groups = {this.state.groups}
                    bodys = {this.state.bodys}
                    footers = {this.state.footers}
                    dragGroup = {this.dragGroup}
                    dragLabel = {this.dragLabel}
                    dehaze = {this.state.dehaze}
                />
                <YXAddButton
                    setToolTip={this.setToolTip()}
                    onClick={this.addGroup}
                />
            </div>
        );
    }
    getGroupsData() {
        yxFetch(this.state.api.groups, {})
            .then(res => {
                if (res.code === 0) {
                    /* 检测功能由后端处理
        this.checkSortRepeated(res.data)
        */
                    this.setState({
                        inputValue: ''
                    });
                    this.transform(res.data);
                } else {
                    message.error(res.errmsg, 5);
                }
            });
    }
    checkSortRepeated(groups) {
        this.checkSortRepeatedForGroups(groups);
    // this.checkSortRepeatedForLabels(groups)
    }
    checkSortRepeatedForGroups(groups) {
        const reqUrl = this.state.api.updateGroup;
        // 如果数据列表第一位的sort === 0，更新所有数据的sort
        if (groups[0].sort === 0) {
            for (let i = 0; i < groups.length; i += 1) {
                const reqParams = {
                    labelGroupId: groups[i].id,
                    sort: 1000 * (i + 1)
                };
                if (i === groups.length - 1) {
                    this.submitReq(reqUrl, reqParams, true); // updateType (0: 手动更新groups / 1: 异步更新)
                } else {
                    this.submitReq(reqUrl, reqParams, false);
                }
            }
        }
        // 如果列表中数据有两个sort相等，更新所有数据的sort
        for (let i = 1; i < groups.length; i += 1) {
            if (groups[i].sort === (groups[i - 1].sort || groups[i + 1].sort)) {
                for (let j = 0; j < groups.length; j += 1) {
                    const reqParams = {
                        labelGroupId: groups[j].id,
                        sort: 1000 * (j + 1)
                    };
                    if (j === groups.length - 1) {
                        this.submitReq(reqUrl, reqParams, true); // updateType (0: 手动更新groups / 1: 异步更新)
                    } else {
                        this.submitReq(reqUrl, reqParams, false);
                    }
                }
                break;
            }
        }
    }
    checkSortRepeatedForLabels(groups) {
    // 检测labels是否有重复的sort值
        const reqUrl = this.state.api.updateLabel;
        // 如果数据列表第一位的sort === 0，更新所有数据的sort
        for (let i = 0; i < groups.length; i += 1) {
            const labels = groups[i].labels;
            if (labels[0].sort === 0) {
                for (let j = 0; j < labels.length; j += 1) {
                    const reqParams = {
                        labelGroupId: labels[j].labelGroupId,
                        id: labels[j].id,
                        sort: 1000 * (j + 1)
                    };
                    if (i === groups.length - 1) {
                        this.submitReq(reqUrl, reqParams, true); // updateType (0: 手动更新groups / 1: 异步更新)
                    } else {
                        this.submitReq(reqUrl, reqParams, false);
                    }
                }
            }
            // 如果列表中数据有两个sort相等，更新所有数据的sort
            for (let i = 1; i < labels.length; i += 1) {
                if (labels[i].sort === (labels[i - 1].sort || labels[i + 1].sort)) {
                    for (let j = 0; j < labels.length; j += 1) {
                        const reqParams = {
                            labelGroupId: labels[j].labelGroupId,
                            id: labels[j].id,
                            sort: 1000 * (j + 1)
                        };
                        if (j === labels.length - 1) {
                            this.submitReq(reqUrl, reqParams, true); // updateType (0: 手动更新groups / 1: 异步更新)
                        } else {
                            this.submitReq(reqUrl, reqParams, false);
                        }
                    }
                    break;
                }
            }
        }
    }
    transform(bookshelfGroups) {
        let groups = [];
        for (let i = 0; i < bookshelfGroups.length; i += 1) {
            let bookshelfGroup = bookshelfGroups[i];
            bookshelfGroup.name = bookshelfGroups[i].groupName;
            // bookshelfGroup.imageUrl = 'back-1494062042074-32.jpg'
            // bookshelfGroup.subName = 'test'
            let bookshelfLists = bookshelfGroups[i].labels;
            for (let j = 0; j < bookshelfLists.length; j += 1) {
                let bookshelfList = bookshelfGroups[i].labels[j];
                bookshelfList.name = bookshelfGroups[i].labels[j].labelName;
            }
            groups[i] = bookshelfGroup;
        }
        this.setState({
            groups: groups
        });
    }
    linkLabel(groupIndex, labelIndex) {
        this.setState({
            groupIndex,
            labelIndex,
            popupView: 'linkLabel'
        }, () => {
            this.setModal('linkLabel');
        });
    }
    editLabel(groupIndex, labelIndex) {
        this.setState({
            groupIndex,
            labelIndex,
            popupView: 'editLabel'
        }, () => {
            this.setModal('editLabel');
            this.getSwitchStatus();
            this.setModalVisible(true, 1);
        });
    }
    editGroup(groupIndex) {
        const belong = this.state.groups[groupIndex].belong;
        if (belong === 1) {
            message.warning('该标签组不能修改！', 5);
        } else {
            this.setState({
                groupIndex,
                popupView: 'editGroup'
            }, () => {
                this.setModal('editGroup');
                this.getSwitchStatus();
                this.setModalVisible(true, 1);
            });
        }
    /* 直接修改属性group
    this.setState({
      groupIndex,
      popupView: 'editGroup'
    }, () => {
      this.setModal('editGroup')
      this.getSwitchStatus()
      this.setModalVisible(true, 1)
    })
    */
    }
    addGroup() {
        this.setState({ popupView: 'addGroup' }, () => {
            this.setModal('addGroup');
            this.getSwitchStatus();
            this.setModalVisible(true, 1);
        });
    }
    addLabel(groupIndex) {
        this.setState({
            groupIndex,
            popupView: 'addLabel'
        }, () => {
            this.setModal('addLabel');
            this.getSwitchStatus();
            this.setModalVisible(true, 1);
        });
    }
    setModalVisible(isModalShow, status, buttonType) {
        this.setState({ isModalShow });
        switch (status) {
            case 0:
                this.getButtonType(buttonType);
                break;
            case 1:
                this.getButtonType(buttonType);
                break;
            default:
                break;
        }
    }
    getButtonType(type) {
        if (type !== undefined) {
            switch (type) {
                case 0:
                    console.log('取消');
                    break;
                case 1:
                    this.submit(this.state.popupView);
                    break;
                default:
                    break;
            }
        }
    }
    submit(popupView) {
        switch (popupView) {
            case 'editLabel':
                this.getSubmitParams();
                break;
            case 'editGroup':
                this.getSubmitParams();
                break;
            case 'addLabel':
                this.getSubmitParams();
                break;
            case 'addGroup':
                this.getSubmitParams();
                break;
            default:
                break;
        }
    }
    getSubmitParams() {
        const popupView = this.state.popupView;
        const inputValue = this.state.inputValue;
        const groupIndex = this.state.groupIndex;
        const params = {
            inputValue: inputValue
        };
        let reqParams = {};
        if (this.checkSubmitParams(params)) {
            let reqUrl = '';
            let listsLength = 0;
            let sort = 1000;
            switch (popupView) {
                case 'editLabel':
                    const labelIndex = this.state.labelIndex;
                    reqUrl = this.state.api.updateLabel;
                    reqParams = {
                        labelGroupId: this.state.groups[groupIndex].labels[labelIndex].labelGroupId,
                        labelId: this.state.groups[groupIndex].labels[labelIndex].id,
                        labelName: params.inputValue.trim(),
                        sort: 1000 * (labelIndex + 1),
                        enable: +this.state.isChecked
                    };
                    this.submitReq(reqUrl, reqParams, 1, true);
                    break;
                case 'editGroup':
                    reqUrl = this.state.api.updateGroup;
                    reqParams = {
                        labelGroupId: this.state.groups[groupIndex].id,
                        groupName: params.inputValue.trim(),
                        enable: +this.state.isChecked,
                        sort: 1000 * (groupIndex + 1),
                        choice: 1
                    };
                    this.submitReq(reqUrl, reqParams, 1, true);
                    break;
                case 'addLabel':
                    reqUrl = this.state.api.addLabel;
                    listsLength = this.state.groups[groupIndex].labels.length;
                    if (listsLength === 0) {
                        sort = 1000;
                    } else {
                        sort = 1000 * (listsLength + 1);
                    }
                    reqParams = {
                        labelGroupId: this.state.groups[groupIndex].id,
                        labelName: params.inputValue.trim(),
                        sort: sort,
                        enable: +this.state.isChecked
                    };
                    this.submitReq(reqUrl, reqParams, 1, true);
                    break;
                case 'addGroup':
                    reqUrl = this.state.api.addGroup;
                    listsLength = this.state.groups.length;
                    if (listsLength === 0) {
                        sort = 1000;
                    } else {
                        sort = 1000 * (listsLength + 1);
                    }
                    reqParams = {
                        groupName: params.inputValue.trim(),
                        enable: +this.state.isChecked,
                        sort: sort,
                        choice: 1
                    };
                    this.submitReq(reqUrl, reqParams, 1, true);
                    break;
                default:
                    break;
            }
        } else {
            this.setState({
                isModalShow: true
            });
            console.log('submit request error .... ');
        }
    }
    submitReq(reqUrl, reqParams, isShowMessage) {
        const popupView = this.state.popupView;
        let successMessage = '更新成功！';
        let errorMessage = '更新失败！';
        yxFetch(reqUrl, reqParams)
            .then(res => {
                if (res.code === 0) {
                    switch (popupView) {
                        case 'editLabel':
                            successMessage = '更新标签成功！';
                            break;
                        case 'editGroup':
                            successMessage = '更新标签组成功！';
                            break;
                        case 'addLabel':
                            successMessage = '新增标签成功！';
                            break;
                        case 'addGroup':
                            successMessage = '新增标签组成功！';
                            break;
                        default:
                            break;
                    }
                    this.setState({
                        isModalShow: false
                    });
                    if (isShowMessage) {
                        message.success(successMessage, 5);
                        this.getGroupsData();
                    }
                } else {
                    switch (popupView) {
                        case 'editLabel':
                            errorMessage = '更新标签失败！';
                            break;
                        case 'editGroup':
                            errorMessage = '更新标签组失败！';
                            break;
                        case 'addLabel':
                            errorMessage = '新增标签失败！';
                            break;
                        case 'addGroup':
                            errorMessage = '新增标签组失败！';
                            break;
                        default:
                            break;
                    }
                    this.setState({
                        isModalShow: true
                    });
                    if (isShowMessage) {
                        message.error(res.errmsg || errorMessage, 5);
                        this.getGroupsData();
                    }
                }
            });
    }
    checkSubmitParams(params) {
        const popupView = this.state.popupView;
        if (params.inputValue.trim().length === 0) {
            message.warning('标题名称不能为空', 5);
            return false;
        }
        if (params.inputValue.trim().length > 0) {
            switch (popupView) {
                case 'editLabel':
                    if (this.getByteLength(params.inputValue.trim()) > 20) {
                        message.warning('标题字数不能超过20个字节', 5);
                        return false;
                    }
                    break;
                case 'editGroup':
                    if (this.getByteLength(params.inputValue.trim()) > 20) {
                        message.warning('标题字数不能超过20个字节', 5);
                        return false;
                    }
                    break;
                case 'addLabel':
                    if (this.getByteLength(params.inputValue.trim()) > 20) {
                        message.warning('标题字数不能超过20个字节', 5);
                        return false;
                    }
                    break;
                case 'addGroup':
                    if (this.getByteLength(params.inputValue.trim()) > 20) {
                        message.warning('标题字数不能超过20个字节', 5);
                        return false;
                    }
                    break;
                default:
                    break;
            }
            return true;
        }
        return true;
    }

    setModal(type) {
        let modalTitle = '';
        switch (type) {
            case 'linkLabel':
                this.linkTo();
                break;
            case 'editLabel':
                modalTitle = '编辑标签';
                this.editLabelModalContent();
                break;
            case 'addLabel':
                modalTitle = '新增标签';
                this.addLabelModalContent();
                break;
            case 'editGroup':
                modalTitle = '编辑标签组';
                this.editGroupModalContent();
                break;
            case 'addGroup':
                modalTitle = '新增标签组';
                this.addGroupModalContent();
                break;
            default:
                break;
        }
        this.setState({ modalTitle });
    }
    setSwitch(belong) {
        if (belong !== 1) {
            return (
                <Switch
                    checkedChildren={'开'}
                    unCheckedChildren={'关'}
                    checked={this.state.isChecked}
                    onChange={this.switchChange}
                    style={{ marginTop: '20px' }}
                />
            );
        }
    }
    linkTo() {
        const groupIndex = this.state.groupIndex;
        if (this.state.groups[groupIndex].name.indexOf('分类') >= 0) {
            const labelIndex = this.state.labelIndex;
            const labelId = this.state.groups[groupIndex].labels[labelIndex].id;
            this.props.match.history.push(`${urls.LABEL}/recommend/${labelId}`);
        } else {
            message.warning('该标签组的标签不能设置推荐视频！', 5);
        }
    }
    editLabelModalContent() {
        const groupIndex = this.state.groupIndex;
        const labelIndex = this.state.labelIndex;
        const labelName = this.state.groups[groupIndex].labels[labelIndex].name;
        this.setState({
            inputValue: labelName,
            belong: this.state.groups[groupIndex].belong
        });
    }
    addLabelModalContent() {
        const groupIndex = this.state.groupIndex;
        const labelName = '';
        this.setState({
            inputValue: labelName,
            belong: this.state.groups[groupIndex].belong
        });
    }
    editGroupModalContent() {
        const groupIndex = this.state.groupIndex;
        const groupName = this.state.groups[groupIndex].name;
        this.setState({
            inputValue: groupName,
            belong: this.state.groups[groupIndex].belong
        });
    }
    addGroupModalContent() {
        const groupName = '';
        this.setState({
            inputValue: groupName
        });
    }
    inputChange(e) {
        this.setState({
            inputValue: e.target.value
        });
    }
    switchChange(isChecked) {
        this.setState({
            isChecked: isChecked,
            inputValue: this.state.inputValue
        });
    }
    getSwitchStatus() {
        const groupIndex = this.state.groupIndex;
        const popupView = this.state.popupView;
        let enable = true;
        switch (popupView) {
            case 'editLabel':
                enable = +this.state.groups[groupIndex].labels[this.state.labelIndex].enable;
                break;
            case 'editGroup':
                enable = +this.state.groups[groupIndex].enable;
                break;
            case 'addLabel':
                enable = 1;
                break;
            case 'addGroup':
                enable = 1;
                break;
            default:
                break;
        }
        if (enable === 1) {
            this.setState({
                isChecked: true
            });
        } else {
            this.setState({
                isChecked: false
            });
        }
    }
    setToolTip() {
        return (
            <div className={style['add-button-tooltip-text']}>新增</div>
        );
    }
    dragGroup(oldIndex, newIndex) {
        const groups = this.state.groups;
        if (oldIndex !== newIndex) {
            this.setState({
                popupView: 'editGroup'
            }, () => {
                const reqUrl = this.state.api.updateGroup;
                let sort = 0;
                if (oldIndex < newIndex) {
                    if (newIndex !== groups.length - 1) {
                        sort = parseInt((groups[newIndex].sort + groups[newIndex + 1].sort) / 2, 10);
                    } else { // 移动到最后一位
                        sort = parseInt(groups[newIndex].sort + 500, 10);
                    }
                } else { // oldIndex > newIndex
                    if (newIndex !== 0) {
                        sort = parseInt((groups[newIndex - 1].sort + groups[newIndex].sort) / 2, 10);
                    } else { // 移动到第一位
                        sort = parseInt(groups[newIndex].sort / 2, 10);
                    }
                }
                const reqParams = {
                    labelGroupId: this.state.groups[oldIndex].id,
                    sort: sort
                };
                this.setState({
                    oldIndex: oldIndex,
                    newIndex: newIndex,
                    sort: sort
                }, () => {
                    this.submitReq(reqUrl, reqParams, true); // updateType (0: 手动更新groups / 1: 异步更新)
                });
            });
        }
    }
    dragLabel(groupIndex, oldIndex, newIndex) {
        const labels = this.state.groups[groupIndex].labels;
        if (oldIndex !== newIndex) {
            this.setState({
                popupView: 'editLabel'
            }, () => {
                const reqUrl = this.state.api.updateLabel;
                let sort = 0;
                if (oldIndex < newIndex) {
                    if (newIndex !== labels.length - 1) {
                        sort = parseInt((labels[newIndex].sort + labels[newIndex + 1].sort) / 2, 10);
                    } else { // 移动到最后一位
                        sort = parseInt(labels[newIndex].sort + 500, 10);
                    }
                } else { // oldIndex > newIndex
                    if (newIndex !== 0) {
                        sort = parseInt((labels[newIndex - 1].sort + labels[newIndex].sort) / 2, 10);
                    } else { // 移动到第一位
                        sort = parseInt(labels[newIndex].sort / 2, 10);
                    }
                }
                const reqParams = {
                    labelGroupId: labels[oldIndex].labelGroupId,
                    labelId: labels[oldIndex].id,
                    sort: sort
                };
                this.setState({
                    oldIndex: oldIndex,
                    newIndex: newIndex,
                    sort: sort
                }, () => {
                    this.submitReq(reqUrl, reqParams, true); // updateType (0: 手动更新groups / 1: 异步更新)
                });
            });
        }
    }
    getByteLength(str) {
        return str.replace(/[^\x20-\xff]/g, 'xx').length;
    }
}

export default Bookshelf;
