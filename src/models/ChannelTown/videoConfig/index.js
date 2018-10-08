import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete, Icon, Button, message } from 'antd';
import Upload from '../../../components/Upload/index.js';
import style from './style.module.css';
import yxFetch from '../../../utils/fetch.js';
import debounce from '../../../utils/debounce.js';
import * as utils from '../../../utils/util.js';
import { REQ_URL } from '../../../constants/constants';
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
    // 真的不敢动这块代码了。。。
    componentWillReceiveProps(nextProps) { // 更改组件的props从而重新渲染组件
        const cu = nextProps.cards[nextProps.currentCardsIndex].videos[nextProps.currentVideoIndex];
        this.setState({
            cards: nextProps.cards,
            currentCardsIndex: nextProps.currentCardsIndex,
            currentVideoIndex: nextProps.currentVideoIndex,
            name: cu && cu.name,
            subName: cu && cu.subName,
            imageUrl: cu && cu.imageUrl,
            videoId: cu && cu.videoId,
            url: cu && cu.url,
            extMap: cu && cu.extMap,
            scale: cu && cu.scale,
            value: '',
        });
    }
    // 过滤
    filterSource = (item) => {
        return item.name;
    }
    // 模糊搜索
    handleInput = (name) => {
        this.setState({
            value: name
        });
        yxFetch('back/videoManager/videoCardList', {
            page: 1,
            size: 200,
            name: name,
            status: 2,
            platformsType: [0] // 有象平台
        }).then((res) => {
            if (Number(res.code) === 0) {
                this.setState({
                    source: res.data.videoBaseCards
                });
            } else {
                message.error(res.errmsg);
            }
        }).catch(e => message.error(e.message || e));
    }
    // 选择视频
    handleSelect = (value) => {
        const { source } = this.state;
        const item = source.filter((_item) => {
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
            this.props.handleImgUrlChange(imageUrl, this.state.name, this.state.subName, this.state.url, this.state.videoId, this.state.extMap, this.state.scale);
        });
    }
    // 改变一级标题
    handleNameChange = (event) => {
        const text = event.target.value;
        if (text.length <= 40) {
            this.setState({
                name: text
            });
        }
    }
    // 改变二级标题
    handleSubNameChange = (event) => {
        const text = event.target.value;
        if (text.length <= 40) {
            this.setState({
                subName: text
            });
        }
    }
    // 改变URL
    handleURLChange = (event) => {
        const text = event.target.value;
        this.setState({
            url: text.trim()
        });
    }
    // 获取 ImageUrl
    getImageUrl = (item) => {
        const layoutId = this.state.cards[this.state.currentCardsIndex].layoutId;
        const images = item.images;
        let arr;
        // scale 1 rate= 16:9
        // scale 2 rate=4:3
        // scale 3 rate=3:2（竖）
        // scale 4 rate 3:2 (横)
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
            default:
                break;
        }
        return arr[0] ? arr[0].url : '';
    }
    cleanData = (cards) => {
        cards.map((card) => {
            switch (Number(card.layoutId)) {
                case 1:
                    card.videos = card.videos.slice(0, 1);
                    break;
                case 2:
                case 7:
                    card.videos = card.videos.slice(0, 4);
                    break;
                case 3:
                    card.videos = card.videos.slice(0, 6);
                    break;
                case 4:
                    card.videos = card.videos.slice(0, 7);
                    break;
                case 5:
                case 6:
                    card.videos = card.videos.slice(0, 5);
                    break;
                default:
                    break;
            }
            return card;
        });
        return cards;
    }
    saveConfig = () => {
        if (this.state.name.length === 0) {
            message.error('一级标题不能为空！');
            return;
        }
        this.props.handleImgUrlChange(this.state.imageUrl, this.state.name, this.state.subName, this.state.url, this.state.videoId, this.state.extMap, this.state.scale);

        if (this.state.cards[this.state.currentCardsIndex].videos[this.state.currentVideoIndex]) {
            Object.assign(this.state.cards[this.state.currentCardsIndex].videos[this.state.currentVideoIndex], {
                name: this.state.name,
                subName: this.state.subName,
                url: this.state.url,
                imageUrl: this.state.imageUrl,
                scale: this.state.scale,
                videoId: this.state.videoId,
                extMap: this.state.extMap,
            });
        } else {
            this.state.cards[this.state.currentCardsIndex].videos.push({
                name: this.state.name,
                subName: this.state.subName,
                url: this.state.url,
                imageUrl: this.state.imageUrl,
                scale: this.state.scale,
                videoId: this.state.videoId,
                extMap: this.state.extMap,
            });
        }

        let resultCards = this.cleanData(this.state.cards); // 防止数量超过限定

        yxFetch(REQ_URL.UPDATE_MOBILE_LEGO, {
            channelId: this.props.channelId,
            version: '1.0.0',
            json: JSON.stringify({
                version: 1,
                timestamp: '',
                cards: resultCards
            })
        }).then((res) => {
            message.info('保存成功！');
            this.props.getChannelList(this.props.channelId);
        }).catch(() => {
            message.error('保存失败！');
        });
    }
    uploadDone = (imgScale, key) => {
        this.setState({
            imageUrl: key,
        });
        this.props.handleImgUrlChange(key, this.state.name, this.state.subName, this.state.url, this.state.videoId, this.state.extMap, this.state.scale);
    }
    render() {
        const {
            scale,
            value, // 搜索的name
            source, // 模糊匹配列表
            cards,
            currentCardsIndex
        } = this.state;
        const { layoutId } = cards[currentCardsIndex];
        return (
            <div>
                <div
                    className={style['certain-category-search-wrapper']}
                    style={{ width: 250 }}
                >
                    <AutoComplete
                        className={style['certain-category-search']}
                        dropdownClassName={style['certain-category-search-dropdown']}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ width: 200 }}
                        size='large'
                        value={value}
                        style={{ width: 200 }}
                        dataSource={source.map(this.filterSource)}
                        placeholder='搜索'
                        onChange={debounce(this.handleInput, 300)}
                        onSelect={this.handleSelect}
                        optionLabelProp='value'
                    >
                        <Input
                            suffix={<Icon type='search' className={style['certain-category-icon']} />}
                        />
                    </AutoComplete>
                </div>
                <div className={style['config']}>
                    <p className={style['config-title']}>一级标题</p>
                    <Input
                        className={style['config-input']}
                        value={this.state.name}
                        placeholder='一级标题'
                        onChange={this.handleNameChange}
                    />
                </div>
                {
                    (layoutId === 6 || layoutId === 7) &&
          <div className={style['config']}>
              <p className={style['config-title']}>二级标题</p>
              <Input
                  className={style['config-input']}
                  value={this.state.subName}
                  placeholder='二级标题'
                  onChange={this.handleSubNameChange}
              />
          </div>
                }
                <div className={style['config']}>
                    <p className={style['config-title']}>URL</p>
                    <Input
                        className={style['config-input']}
                        value={this.state.url}
                        placeholder='URL'
                        onChange={this.handleURLChange}
                    />
                </div>
                <div className={style['config-upload']}>
                    <Upload
                        imgScale={scale}
                        figureWidth={ scale === 1 ? 126 : 80 }
                        figureHeight={ scale === 1 ? 54 : 120}
                        uploadDone={this.uploadDone}
                        showImgUrl={utils.handleImgUrl(this.state.imageUrl)}
                    />
                    <p>{ scale === 1 ? '16 : 9' : '2 : 3'}</p>
                </div>
                <Button
                    className={style['config-save']}
                    type='primary'
                    onClick={this.saveConfig}
                >
          保存
                </Button>
            </div>
        );
    }
}

VideoConfig.propTypes = {
    cards: PropTypes.array.isRequired,
    currentCardsIndex: PropTypes.number.isRequired,
    currentVideoIndex: PropTypes.number.isRequired,
};

export default VideoConfig;
