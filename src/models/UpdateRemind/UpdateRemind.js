/**
 * Created by yiming on 2017/5/24.
 */
import React, { Component } from 'react';
import style from './style.module.css';
import yxFetch from '../../utils/fetch';
import UpdateArea from './UpdateArea.js';
import { message } from 'antd';
import _ from 'lodash';
import alterBreadItemName from '../../utils/alterBreadItemName';
import { REQ_URL } from '../../constants/constants';

const errorInfo = () => {
    message.error('版本更新提示发布失败，请重试');
};

const successInfo = () => {
    message.success('版本更新提示发布成功');
};

let initialData = null;

class UpdateRemind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            I: {
                updateInfo: {
                    titleContent: {
                        value: ''
                    },
                    versionNum: {
                        value: ''
                    },
                    download: {
                        value: ''
                    },
                    info: new Array(4).fill({
                        value: '',
                        validateStatus: '',
                        help: ''
                    })
                },
                forceUpdateInfo: {
                    titleContent: {
                        value: ''
                    },
                    versionNum: {
                        value: ''
                    },
                    download: {
                        value: ''
                    },
                    info: new Array(4).fill({
                        value: '',
                        validateStatus: '',
                        help: ''
                    })
                }
            },
            A: {
                updateInfo: {
                    titleContent: {
                        value: ''
                    },
                    versionNum: {
                        value: ''
                    },
                    download: {
                        value: ''
                    },
                    qqUrl: {
                        value: 'http://'
                    },
                    info: new Array(4).fill({
                        value: '',
                        validateStatus: '',
                        help: ''
                    })
                },
                forceUpdateInfo: {
                    titleContent: {
                        value: ''
                    },
                    versionNum: {
                        value: ''
                    },
                    download: {
                        value: ''
                    },
                    qqUrl: {
                        value: 'http://'
                    },
                    info: new Array(4).fill({
                        value: '',
                        validateStatus: '',
                        help: ''
                    })
                }
            },
        };

        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleUpdateAreaChange = this.handleUpdateAreaChange.bind(this);
        this.handleForceUpdateChange = this.handleForceUpdateChange.bind(this);
        this.handleNormalSubmit = this.handleNormalSubmit.bind(this);
        this.handleForceSubmit = this.handleForceSubmit.bind(this);
        this.handleUpdateVersionChange = this.handleUpdateVersionChange.bind(this);
        this.handleForceVersionChange = this.handleForceVersionChange.bind(this);
    }

    validateContentLength(value, rule, validateMsg) {
        if (!rule) {
            return {
                ...validateMsg,
                validateStatus: 'success',
                help: null
            };
        } else if (rule) {
            let { min, max } = rule;
            let valueLength = value.length;
            if (min && !max && valueLength >= min) {
                return {
                    ...validateMsg,
                    validateStatus: 'success',
                    help: null
                };
            } else if (!min && max && valueLength <= max) {
                return {
                    ...validateMsg,
                    validateStatus: 'success',
                    help: null
                };
            } else if (!min && !max && valueLength) {
                return {
                    ...validateMsg,
                    validateStatus: 'success',
                    help: null
                };
            } else if (min && max && min <= valueLength <= max) {
                return {
                    ...validateMsg,
                    validateStatus: 'success',
                    help: null
                };
            } else {
                return {
                    ...validateMsg,
                    validateStatus: 'error'
                };
            }
        }
    }

    _handleVersionInfoChange(e, key, index, validateRule, validateMsg) {
        const value = e.target.value;
        let info = this.state[this.props.systemType][key]['info'].slice();
        info[index] = {
            ...this.validateContentLength(value, validateRule, validateMsg),
            value
        };
        let subVersionInfo = { ...this.state[this.props.systemType][key], info };
        let systemVersionInfo = { ...this.state[this.props.systemType], [key]: subVersionInfo };
        this.setState({
            [this.props.systemType]: systemVersionInfo
        });
    }

    handleUpdateVersionChange(e, index, validateRule, validateMsg) {
        this._handleVersionInfoChange(e, 'updateInfo', index, validateRule, validateMsg);
    }

    handleForceVersionChange(e, index, validateRule, validateMsg) {
        this._handleVersionInfoChange(e, 'forceUpdateInfo', index, validateRule, validateMsg);
    }

    handleContentChange(e, key, subKey, validateRule, validateMsg) {
    // let value = e.target.value.trim()
        const value = e.target.value;
        let subObj = {
            [subKey]: {
                ...this.validateContentLength(value, validateRule, validateMsg),
                value
            }
        };
        let subVersionInfo = { ...this.state[this.props.systemType][key], ...subObj };
        let systemVersionInfo = { [key]: subVersionInfo };
        systemVersionInfo = { ...this.state[this.props.systemType], ...systemVersionInfo };
        this.setState({
            [this.props.systemType]: systemVersionInfo
        });
    }

    handleUpdateAreaChange(e, subKey, validateRule, validateMsg) {
        this.handleContentChange(e, 'updateInfo', subKey, validateRule, validateMsg);
    }

    handleForceUpdateChange(e, subKey, validateRule, validateMsg) {
        this.handleContentChange(e, 'forceUpdateInfo', subKey, validateRule, validateMsg);
    }

    handleNormalSubmit(e) {
        let updateInfo = this.state[this.props.systemType]['updateInfo'];
        for (let i in updateInfo) {
            let info = updateInfo[i];
            if (!info.length) {
                if (!info.value || (info.validateStatus && info.validateStatus !== 'success')) {
                    return errorInfo();
                }
            } else {
                for (let i = 0; i < info.length; i++) {
                    if (info[i].validateStatus && info[i].validateStatus !== 'success') {
                        return errorInfo();
                    }
                }
            }
        }
        return this.addNormalVersion();
    }

    addNormalVersion() {
        let systemType = this.props.systemType;
        let updateInfo = this.state[systemType]['updateInfo'];
        let normal = this.getUpdateVersionInfo(updateInfo);
        initialData[systemType]['normal'] = normal;
        this.updateConfig(initialData);
    }

    handleForceSubmit(e) {
        let forceUpdateInfo = this.state[this.props.systemType]['forceUpdateInfo'];
        for (let i in forceUpdateInfo) {
            let info = forceUpdateInfo[i];
            // 版本更新信息不需要做验证
            if (!info.length) {
                if (!info.value || (info.validateStatus && info.validateStatus !== 'success')) {
                    return errorInfo();
                }
            } else {
                for (let i = 0; i < info.length; i++) {
                    if (info[i].validateStatus && info[i].validateStatus !== 'success') {
                        return errorInfo();
                    }
                }
            }
        }
        return this.addForceUpdateInfo();
    }

    addForceUpdateInfo() {
        let systemType = this.props.systemType;
        let forceUpdateInfo = this.state[systemType]['forceUpdateInfo'];
        let force = this.getUpdateVersionInfo(forceUpdateInfo);
        initialData[systemType]['force'] = force;
        this.updateConfig(initialData);
    }

    deleteSpace(data) {
        for (let i in data) {
            if (typeof data[i] === 'object') {
                this.deleteSpace(data[i]);
            } else {
                // data[i] = data[i].replace(/\s+/g, '')
                data[i] = data[i] ? data[i].trim() : '';
                // data[i] = data[i].trim()
            }
        }
    }

    updateConfig(data) {
        this.deleteSpace(data);
        return yxFetch(REQ_URL.MOBILE_UPDATE, { json: JSON.stringify(data) })
            .then((res) => {
                if (res.code === 0) {
                    successInfo();
                } else {
                    message.info(res.errmsg);
                }
            });
    }

    getUpdateVersionInfo(updateInfo) {
        let versionInfo = {
            version: '',
            url: '',
            qqUrl: 'http://',
            content: {
                title: '',
                descrip: []
            }
        };
        versionInfo.version = updateInfo.versionNum.value;
        versionInfo.url = updateInfo.download.value;
        versionInfo.qqUrl = updateInfo.qqUrl ? updateInfo.qqUrl.value : '';
        versionInfo.content.title = updateInfo.titleContent.value;
        versionInfo.content.descrip = updateInfo.info.map(item => {
            return item.value;
        });
        return versionInfo;
    }

    getVersionInfo() {
        yxFetch(REQ_URL.MOBILE_CONFIG, {})
            .then(res => {
                if (res.code === 0) {
                    let curVersionInfo = res.data;
                    let iosNormalInfo = curVersionInfo['I']['normal'];
                    let iosForceInfo = curVersionInfo['I']['force'];
                    let androidNormalInfo = curVersionInfo['A']['normal'];
                    let androidForceInfo = curVersionInfo['A']['force'];
                    let _dealDescripContent = this._dealDescripContent;
                    let data = {
                        I: {
                            updateInfo: {
                                titleContent: {
                                    value: iosNormalInfo.content.title
                                },
                                versionNum: {
                                    value: iosNormalInfo.version
                                },
                                download: {
                                    value: iosNormalInfo.url
                                },
                                info: _dealDescripContent(iosNormalInfo.content.descrip)
                            },
                            forceUpdateInfo: {
                                titleContent: {
                                    value: iosForceInfo.content.title
                                },
                                versionNum: {
                                    value: iosForceInfo.version
                                },
                                download: {
                                    value: iosForceInfo.url
                                },
                                info: _dealDescripContent(iosForceInfo.content.descrip)
                            }
                        },
                        A: {
                            updateInfo: {
                                titleContent: {
                                    value: androidNormalInfo.content.title
                                },
                                versionNum: {
                                    value: androidNormalInfo.version
                                },
                                download: {
                                    value: androidNormalInfo.url
                                },
                                qqUrl: {
                                    value: androidNormalInfo.qqUrl || 'http://'
                                },
                                info: _dealDescripContent(androidNormalInfo.content.descrip)
                            },
                            forceUpdateInfo: {
                                titleContent: {
                                    value: androidForceInfo.content.title
                                },
                                versionNum: {
                                    value: androidForceInfo.version
                                },
                                download: {
                                    value: androidForceInfo.url
                                },
                                qqUrl: {
                                    value: androidForceInfo.qqUrl || 'http://'
                                },
                                info: _dealDescripContent(androidForceInfo.content.descrip)
                            }
                        }
                    };
                    initialData = curVersionInfo;
                    this.setState(data);
                } else {
                    message.error(res.errmsg);
                }
            });
    }

    _dealDescripContent(descrips) {
        let array = [];
        for (let i = 0; i < 4; i++) {
            array.push({
                value: descrips[i],
                validateStatus: 'success',
                help: ''
            });
        }
        return array;
    }

    _updateBreadItem(systemType) {
        if (systemType === 'A') {
            alterBreadItemName('Android版本更新提示');
        } else {
            alterBreadItemName('IOS版本更新提示');
        }
    }

    componentDidMount() {
        this.getVersionInfo();
        const { systemType } = this.props;
        this._updateBreadItem(systemType);
    }
    componentWillReceiveProps(nextProps) {
        this.getVersionInfo();
        const { systemType } = nextProps;
        this._updateBreadItem(systemType);
    }

    render() {
        const { updateInfo, forceUpdateInfo } = this.state[this.props.systemType];
        const secondAreaStyle = { marginLeft: '24px' };
        return (
            <div className={style['reminder']}>
                <UpdateArea
                    title='更新提示配置'
                    handleContentChange={this.handleUpdateAreaChange}
                    handleDescripChange={this.handleUpdateVersionChange}
                    updateInfo={updateInfo}
                    handleSubmit={_.debounce(this.handleNormalSubmit, 500)}>
                </UpdateArea>
                <UpdateArea
                    styleObj={secondAreaStyle}
                    title='强制更新提示配置'
                    handleContentChange={this.handleForceUpdateChange}
                    handleDescripChange={this.handleForceVersionChange}
                    updateInfo={forceUpdateInfo}
                    handleSubmit={_.debounce(this.handleForceSubmit, 500)}>
                </UpdateArea>
                <div style={{ clear: 'both' }}/>
            </div>
        );
    }
}

export default UpdateRemind;
