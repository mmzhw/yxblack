import React, { Component } from 'react';
import { message } from 'antd';
import LiveStreamModal from './LiveStreamConfig';
import LiveStreamList from './LiveStreamList';
import PlayBackConfig from '../PlayBack/PlayBackConfig';
import PropTypes from 'prop-types';

export default class LiveStream extends Component {
    static PropTypes = {
        model: PropTypes.object,
    }

    state = {
        modalOption: {
            title: '编辑',
            visible: false,
            maskClosable: false,
            okText: '确定',
            cancelText: '取消',
            onOk: () => this.handleRecordSubmit(),
            onCancel: () => this.closeModal()
        },
        curRecord: {},
        curLiveRoom: null
    }

    updateCurLiveRoom = (liveRoom) => {
        this.setState({
            curLiveRoom: liveRoom
        });
    }

    changeLiveDesc = (liveDesc) => {
        this.setState({
            curRecord: {
                ...this.state.curRecord,
                liveDesc
            }
        });
    }

    // 过滤string中的数据,将标识字符大小的转换内联模式
    stringChange(string) {
        let number = string.match(/ql-size-(\d+)+/);
        if (number) {
            let newstring = 'style="font-size:' + number[1] + 'px"';
            string = string.replace(/class="ql-size-(\d+)+"/, newstring);
            string = this.stringChange(string);
        }
        return string;
    }

    getMaxSort = () => {
        const { model } = this.props;
        if (model && model.mdata && model.mdata.length) {
            return model.mdata[model.mdata.length - 1].sort;
        } else {
            return -1;
        }
    }

    handleRecordSubmit = () => {
        const form = this.form;
        form.validateFields(async(err, values) => {
            if (err) {
                return console.error(err);
            }
            const { curRecord, curLiveRoom } = this.state;
            curRecord.liveDesc = this.stringChange(curRecord.liveDesc);
            if (curRecord.liveDesc.length > 500) return message.error('直播说明字数超过500字');
            values.liveDesc = curRecord.liveDesc;
            if (!values.liveDesc || !values.liveDesc.replace(/<.*?>/g, '')) return message.error('直播说明不能为空');
            if (curLiveRoom) {
                values.liveRoomId = curLiveRoom.liveRoomId;
            } else {
                values.liveRoomId = curRecord.liveRoomId;
            }

            if (curRecord.id) {
                values.id = curRecord.id;
                await this.props.updateLiveRoom(values);
            } else {
                values.cardId = this.props.model.id;
                values.sort = this.getMaxSort() + 1;
                await this.props.addLiveRoom(values);
            }

            this.closeModal();
            // return
        });
    }

    showModal = (record) => {
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: true
            },
            curRecord: record
        });
    }

    closeModal = (record) => {
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: false
            },
            curRecord: {},
            curLiveRoom: null
        });
        this.form.resetFields();
    }

    render() {
        const { model, hanleLiveStreamSortEnd, saveLiveRoomOrder, updateModel } = this.props;
        const { curRecord, modalOption } = this.state;
        const tableData = model.mdata;

        const listType = [
            { label: '1*1', value: 1 },
        ];
        return (
            <div style={{ overflow: 'hidden' }}>
                <LiveStreamList
                    tableData={tableData}
                    handleEdit={this.showModal}
                    hanleLiveStreamSortEnd={hanleLiveStreamSortEnd}
                    saveLiveRoomOrder={saveLiveRoomOrder}
                    showModal={this.showModal}
                    handleDeleteLiveStreamRecord={this.props.handleDeleteLiveStreamRecord}
                />
                <PlayBackConfig
                    componentType='直播'
                    configData={model}
                    listType={listType}
                    updateModel={updateModel}
                />
                <LiveStreamModal
                    modalOption={modalOption}
                    modalData={curRecord}
                    updateCurLiveRoom={this.updateCurLiveRoom}
                    changeLiveDesc={this.changeLiveDesc}
                    ref={form => { this.form = form; }}
                />
            </div>
        );
    }
}
