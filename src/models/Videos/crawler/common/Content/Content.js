import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import YXErrorMsg from '../../../../../components/Errormsg';
import * as urls from '../../../../../constants/urls';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoList: []
        };
        this.getCover = this.getCover.bind(this);
    }
    getCover(image) {
        if (!image) {
            return require('../../../../../assets/none.png');
        } else {
            return image;
        }
    }
    componentDidMount() {
        this.setState({
            videoList: this.props.data
        });
    }
    render() {
        let videoList = this.props.data;
        return (
            <div className={ style['review-content'] }>
                { videoList.length > 0 ? (
                    <ul>
                        {
                            videoList.map((item, index) => {
                                return <li className={ style['review-content-item'] } key={ 'like' + index }>
                                    <Link to={`${urls.CRAWLER}/crawlerDetail/${item.thirdPartyBaseId}`} key={item.thirdPartyBaseId} className={ style['to-detail'] }>
                                        <div className={ style['image'] }>
                                            <img src={this.getCover(item.images)} alt=''/>
                                        </div>
                                        <p className={ style['desc'] }>
                                            { item.subName ? item.subName : '暂无描述' }
                                        </p>
                                        <p className={ style['title'] }>
                                            { item.name ? item.name : '暂无名称'}
                                        </p>
                                    </Link>
                                </li>;
                            })
                        }
                    </ul>
                ) : (
                    <YXErrorMsg errorMessage='亲！还没有视频哦'/>
                )}
            </div>
        );
    }
}

export default Content;

