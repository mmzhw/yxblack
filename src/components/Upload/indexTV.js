import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Upload, Icon, message, Modal } from 'antd';
import { REQ_URL } from '../../constants/constants';
import yxFetch from '../../utils/tvFetch';
import { handleImgUrl } from '../../utils/util';
import styles from './style.module.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i++) {
            this.text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        this.state = {
            loading: false,
            previewVisible: false, // 预览弹框
            imgScale: props.imgScale ? props.imgScale : 1,
            imgScaleText: props.imgScaleText ? props.imgScaleText : '',
            title: props.title ? props.title : '图片',
            showImgUrl: props.showImgUrl ? handleImgUrl(props.showImgUrl) : '',
            visible: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showImgUrl !== this.props.showImgUrl) {
            this.setState({
                showImgUrl: nextProps.showImgUrl || '',
                title: nextProps.title || '图片',
            });
        }
    }

    beforeUpload(file) {
        if (file.file.size / 1024 / 1024 > 2) {
            return message.error('上传的图片不能大于2M');
        }
        this.setState({
            loading: true,
        });
        const key = `back-${Date.now()}-${this.text}`;
        yxFetch(REQ_URL.UPLOAD_TOKEN, {
            bucket: 'dx-image-test',
            key,
            expires: 3600
        }).then((res) => {
            if (res.code === 0) {
                let formData = new window.FormData();
                formData.append('file', file.file);
                formData.append('token', res.data);
                formData.append('key', key);
                fetch(REQ_URL.QINIU, {
                    method: 'post',
                    mode: 'cors',
                    body: formData
                }).then(json => {
                    return json.json();
                }).then((data) => {
                    if (this.props.uploadDone) {
                        this.props.uploadDone(this.state.imgScale, data.key);
                    }
                    // form getFieldDecorator 提交的方式
                    if (this.props.onChange) {
                        this.props.onChange(key);
                    }
                    this.setState({
                        showImgUrl: handleImgUrl(data.key),
                        loading: false,
                    });
                });
            } else {
                message.error('鉴权失败');
            }
        });
    }

    handlePreview(event) {
        event.stopPropagation();
        this.setState({
            previewVisible: true
        });
    }

    handleCancel() {
        this.setState({
            previewVisible: false
        });
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <p className={styles.imgText}>{this.props.imgScaleText}</p>
                <Upload
                    name='avatar'
                    listType='picture-card'
                    showUploadList={false}
                    onPreview={this.handlePreview.bind(this)}
                    customRequest={this.beforeUpload.bind(this)}
                >
                    {this.state.showImgUrl ? (
                        <img src={handleImgUrl(this.state.showImgUrl)} style={{ width: '100%' }} alt={this.state.title} />
                    ) : (
                        <div>
                            <Icon type={this.state.loading ? 'loading' : 'plus'} />
                            <div className='ant-upload-text'>Upload</div>
                        </div>
                    )}
                    {
                        (this.props.showOrigin && this.state.showImgUrl) ? (
                            <a onClick={(event) => { this.handlePreview(event); }}>查看大图</a>
                        ) : null
                    }
                </Upload>
                <Modal
                    width={'80%'}
                    visible={this.state.previewVisible}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                    wrapClassName={styles.modalWrapper}
                >
                    <img onClick={this.handleCancel.bind(this)} alt={this.state.title} style={{ maxWidth: '100%' }} src={handleImgUrl(this.state.showImgUrl)} />
                </Modal>
            </div>
        );
    }
}

export default connect()(App);
