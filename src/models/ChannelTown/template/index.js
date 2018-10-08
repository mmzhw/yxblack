import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from '../../ChannelAppDetail/template/style.module.css';
import * as utils from '../../../utils/util';
class Template extends Component {
    handleVideoClick = (index) => {
        this.props.configVideosDetail(index);
    }
    render() {
        const card = this.state.cards[this.state.currentCardsIndex];
        const layoutList2 = [0, 1, 2, 3];
        const layoutList3 = [0, 1, 2, 3, 4, 5];
        const layoutList4 = [1, 2, 3, 4, 5, 6];
        const layoutList5 = [0, 1, 2, 3, 4];
        const layoutList9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 模版G
        const layoutList8 = [0, 1, 2, 3, 4, 5, 6]; // 模版F
        let layout = null;
        if (card.layoutId === 1) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout1']}`}>
                    <img
                        alt=''
                        src={card.videos[0] && utils.handleImgUrl(card.videos[0].imageUrl)}
                        onClick={this.handleVideoClick.bind(this, 0, 1)}
                    />
                    {
                        card.videos[0] &&
                        card.videos[0].extMap &&
                        card.videos[0].extMap.updateEpisode &&
                        <span className={style['updateEpisode']}>{card.videos[0].extMap.updateEpisode}</span>
                    }
                    {
                        card.videos[0] &&
                        card.videos[0].extMap &&
                        card.videos[0].extMap.clarity &&
                        <span className={style['clarity']}>{card.videos[0].extMap.clarity}</span>
                    }
                    {
                        card.videos[0] &&
                        card.videos[0].extMap &&
                        card.videos[0].extMap.sign &&
                        <span className={style['sign']}>{card.videos[0].extMap.sign}</span>
                    }
                    <div className={style['overflow']}>{card.videos[0] ? card.videos[0].name : ''}</div>
                    <div className={style['overflow']}>{card.videos[0] ? card.videos[0].subName : ''}</div>
                </div>
            );
        } else if (card.layoutId === 2 || card.layoutId === 7) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout2']}`}>
                    <ul>
                        {
                            layoutList2.map((value, i) => {
                                return (
                                    <li key={i} onClick={this.handleVideoClick.bind(this, value, 1)}
                                        className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}>
                                        <img
                                            alt=''
                                            src={card.videos[value] ? utils.handleImgUrl(card.videos[value].imageUrl) : ''}
                                        />
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.updateEpisode &&
                                            <span className={style['updateEpisode']}>{card.videos[value].extMap.updateEpisode}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.clarity &&
                                            <span className={style['clarity']}>{card.videos[value].extMap.clarity}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.sign &&
                                            <span className={style['sign']}>{card.videos[value].extMap.sign}</span>
                                        }
                                        <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                        {
                                            card.layoutId === 7 ? (<div className={style['overflow']}>{card.videos[value] ? card.videos[value].subName : ''}</div>) : ''
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            );
        } else if (card.layoutId === 3) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout3']}`}>
                    <ul>
                        {
                            layoutList3.map((value, i) => {
                                return (
                                    <li
                                        key={i}
                                        onClick={this.handleVideoClick.bind(this, value, 3)}
                                        className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}
                                    >
                                        <img alt='' src={card.videos[value] ? utils.handleImgUrl(card.videos[value].imageUrl) : ''}/>
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.updateEpisode &&
                                            <span className={style['updateEpisode']}>{card.videos[value].extMap.updateEpisode}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.clarity &&
                                            <span className={style['clarity']}>{card.videos[value].extMap.clarity}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.sign &&
                                            <span className={style['sign']}>{card.videos[value].extMap.sign}</span>
                                        }
                                        <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            );
        } else if (card.layoutId === 4) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout4']}`}>
                    <ul>
                        <li
                            onClick={this.handleVideoClick.bind(this, 0, 1)}
                            className={style[this.props.currentVideoIndex === 0 ? 'box-shadow' : '']}
                        >
                            <img alt='' src={card.videos[0] ? utils.handleImgUrl(card.videos[0].imageUrl) : ''}/>
                            {
                                card.videos[0] &&
                                card.videos[0].extMap &&
                                card.videos[0].extMap.updateEpisode &&
                                <span className={style['updateEpisode']}>{card.videos[0].extMap.updateEpisode}</span>
                            }
                            {
                                card.videos[0] &&
                                card.videos[0].extMap &&
                                card.videos[0].extMap.clarity &&
                                <span className={style['clarity']}>{card.videos[0].extMap.clarity}</span>
                            }
                            {
                                card.videos[0] &&
                                card.videos[0].extMap &&
                                card.videos[0].extMap.sign &&
                                <span className={style['sign']}>{card.videos[0].extMap.sign}</span>
                            }
                            <div className={style['overflow']}>{card.videos[0] ? card.videos[0].name : ''}</div>
                            <div className={style['overflow']}>{card.videos[0] ? card.videos[0].subName : ''}</div>
                        </li>

                        {
                            layoutList4.map((value, i) => {
                                return (
                                    <li
                                        key={i}
                                        onClick={this.handleVideoClick.bind(this, value, 3)}
                                        className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}
                                    >
                                        <img
                                            alt=''
                                            src={card.videos[value] ? utils.handleImgUrl(card.videos[value].imageUrl) : ''}
                                        />
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.updateEpisode &&
                                            <span className={style['updateEpisode']}>{card.videos[value].extMap.updateEpisode}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.clarity &&
                                            <span className={style['clarity']}>{card.videos[value].extMap.clarity}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.sign &&
                                            <span className={style['sign']}>{card.videos[value].extMap.sign}</span>
                                        }
                                        <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            );
        } else if (card.layoutId === 5 || card.layoutId === 6) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout5']}`}>
                    <ul>
                        {
                            layoutList5.map((value, i) => {
                                return (
                                    <li
                                        key={i}
                                        onClick={this.handleVideoClick.bind(this, value, 1)}
                                        className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}
                                    >
                                        <img alt='' src={utils.handleImgUrl(card.videos[value].imageUrl) || ''}/>
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.updateEpisode &&
                                            <span className={style['updateEpisode']}>{card.videos[value].extMap.updateEpisode}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.clarity &&
                                            <span className={style['clarity']}>{card.videos[value].extMap.clarity}</span>
                                        }
                                        {
                                            card.videos[value] &&
                                            card.videos[value].extMap &&
                                            card.videos[value].extMap.sign &&
                                            <span className={style['sign']}>{card.videos[value].extMap.sign}</span>
                                        }
                                        <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                        {
                                            i === 0 || card.layoutId === 6 ? (<div className={style['overflow']}>{card.videos[value] ? card.videos[value].subName : ''}</div>) : ''
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            );
        } else if (card.layoutId === 8) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout8']}`}>
                    <ul>
                        {
                            layoutList8.map((value, i) => {
                                let resultDiv = '';
                                if (i === 0) { // card.videos[value].scale
                                    let scale = 0; // 圖片比例
                                    resultDiv = (
                                        <li
                                            key={i}
                                            onClick={this.handleVideoClick.bind(this, value, scale)}
                                            className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}
                                        >
                                            <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                            <img alt='' src={require('../../../assets/homePlay.png')} />
                                        </li>
                                    );
                                } else {
                                    let scale = 1; // 圖片比例16：9
                                    resultDiv = (
                                        <li
                                            key={i}
                                            onClick={this.handleVideoClick.bind(this, value, scale)}
                                            className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}
                                        >
                                            <img alt='' src={card.videos[value] ? utils.handleImgUrl(card.videos[value].imageUrl) : ''}/>
                                            {
                                                card.videos[value] &&
                                                card.videos[value].extMap &&
                                                card.videos[value].extMap.updateEpisode &&
                                                <span className={style['updateEpisode']}>{card.videos[value].extMap.updateEpisode}</span>
                                            }
                                            {
                                                card.videos[value] &&
                                                card.videos[value].extMap &&
                                                card.videos[value].extMap.clarity &&
                                                <span className={style['clarity']}>{card.videos[value].extMap.clarity}</span>
                                            }
                                            {
                                                card.videos[value] &&
                                                card.videos[value].extMap &&
                                                card.videos[value].extMap.sign &&
                                                <span className={style['sign']}>{card.videos[value].extMap.sign}</span>
                                            }
                                            <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                            <div className={style['overflow']}>{card.videos[value] ? card.videos[value].subName : ''}</div>
                                        </li>
                                    );
                                }
                                return resultDiv;
                            })
                        }
                    </ul>
                </div>
            );
        } else if (card.layoutId === 9) {
            layout = (
                <div className={`${style.tempWrap} ${style['layout9']}`}>
                    <ul>
                        {
                            layoutList9.map((value, i) => {
                                let resultDiv = '';
                                if (i === 0 || i === 1) { // card.videos[value].scale
                                    let scale = 0; // 圖片比例0
                                    resultDiv = (
                                        <li
                                            key={i}
                                            onClick={this.handleVideoClick.bind(this, value, scale)}
                                            className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}
                                        >
                                            <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                            <img alt='' src={require('../../../assets/homePlay.png')} />
                                        </li>
                                    );
                                } else if (i > 1 && i < layoutList9.length - 1) {
                                    let scale = 1; // 圖片比例16：9
                                    resultDiv = (
                                        <li key={i} onClick={this.handleVideoClick.bind(this, value, scale)}
                                            className={style[this.props.currentVideoIndex === value ? 'box-shadow' : '']}>
                                            <img
                                                alt=''
                                                src={card.videos[value] ? utils.handleImgUrl(card.videos[value].imageUrl) : ''}
                                            />
                                            {
                                                card.videos[value] &&
                                                card.videos[value].extMap &&
                                                card.videos[value].extMap.updateEpisode &&
                                                card.videos[value] && card.videos[value].extMap &&
                                                card.videos[value].extMap.updateEpisode &&
                                                <span className={style['updateEpisode']}>{card.videos[value].extMap.updateEpisode}</span>
                                            }
                                            {
                                                card.videos[value] &&
                                                card.videos[value].extMap &&
                                                card.videos[value].extMap.clarity &&
                                                <span className={style['clarity']}>{card.videos[value].extMap.clarity}</span>
                                            }
                                            {
                                                card.videos[value] && card.videos[value].extMap && card.videos[value].extMap.sign &&
                                                <span className={style['sign']}>{card.videos[value].extMap.sign}</span>
                                            }
                                            <div className={style['overflow']}>{card.videos[value] ? card.videos[value].name : ''}</div>
                                            <div className={style['overflow']}>{card.videos[value] ? card.videos[value].subName : ''}</div>
                                        </li>
                                    );
                                } else if (i === layoutList9.length - 1) {
                                    let scale = 6; // 圖片比例5
                                    let className = this.props.currentVideoIndex === value ? 'box-shadow' : '';
                                    resultDiv = (
                                        <li key={i} onClick={this.handleVideoClick.bind(this, value, scale)}
                                            className={`${style[className]} ${style['lastItem']}`}>
                                            <div><p>查看更多</p></div>
                                            <div><p>换一换</p></div>
                                            <img alt='' src={card.videos[value] ? utils.handleImgUrl(card.videos[value].imageUrl) : ''}/>
                                        </li>
                                    );
                                }
                                return resultDiv;
                            })
                        }
                    </ul>
                </div>
            );
        }

        return (
            <div className={style.templateModule}>
                <div className={style['template-title']}>{card.title}</div>
                {layout}
            </div>
        );
    }
}

Template.propTypes = {
    cards: PropTypes.array.isRequired,
    currentCardsIndex: PropTypes.number.isRequired,
    changeLayoutStatus: PropTypes.func.isRequired,
};

export default Template;
