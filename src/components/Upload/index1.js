import React, { Component } from 'react';
import { Modal } from 'antd';
import xfetch from '../../utils/fetch';
import { imgPrefix } from '../../utils/index';
import style from './style.module.css';
import defaultImg from '../../assets/none.png';
import defaultImgAdvert from '../../assets/advert-59-6.png';
import { REQ_URL } from '../../constants/constants';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgScale: props.imgScale ? props.imgScale : 1,
            imgScaleText: props.imgScaleText ? props.imgScaleText : '',
            figureWidth: props.figureWidth ? props.figureWidth : '',
            figureHeight: props.figureHeight ? props.figureHeight : '',
            showImgUrl: props.showImgUrl ? this.handleImgUrl(props.showImgUrl) : props.noneImg === 'advert' ? defaultImgAdvert : defaultImg,
            disabled: props.disabled ? props.disabled : false,
            display: 'block',
            visible: false
        };
        this.addImage = this.addImage.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            showImgUrl: props.showImgUrl ? this.handleImgUrl(props.showImgUrl) : props.noneImg === 'advert' ? defaultImgAdvert : defaultImg,
            disabled: props.disabled,
        });
    }
    handleImgUrl(imgUrl) {
        if (imgUrl.indexOf('http') === -1) {
            return imgPrefix + imgUrl;
        } else {
            return imgUrl;
        }
    }
    addImage (event) {
        const image = event.target.files[0];
        if (!image) return; // if no img upload, just return
        const formData = new window.FormData();
        function makeid() {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 10; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
        const key = `back-${Date.now()}-${makeid()}`;
        formData.append('file', image);
        event.target.value = null; // To trigger onchange event next time, input value should be reset to null
        xfetch(REQ_URL.UPLOAD_TOKEN, {
            bucket: 'dx-image-test',
            key,
            expires: 3600
        }).then((res) => {
            if (res.code === 0) {
                formData.append('token', res.data);
                formData.append('key', key);
                fetch('http://up.qiniu.com', {
                    method: 'post',
                    mode: 'cors',
                    body: formData
                }).then(json => {
                    return json.json();
                }).then((data) => {
                    // 判断是否有回调
                    if (this.props.uploadDone) {
                        this.props.uploadDone(this.state.imgScale, data.key, image);
                    }
                    // form getFieldDecorator 提交的方式
                    if (this.props.onChange) {
                        this.props.onChange(key);
                    }
                    this.setState({
                        showImgUrl: imgPrefix + data.key,
                        display: 'none',
                    });
                });
            }
        });
    }
    render() {
        return (
            <div className={style.container}>
                <div className='scale'>{this.props.imgScaleText}</div>
                <figure
                    className={style.figure}
                    style={{
                        width: `${this.props.figureWidth}px`,
                        height: `${this.props.figureHeight}px`
                    }}
                >
                    <p className={style.upload} style={{ display: this.state.display }}>上传图片</p>
                    <img
                        alt=''
                        className={style.avatar}
                        src={this.state.showImgUrl}
                        style={{ height: this.props.figureHeight, width: this.props.figureWidth }}
                    />
                    <input className={style.control} type='file' disabled={ this.state.disabled } onChange={this.addImage} />
                </figure>
                {
                    this.props.showOrigin && this.state.showImgUrl && <p>
                        <a
                            style={{ textAlign: 'left', lineHeight: '25px', cursor: 'pointer' }}
                            onClick={() => this.setState({ visible: !this.state.visible })}
                        >
                            查看原图
                        </a>
                    </p>
                }
                <Modal
                    visible={this.state.visible}
                    footer={null}
                    onCancel={() => this.setState({ visible: !this.state.visible })}
                >
                    <div style={{ padding: '30px', textAlign: 'center' }}>
                        <img
                            alt='分享图片'
                            className={style.avatar}
                            src={this.state.showImgUrl}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default App;
