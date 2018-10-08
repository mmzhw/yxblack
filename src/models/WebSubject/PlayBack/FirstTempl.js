import React, { Component } from 'react';
import { Select, message, Button, Form } from 'antd';
import fetcher from '../../../utils/fetch';
import _ from 'lodash';
import Editor from '../../../components/Editor';
import style from './style.module.css';
import { REQ_URL } from '../../../constants/constants';

const FormItem = Form.Item;
const Option = Select.Option;

export default class FirstTempl extends Component {
    state = {
        videoList: [],
        words: this.props.words,
    }

    searchVideos = _.debounce(async(words) => {
        let values = {
            page: 1,
            size: 200
        };
        values = {
            ...values,
            name: words,
            status: 2
        };
        this.setState({
            words
        });
        if (!words) {
            this.props.updateFirstTemplVideo(null);
        }
        const res = await fetcher(REQ_URL.SEARCH_VIDEO_LISTS, values);
        if (res.code === 0) {
            let videoList = res.data && res.data.videoBaseCards;
            this.setState({
                videoList: videoList
            });
        } else {
            message.error(res.errmsg);
        }
    }, 500)

    handleSelectChange = (value, option) => {
        const { videoList } = this.state;
        const video = videoList.find(video => video.name === value);
        this.setState({
            words: video.name
        });
        this.props.updateFirstTemplVideo(video);
    }

    handleTextChange = (text) => {
        this.props.updateFirstTemplText(text);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.words !== this.props.words) {
            this.setState({
                words: nextProps.words
            });
        }
    }

    render() {
        const { videoList, words } = this.state;
        const { text, addFirstTemplVideo } = this.props;
        return (
            <div style={{ padding: '10px', border: '1px solid #DDD' }}>
                <FormItem
                    label='关联视频'
                >
                    <Select
                        mode='combobox'
                        style={{ width: 400 }}
                        notFoundContent=''
                        onSearch={this.searchVideos}
                        onSelect={this.handleSelectChange}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        placeholder='支持标题搜索'
                        value={words}
                    >
                        {
                            videoList && videoList.map((video, index) => {
                                return (
                                    <Option
                                        key={index}
                                        value={video.name}
                                    >
                                        {video.name}
                                    </Option>
                                );
                            })
                        }
                    </Select>
                </FormItem>
                <FormItem
                    label='点播简介'
                >
                    <Editor
                        value={text}
                        onChange={this.handleTextChange}
                    />
                </FormItem>
                <Button type='primary' onClick={addFirstTemplVideo} style={{ marginTop: '0' }} className={style['area-btn']}>保存</Button>
            </div>
        );
    }
}
