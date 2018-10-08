// 直播间配置
import React, { Component } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';
import Editor from '../../../components/Editor';
import fetcher from '../../../utils/fetch';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { REQ_URL } from '../../../constants/constants';

// const { TextArea } = Input

const FormItem = Form.Item;
const Option = Select.Option;

class LiveStreamConfig extends Component {
    static PropTypes = {
        modalOption: PropTypes.object,
        modalData: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            words: '',
            liveRoomList: [],
        };
    }

    handleSelectChange = (value, option) => {
        const { liveRoomList } = this.state;
        const liveRoom = liveRoomList.find(liveRoom => liveRoom.title === value);
        this.props.updateCurLiveRoom(liveRoom);
    }

    searchRoom = _.debounce(async(words) => {
        let values = {
            page: 1,
            size: 30
        };
        // if(/^\d\d*\d$/.test(words)){
        //   values = {
        //     ...values,
        //     title: words
        //   }
        // } else {
        //   values = {
        //     ...values,
        //     liveRoomId: words
        //   }
        // }
        values = {
            ...values,
            title: words
        };
        const res = await fetcher(REQ_URL.LIST_LIVEROOM, values);
        if (res.code === 0) {
            let liveRoomList = res.data && res.data.liveRoomList;
            this.setState({
                liveRoomList: liveRoomList
            });
        } else {
            message.error(res.errmsg);
        }
    }, 500)

    getCurLiveRoom = () => {
        const { words, liveRoomList } = this.state;
        const { modalData } = this.props;
        if (words === '') {
            return modalData;
        }
        return liveRoomList.find(liveRoom => {
            return liveRoom.liveRoomId === words;
        });
    }

    // componentWillReceiveProps(nextProps){
    //   if(nextProps.modalData !== this.props.modalData){
    //     this.setState({
    //       words: nextProps.modalData.title
    //     })
    //   }
    // }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { modalOption, modalData, changeLiveDesc } = this.props;
        const { liveRoomList } = this.state;
        // const curLiveRoom = this.getCurLiveRoom()
        // liveRoomList.forEach((liveRoom, index) => {
        //   console.log(liveRoom.liveRoomId + liveRoom.title, '  ' + index)
        // })
        return (
            <Modal
                {...modalOption}
            >
                <Form>
                    <FormItem label='关联房间'>
                        {getFieldDecorator('liveRoomId',
                            {
                                initialValue: (modalData && modalData.title) ? modalData.title : '',
                                rules: [{ required: true, message: '必填项' }],
                            })(
                            <Select
                                mode='combobox'
                                notFoundContent=''
                                onSearch={this.searchRoom}
                                onSelect={this.handleSelectChange}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                placeholder='支持标题搜索'
                            >
                                {
                                    liveRoomList.map((liveRoom, index) => {
                                        return (
                                            <Option
                                                key={liveRoom.liveRoomId}
                                                value={liveRoom.title}
                                            >
                                                {liveRoom.title}
                                            </Option>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='房间标题'>
                        {getFieldDecorator('name', { initialValue: modalData && modalData.name, rules: [{ required: true, message: '必填项' }, { max: 10, message: '不能超过10个字' }] })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem label='直播说明' required>
                        <Editor value={modalData && modalData.liveDesc ? modalData.liveDesc : ''} onChange={changeLiveDesc}/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(LiveStreamConfig);

