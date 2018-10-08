import React, { Component } from 'react';
import yxFetch from '../../utils/fetch';
import YXVideojs from '../../components/Video/video.js';
import { handleImgUrl } from '../../../src/utils/util';
import { Form, Input, Button, message, Menu, Dropdown, Icon, Modal } from 'antd';
import style from './index.module.css';
import { specialNameHandle } from './util';
import { REQ_URL } from '../../constants/constants';

const FormItem = Form.Item;
const { TextArea } = Input;
const contnetIds = ['playUrl', 'id', 'uid', 'status', 'avatar', 'nickName', 'title', 'duration', 'playCount', 'likeCount', 'commentCount', 'shareCount', 'address', 'tags', 'ip', 'playCountTotal', 'gmtCreated', 'gmtModified', 'showStatus', 'showType', 'auditStatus', 'status', 'unPassReason'];
const contnetNames = ['视频', '短视频id', '用户id', '状态', '头像', '昵称', '标题', '时长', '当日播放次数', '点赞数', '评论数', '分享数', '上传者地址', '视频标签', '上传者ip', '播放总量', '创建时间', '修改时间', '是否在有象故事', '展示位置', '审核是否通过', '状态', '审核未通过原因'];

class UserVideoDetailCompent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: props.match.match.params.id,
            videoSources: '',
            poster: '',
            id: '',
            visible: false, // 审核失败弹框是否显示
            confirmLoading: false, // 审核失败loading是否显示
            videoVisable: false, // 视频框是否显示
            commentVisible: false, // 推荐框是否显示
        };
        this.auditStatus = '';// 审核结果
        this.unPassReason = '';// 审核不通过原因
        this.showType = ''; // 推荐位置
        this.showStatus = ''; // 是否推荐
        this.avatar = ''; // 头像
        this.fetchUserVideos();
    }

    async fetchUserVideos() {
        let res = await yxFetch(REQ_URL.VIDEO_GET_SHORT_DETAIL, {
            id: this.state.videoId
        });
        if (res.code === 0) {
            this.setState({
                videoSources: [{
                    src: res.data.playUrl,
                }],
                poster: handleImgUrl(res.data.picUrl),
            });
            this.id = res.data.id;

            contnetIds.forEach((key) => {
                if (key === 'avatar' || key === 'playUrl') {
                    this.setState({
                        avatar: specialNameHandle(key, res.data[key]),
                        videoBG: specialNameHandle('picUrl', res.data.picUrl),
                    });
                } else {
                    this.props.form.setFields({ [key]: { value: specialNameHandle(key, res.data[key]) }});
                }
            });
        } else {
            message.error('获取视频信息失败');
        }
    }

    async cancelCommentClick() {
        this.showStatus = 0;
        let data = {
            type: this.showStatus,
            ids: [this.id]
        };
        let res = await yxFetch(REQ_URL.VIDEO_RECOMMOND, data);
        if (res.code === 0) {
            this.props.form.setFields({
                showStatus: { value: specialNameHandle('showStatus', this.showStatus) },
            });
            this.setState({
                commentVisible: false,
            });
            message.success('仅审核通过，不推荐');
        } else {
            this.setState({
                commentVisible: false,
            });
            message.error('取消失败');
        }
    }

    async commentClick(state) {
        this.showStatus = 1;
        this.showType = Number(state);
        let data = {
            type: this.showStatus,
            showType: this.showType,
            ids: [this.id]
        };
        let res = await yxFetch(REQ_URL.VIDEO_RECOMMOND, data);
        if (res.code === 0) {
            this.props.form.setFields({
                showStatus: { value: specialNameHandle('showStatus', this.showStatus) },
                showType: { value: specialNameHandle('showType', this.showType) },
            });
            this.setState({
                commentVisible: false,
            });
            message.success('推荐完成');
        } else {
            this.setState({
                commentVisible: false,
            });
            message.error('推荐失败');
        }
    }

    async revieweClick(state) {
        let reason = '';
        if (this.refs.unPassReason) {
            reason = this.refs.unPassReason.value;
        }
        if (!state && !reason) {
            message.warn('请输入审核失败原因');
            return;
        }
        this.auditStatus = Number(state);
        this.unPassReason = reason;
        let data = {
            type: this.auditStatus,
            list: [{
                id: this.id,
                unPassReason: this.unPassReason
            }]
        };

        let res = await yxFetch(REQ_URL.VIDEO_CHECK, data);
        if (res.code === 0) {
            this.props.form.setFields({
                auditStatus: { value: specialNameHandle('auditStatus', this.auditStatus) },
                unPassReason: { value: this.auditStatus === 2 ? specialNameHandle('unPassReason', this.unPassReason) : '' },
            });
            this.setState({
                visible: false, // 审核失败隐藏框
                confirmLoading: false, // 审核失败loading取消
            });
            if (this.auditStatus === 1) { // 审核通过弹出推荐
                this.setState({
                    commentVisible: true,
                });
            }
            message.success('审核完成');
        } else {
            this.setState({
                confirmLoading: false, // 审核失败loading取消
            });
            message.error('审核失败');
        }
    }

    // 审核失败相关操作
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        this.revieweClick(2);
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    videoCancel = () => {
        this.setState({
            videoVisable: false,
        });
    }
    showVideoModal = () => {
        this.setState({
            videoVisable: true,
        });
    }

    // 审核失败相关操作

    render() {
        let self = this;
        const formMethods = this.props.form;
        const { getFieldDecorator } = formMethods;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 8 },
        };
        const menu = (
            <Menu onClick={
                (event) => {
                    self.commentClick(event.key);
                }
            }>
                <Menu.Item key={2}>置顶</Menu.Item>
                <Menu.Item key={1}>首页</Menu.Item>
                <Menu.Item key={0}>普通</Menu.Item>
            </Menu>
        );
        return (
            <div>
                <div className={style['videoDetail']}>
                    <div className={style['videoDetailRight']}>
                        <Form onSubmit={this.handleSubmit}>
                            {
                                contnetIds.map((name, index) => {
                                    if (name === 'avatar') {
                                        return (<FormItem
                                            {...formItemLayout}
                                            key={index}
                                            label={contnetNames[index]}
                                        >
                                            <img alt='' src={this.state.avatar} width='100'/>
                                        </FormItem>);
                                    } else if (name === 'playUrl') {
                                        return (<FormItem
                                            {...formItemLayout}
                                            key={index}
                                            label={contnetNames[index]}
                                        >
                                            <a onClick={this.showVideoModal.bind(this)}
                                                style={{ position: 'relative', display: 'block', width: '100px' }}>
                                                <Icon type='caret-right' style={{
                                                    position: 'absolute',
                                                    fontSize: '50px',
                                                    color: '#fff',
                                                    left: '50%',
                                                    top: '50%',
                                                    marginTop: '-25px',
                                                    marginLeft: '-25px',
                                                }}/>
                                                <img alt='' src={this.state.videoBG} width='100'/>
                                            </a>
                                            <Modal
                                                visible={this.state.videoVisable}
                                                title='视频预览'
                                                width={832}
                                                onCancel={this.videoCancel}
                                                footer={null}
                                                destroyOnClose={true}
                                            >
                                                <YXVideojs
                                                    sources={this.state.videoSources}
                                                    pause={this.state.videoVisable}
                                                    poster={this.state.poster}
                                                    autoplay={true}
                                                    width={800}
                                                />
                                            </Modal>
                                        </FormItem>);
                                    } else {
                                        return (<FormItem
                                            {...formItemLayout}
                                            key={index}
                                            label={contnetNames[index]}
                                        >
                                            {getFieldDecorator(name)(
                                                <Input disabled={true}/>
                                            )}
                                        </FormItem>);
                                    }
                                })
                            }

                        </Form>
                    </div>
                </div>
                <div className={style['videoDetailControl']}>
                    <div className={style['videoOperationLeft']}><span>操作：</span></div>
                    <Button onClick={this.revieweClick.bind(this, 1)} type='primary'>审核通过</Button>
                    <Modal
                        title='推荐'
                        visible={this.state.commentVisible}
                        closable={false}
                        width={350}
                        footer={[
                            <Button className={style['right']} onClick={this.cancelCommentClick.bind(this, 0)}>不推荐</Button>,
                            <Dropdown overlay={menu}>
                                <Button type='primary'>
                                    推荐 <Icon type='down'/>
                                </Button>
                            </Dropdown>
                        ]}
                    >
                        <p>推荐到APP“活动”中的“有象故事”展示，注意仅限选择一种状态：</p>
                        <p>1、置顶：在“有象故事”的第一条位置</p>
                        <p>2、首页：在“有象故事”的前六条位置</p>
                        <p>3、普通：在“有象故事”前六条以外的位置</p>
                    </Modal>
                    <Button onClick={this.showModal}>审核不通过</Button>
                    <Modal title='审核不通过原因'
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                    >
                        <TextArea ref='unPassReason' rows={4}/>
                    </Modal>

                </div>
            </div>

        );
    }
}

const UserVideoDetail = Form.create()(UserVideoDetailCompent);

export default UserVideoDetail;
