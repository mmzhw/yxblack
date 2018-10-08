import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete, Icon, Button, message } from 'antd';
import Upload from '../../../components/Upload/index.js';
import style from './style.module.css';
import yxFetch from '../../../utils/fetch.js';
import debounce from '../../../utils/debounce.js';
import { handleImgUrl } from '../../../utils/util';
import { REQ_URL } from '../../../constants/constants';
import { SUBJECT_MAP } from '../../../constants';

class VideoConfig extends Component {
    constructor(props) {
        super(props);

        const card = props.cards[props.currentCardsIndex];

        this.state = Object.assign({}, props, {
            name: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].name : '',
            subName: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].subName : '',
            imageUrl: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].imageUrl : '',
            videoId: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].videoId : '',
            url: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].url : '',
            extMap: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].extMap : '',
            scale: card ? card.videos[props.currentVideoIndex] && card.videos[props.currentVideoIndex].scale : '',
            source: []
        });
    }

    handleSelect(value) {
        const result = Object.assign([], this.state.source);

        const item = result.filter((_item) => {
            return _item.name === value;
        })[0];

        const imageUrl = this.getImageUrl(item);
        this.setState({
            name: item.name,
            subName: item.subName,
            videoId: item.videoBaseId,
            extMap: item.extMap,
            imageUrl,
        }, () => {
            this.props.handleImgUrlChange.bind(this.props.parent, imageUrl, this.state.name, this.state.subName, this.state.url, this.state.videoId, this.state.extMap, this.state.scale)();
        });
    }

    filterSource(item) {
        return item.name;
    }

    handleNameChange(event) {
        const text = event.target.value;
        if (text.length <= 40) {
            this.setState({
                name: text
            });
        }
    }

    handleSubNameChange(event) {
        const text = event.target.value;
        if (text.length <= 40) {
            this.setState({
                subName: text
            });
        }
    }

    handleURLChange(event) {
        const text = event.target.value;
        this.setState({
            url: text.trim()
        });
    }

    getImageUrl(item) {
        const layoutId = this.state.cards[this.state.currentCardsIndex].layoutId;
        const images = item.images;
        let arr = images;
        switch (layoutId) {
            case 1: // 1
                arr = images.filter(image => image.scale === 1);
                break;
            case 7:
            case 2: // 2 * 2
                arr = images.filter(image => image.scale === 1);
                break;
            case 3: // 3 * 2
                arr = images.filter(image => image.scale === 3);
                break;
            case 4: // 1 + 6
                arr = this.props.currentVideoIndex === 0 ? images.filter(image => image.scale === 1) : images.filter(image => image.scale === 3);
                break;
            case 6:
            case 5: // 1 + 4
                arr = images.filter(image => image.scale === 1);
                break;
            case 8 :
            case 9:
                if (this.props.currentVideoScale === 0) {
                    arr = images.filter(image => image.scale === 0);
                } else if (this.props.currentVideoScale === 1) {
                    arr = images.filter(image => image.scale === 1);
                } else if (this.props.currentVideoScale === 6) {
                    arr = images.filter(image => image.scale === 6);
                }
                break;
            default:
                break;
        }
        return arr[0] ? arr[0].url : '';
    }

    // 防止超出每个模板限制的数目
    cleanData (cards) {
        cards.forEach((card) => {
            let layoutId = Number(card.layoutId);
            card.videos = card.videos.slice(0, SUBJECT_MAP[layoutId]);
        });
        return cards;
    }

    // 单个视频保存
    saveConfig() {
        // 防呆处理
        if (!this.state.name || this.state.name.length === 0) {
            message.error('一级标题不能为空！');
            return;
        }

        if (!this.state.imageUrl) {
            message.error('图片不能为空！');
            return;
        }
        this.props.handleImgUrlChange.bind(this.props.parent, this.state.imageUrl, this.state.name, this.state.subName, this.state.url, this.state.videoId, this.state.extMap, this.state.currentVideoScale)();

        if (this.state.cards[this.state.currentCardsIndex].videos[this.state.currentVideoIndex]) {
            Object.assign(this.state.cards[this.state.currentCardsIndex].videos[this.state.currentVideoIndex], {
                name: this.state.name,
                subName: this.state.subName,
                url: this.state.url,
                imageUrl: this.state.imageUrl,
                scale: this.state.currentVideoScale,
                videoId: this.state.videoId,
                extMap: this.state.extMap,
            });
        } else {
            this.state.cards[this.state.currentCardsIndex].videos.push({
                name: this.state.name,
                subName: this.state.subName,
                url: this.state.url,
                imageUrl: this.state.imageUrl,
                scale: this.state.currentVideoScale,
                videoId: this.state.videoId,
                extMap: this.state.extMap,
            });
        }

        let resultCards = this.cleanData(this.state.cards); // 防止数量超过限定

        yxFetch(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: this.props.parent.channelId,
            version: '1.0.0',
            json: JSON.stringify({
                version: 1,
                timestamp: '',
                cards: resultCards
            })
        }).then((res) => {
            message.info('保存成功！');
        }).catch(() => {
            message.error('保存失败！');
        });
    }

    handleInput(name) {
        this.setState({
            value: name
        });
        yxFetch('back/videoManager/videoCardList', {
            page: 1,
            size: 200,
            name: name,
            status: 2,
            platformsType: [0]
        }).then((res) => {
            if (res.code === 0) {
                this.setState({
                    source: res.data.videoBaseCards
                });
            }
        });
    }

    componentWillReceiveProps(nextProps) { // 更改组件的props从而重新渲染组件
        const cu = nextProps.cards[nextProps.currentCardsIndex].videos[nextProps.currentVideoIndex];
        let scale = nextProps.currentVideoScale;
        this.setState({
            cards: nextProps.cards,
            currentCardsIndex: nextProps.currentCardsIndex,
            currentVideoIndex: nextProps.currentVideoIndex,
            currentVideoScale: nextProps.currentVideoScale,
            name: cu ? cu.name : '',
            subName: cu ? cu.subName : '',
            imageUrl: cu ? cu.imageUrl : '',
            videoId: cu ? cu.videoId : '',
            url: cu ? cu.url : '',
            extMap: cu ? cu.extMap : '',
            scale: scale,
            value: '',
        });
    }

    // 獲取具體比例
    upScaleDate(scale) {
        // (scale 0 rate= 16:9  ,scale 1 rate= 16:9 ,scale 2 rate=4:3, scale 3 rate=3:2（竖）, scale 4 rate 3:2 (横), scale 5 其他, scale 6 rate 11:4 (廣告)
        let scaleDetail = '';
        scale = scale || this.state.currentVideoScale;

        switch (scale) {
            case 0: // 1
                scaleDetail = '16:9';
                break;
            case 1:
                scaleDetail = '16:9';
                break;
            case 2:
                scaleDetail = '4:3';
                break;
            case 3:
                scaleDetail = '2:3';
                break;
            case 4:
                scaleDetail = '3:2';
                break;
            case 6:
                scaleDetail = '11：4';
                break;
            default:
                break;
        }
        return scaleDetail;
    }

    // 圖片尺寸限制
    getVideoSize(scale) {
        let videoWith = 126;
        let videoHeight = 54;
        scale = scale || this.state.currentVideoScale;

        switch (scale) {
            case 0: // 1
                videoWith = 126;
                videoHeight = 54;
                break;
            case 1:
                videoWith = 126;
                videoHeight = 54;
                break;
            case 2:
                videoWith = 120;
                videoHeight = 90;
                break;
            case 3:
                videoWith = 80;
                videoHeight = 120;
                break;
            case 4:
                break;
            case 6:
                videoWith = 110;
                videoHeight = 40;
                break;
            default:
                break;
        }
        return { videoWith: videoWith, videoHeight: videoHeight };
    }

    uploadDone(imgScale, key) {
        this.setState({
            imageUrl: key,
        });
        this.props.handleImgUrlChange.bind(this.props.parent, key, this.state.name, this.state.subName, this.state.url, this.state.videoId, this.state.extMap, this.state.scale)();
    }

    render() {
        const {
            scale,
            // value, // 搜索的name
            // source, // 模糊匹配列表
            cards,
            currentCardsIndex
        } = this.state;

        let videoSize = this.getVideoSize(scale);
        const { layoutId } = cards[currentCardsIndex];
        return (
            <div>
                <div className={style['certain-category-search-wrapper']} style={{ width: 250 }}>
                    <AutoComplete
                        className={style['certain-category-search']}
                        dropdownClassName={style['certain-category-search-dropdown']}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 200 }}
                        size='large'
                        value={this.state.value}
                        style={{ width: 200 }}
                        dataSource={this.state.source.map(this.filterSource)}
                        placeholder='搜索'
                        onChange={debounce(this.handleInput.bind(this), 300)}
                        onSelect={this.handleSelect.bind(this)}
                        optionLabelProp='value'
                    >
                        <Input suffix={<Icon type='search' className={style['certain-category-icon']}/>}/>
                    </AutoComplete>
                </div>
                <div className={style['config']}>
                    <p className={style['config-title']}>一级标题</p>
                    <Input placeholder='一级标题' onChange={this.handleNameChange.bind(this)} value={this.state.name}
                        className={style['config-input']}/>
                </div>
                {
                    (layoutId === 6 || layoutId === 7 || layoutId === 8 || layoutId === 9) &&
                    <div className={style['config']}>
                        <p className={style['config-title']}>二级标题</p>
                        <Input placeholder='二级标题' onChange={this.handleSubNameChange.bind(this)}
                            value={this.state.subName} className={style['config-input']}/>
                    </div>
                }
                <div className={style['config']}>
                    <p className={style['config-title']}>URL</p>
                    <Input placeholder='URL' onChange={this.handleURLChange.bind(this)} value={this.state.url} className={style['config-input']}/>
                </div>
                <div className={style['config-upload']}>
                    <Upload
                        imgScale={scale}
                        figureWidth={videoSize.videoWith}
                        figureHeight={videoSize.videoHeight}
                        uploadDone={this.uploadDone.bind(this)}
                        showImgUrl={handleImgUrl(this.state.imageUrl)}
                    />
                    <p>{this.upScaleDate(scale)}</p>
                </div>
                <Button type='primary' onClick={this.saveConfig.bind(this)} className={style['config-save']}>保存</Button>
            </div>
        );
    }
}

VideoConfig.propTypes = {
    cards: PropTypes.array.isRequired,
    currentCardsIndex: PropTypes.number.isRequired,
    currentVideoIndex: PropTypes.number.isRequired,
    currentVideoScale: PropTypes.number.isRequired,
};

export default VideoConfig;
