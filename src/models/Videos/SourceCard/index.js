import React, { Component } from 'react';
import { Card, Button, Modal, Select, message } from 'antd';
import PSrcItem from '../subdetail/PSrcItem';
import style from './style.module.css';
import yxFetch from '../../../utils/fetch';
import { videoPrefix } from '../../../utils';
const Option = Select.Option;
const bodyStyle = {
    padding: '10px'
};
message.config({
    top: 100,
    duration: 2,
});
const success = (content) => {
    message.success(content);
};
// const error = (content) => {
//   message.error(content)
// }
const warning = (content) => {
    message.warning(content);
};
class SourceCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flagAddSource: this.props.flagAddSource,
            flag: this.props.flag,
            videoOrigin: {},
            videoBaseId: this.props.videoBaseId,
            videoDetailId: this.props.oldvideoDetailId,
            // videoDetailId: '',
            // typeList: [],
            add: 'back/video/source/add',
            sourceList: 'back/video/source/sourceList',
            putaway: 'back/videoManager/putVideoOnShelf',
            putoff: 'back/videoManager/putVideoOffShelf',
            // videoBaseInfo: 'back/videoManager/nets/videoBaseInfo',
            imgurl: '',
            url: '',
            urlReplace: '',
            name: '',
            Sname: '',
            visible: false,
            displayAddSource: 'inline-block',
            disabledLeshi: false,
            disabledDaxiang: false,
            addSource: [
                // {
                //   playSource: 'http://wwww.youku.com',
                //   sourceName: '优酷',
                //   videoOrigin: ''，
                //   imgurl: ''
                // },
                // {
                //   playSource: 'http://www.iqiyi.com/',
                //   sourceName: '爱奇艺'
                // }
            ],
            sourceMap: {
                0: { name: '大象', url: require('../../../assets/videoSource/daxiang.png') },
                1: { name: '乐视', url: require('../../../assets/videoSource/leshi.png') },
                2: { name: '腾讯', url: require('../../../assets/videoSource/tengxun.png') },
                3: { name: '爱奇艺', url: require('../../../assets/videoSource/aiqiyi.png') },
                4: { name: '优酷', url: require('../../../assets/videoSource/youku.png') },
                5: { name: '搜狐', url: require('../../../assets/videoSource/souhu.png') },
                6: { name: '风行', url: require('../../../assets/videoSource/fengxing.jpg') },
                7: { name: '新浪', url: require('../../../assets/videoSource/xinlang.jpeg') },
                8: { name: '土豆', url: require('../../../assets/videoSource/tudou.jpeg') },
                9: { name: '哔哩', url: require('../../../assets/videoSource/bili.jpeg') },
                10: { name: '弹幕', url: require('../../../assets/videoSource/danmu.jpeg') },
                11: { name: '芒果TV', url: require('../../../assets/videoSource/mangguo.png') },
                12: { name: 'PPTV', url: require('../../../assets/videoSource/pptv.png') },
                13: { name: '华数TV', url: require('../../../assets/videoSource/huashu.png') },
                99: { name: '其他', url: require('../../../assets/videoSource/daxiang.png') },
            },
            date: new Date(),
        };
    }
    componentWillReceiveProps(nextProps) {
        // console.log(this.state.videoDetailId, nextProps.oldvideoDetailId)
        if (this.state.videoDetailId !== nextProps.oldvideoDetailId && this.state.videoDetailId !== undefined) {
            this.setState({
                videoDetailId: nextProps.oldvideoDetailId,
                addSource: [],
                typeList: []
            }, this.fetchSourceList);
        }
        if (this.state.flag !== nextProps.flag && this.state.flag !== undefined) {
            this.setState({
                flag: nextProps.flag,
                videoDetailId: nextProps.oldvideoDetailId,
            }, this.fetchSourceList);
        }
        if (this.state.flagAddSource !== nextProps.flagAddSource) {
            this.setState({
                flagAddSource: nextProps.flagAddSource
            }, this.judgeSource);
        }
    }
    componentDidMount() {
    // this.fetchVideoDetail()
        if (this.state.videoDetailId) {
            this.fetchSourceList();
        }
    }
    show() {
        this.setState({ 'visible': true });
        setTimeout(function() {
            this.refs.changeurl.focus();
        }.bind(this), 500);
    }
    hidden() {
        this.refs.changeurl.value = '';
        this.setState({ 'visible': false });
    }
    handleChange(value) {
        this.setState({
            name: value
        });
    }
    handleChangeUrl(event) {
        this.setState({
            urlReplace: event.target.value
        });
    }
    // 获得videoDetail
    // fetchVideoDetail() {
    //   yxFetch(this.state.videoBaseInfo, {
    //     videoBaseId: this.state.video.videoBaseId
    //   }).then(res => {
    //     console.log('success')
    //     this.setState({
    //       videoDetailId: res.data.vVideoDetailRspVos[0].videoDetailId
    //     })
    //     console.log(res.data.vVideoDetailRspVos)
    //   }).catch(() => {
    //     console.log('error!')
    //   })
    // }
    // 获得源
    fetchSourceList() {
        this.setState({
            addSource: [],
            displayAddSource: 'inline-block',
        });
        if (this.state.videoDetailId) {
            yxFetch(this.state.sourceList, {
                videoDetailId: this.state.videoDetailId
            }).then(res => {
                var newArray = this.state.addSource.slice();
                // var newArray1 = this.state.typeList.slice()
                for (var i = 0; i < res.data.length; i++) {
                    // newArray1.push(res.data[i].videoSource)
                    if (res.data[i].videoSource !== 0) {
                        this.setState({
                            Sname: this.state.sourceMap[res.data[i].videoSource].name,
                            videoOrigin: res.data[i],
                            imgurl: this.state.sourceMap[res.data[i].videoSource].url,
                        });
                        newArray.push({
                            playSource: res.data[i].videoSourceUrl,
                            sourceName: this.state.Sname,
                            videoOrigin: this.state.videoOrigin,
                            imgurl: this.state.imgurl,
                        });
                    }
                    if (res.data[i].videoSource === 0) {
                        this.setState({
                            Sname: '大象',
                            videoOrigin: res.data[i]
                        });
                        newArray.push({
                            playSource: videoPrefix + res.data[i].videoResource.m3u8Clarity.url,
                            sourceName: this.state.Sname,
                            videoOrigin: this.state.videoOrigin,
                            imgurl: this.state.sourceMap[0].url,
                        });
                    }
                }
                this.setState({
                    addSource: newArray,
                    // typeList: newArray1
                });
                // console.log('sources', newArray);
                // this.judgeSourceType()
            }).catch(() => {
            });
        } else {
            this.judgeSource();
        }
    }
    // 判断播放源类型，是否显示新增以及新增类型
    // judgeSourceType() {
    //   if (this.state.typeList.length === 2) {
    //     this.setState({
    //       displayAddSource: 'none'
    //     })
    //   }
    //   for (var i = 0; i < this.state.typeList.length; i++) {
    //     if (this.state.typeList[i] === 1) {
    //       this.setState({
    //         disabledLeshi: true
    //       })
    //     }
    //     if (this.state.typeList[i] === 0) {
    //       this.setState({
    //         disabledDaxiang: true
    //       })
    //     }
    //   }
    // }
    judgeSource() {
        this.setState({
            displayAddSource: 'none'
        });
    }
    // 添加播放源
    openAddSourceDialog() {
        this.hidden();
        if (this.state.urlReplace) {
            yxFetch(this.state.add, {
                videoSource: this.state.name,
                videoSourceUrl: this.state.urlReplace.trim(),
                videoBaseId: this.state.videoBaseId,
                videoDetailId: this.state.videoDetailId
            }).then(res => {
                if (res.code === 0) {
                    success('新增成功！');
                    this.setState({
                        addSource: []
                    });
                    this.fetchSourceList();
                } else {
                    warning(res.errmsg);
                }
            }).catch((e) => {
            });
        } else {
            warning('字段为空！');
        }
    }
    render() {
        return (
            <div>
                { /* 播放源 */ }
                <Card className={style.card} bodyStyle={bodyStyle}>
                    <h3>播放源</h3>
                    <div>
                        {
                            this.state.addSource.map(function(item, i) {
                                // console.log('videoSource item', item);
                                return (
                                    <PSrcItem
                                        key={i}
                                        videoBaseId={this.state.videoBaseId}
                                        upsource={this.fetchSourceList.bind(this)}
                                        update={this.props.update}
                                        videoOrigin = {item.videoOrigin}
                                        playSource = {item.playSource}
                                        sourceName = {item.sourceName}
                                        imgurl = {item.imgurl} />
                                );
                            }.bind(this))
                        }
                    </div>
                    <Button type = 'primary' style = {{ 'display': this.state.displayAddSource }} onClick = {this.show.bind(this)} >新增播放源</Button>
                </Card>
                <div>
                    <Modal visible={this.state.visible} width={300} title='新增源' maskClosable='true' style={{ 'marginTop': '280px' }} onCancel={this.hidden.bind(this)} onOk={this.openAddSourceDialog.bind(this)} >
                        <span>平台</span>
                        <br />
                        <Select onChange={this.handleChange.bind(this)} className={style.select} defaultValue='请选择平台' style={{ width: 270 }} allowClear >
                            <Option disabled = {this.state.disabledLeshi} value='1'>乐视</Option>
                            <Option value='2'>腾讯</Option>
                            <Option value='3'>爱奇艺</Option>
                            <Option value='4'>优酷</Option>
                            <Option value='5'>搜狐</Option>
                            <Option value='6'>风行</Option>
                            <Option value='7'>新浪</Option>
                            <Option value='8'>土豆</Option>
                            <Option value='9'>哔哩</Option>
                            <Option value='10'>弹幕</Option>
                            <Option value='11'>芒果TV</Option>
                            <Option value='12'>PPTV</Option>
                            <Option value='13'>华数TV</Option>
                            <Option value='99'>其他</Option>
                        </Select>
                        <hr />
                        <br />
                        <input ref='changeurl' onChange={this.handleChangeUrl.bind(this)} className={style.input} type='text' placeholder='请输入源地址' ></input>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default SourceCard;
