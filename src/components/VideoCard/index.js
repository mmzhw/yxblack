import React, { Component } from 'react';
import { Card, Row } from 'antd';
import {
    Link
} from 'react-router-dom';
import { imgPrefix } from '../../utils';
import style from './style.module.css';
import * as urls from '../../constants/urls';

class VideoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceMap: {
                0: { name: '大象', url: require('../../assets/videoSource/daxiang.png') },
                1: { name: '乐视', url: require('../../assets/videoSource/leshi.png') },
                2: { name: '腾讯', url: require('../../assets/videoSource/tengxun.png') },
                3: { name: '爱奇艺', url: require('../../assets/videoSource/aiqiyi.png') },
                4: { name: '优酷', url: require('../../assets/videoSource/youku.png') },
                5: { name: '搜狐', url: require('../../assets/videoSource/souhu.png') },
                6: { name: '风行', url: require('../../assets/videoSource/fengxing.jpg') },
                7: { name: '新浪', url: require('../../assets/videoSource/xinlang.jpeg') },
                8: { name: '土豆', url: require('../../assets/videoSource/tudou.jpeg') },
                9: { name: '哔哩', url: require('../../assets/videoSource/bili.jpeg') },
                10: { name: '弹幕', url: require('../../assets/videoSource/danmu.jpeg') },
                11: { name: '芒果TV', url: require('../../assets/videoSource/mangguo.png') },
                12: { name: 'PPTV', url: require('../../assets/videoSource/pptv.png') },
                13: { name: '华数TV', url: require('../../assets/videoSource/huashu.png') },
                99: { name: '其他', url: require('../../assets/videoSource/daxiang.png') },
            },
        };
        this.genCover = this.genCover.bind(this);
    }

    componentWillReceiveProps(newProps) {
    }

    genCover(imageList) {
        if (!imageList || imageList.length === 0) {
            return require('../../assets/none.png');
        }
        let imgObj = imageList.find(image => image.scale === 3) || imageList[0];
        return imgPrefix + imgObj.url;
    }
    render() {
        return (
            <Row>
                {this.props.list.map((item) =>
                    <Link to={`${urls.VIDEO_LIST}/VideoDetail/${item.videoBaseId}`} key={item.videoBaseId} className={style.card}>
                        <Card className={style['card-item']} bodyStyle={{ padding: 0, position: 'relative' }}>
                            {item.status === 2 ? (
                                <span className={style['status']}>已上架</span>
                            ) : ''}
                            {item.incrEpisodeCount ? (
                                <span className={style['has-episode']}>有新的剧集</span>
                            ) : ''}
                            {item.incrSourceCount && !item.incrEpisodeCount ? (
                                <span className={style['has-sourcecount']}>有新的播放源</span>
                            ) : ''}
                            <div className={style['card-img']}>
                                <img src={this.genCover(item.images)} alt='' />
                            </div>
                            <div className={style.footer}>
                                <h3 className={style.name}>{item.name}</h3>
                                <h3 className={style.subName}>{item['sub-name']}</h3>
                                <div className={style['source-list']}>
                                    {item.platforms.length > 0 ? (
                                        <div>
                                            <span>播放源</span>
                                            {item.platforms.map((p) =>
                                                <img key={p} className={style['source']} src={this.state.sourceMap[p].url} alt={this.state.sourceMap[p].name} />
                                            )}
                                        </div>
                                    ) : ''}
                                </div>
                            </div>
                        </Card>
                    </Link>
                )}
            </Row>
        );
    }
}

export default VideoCard;

