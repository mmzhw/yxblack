import React, { Component } from 'react';
import { Button } from 'antd';
import Upload from '../../../components/Upload';

export default class HeadImageConfig extends Component {
    state = {
        imageUrl: this.props.model && this.props.model.mdata && this.props.model.mdata[0] && this.props.model.mdata[0].imageUrl
    }

    uploadDone = (imgScale, key) => {
        this.setState({
            imageUrl: key
        });
    }

    handleSave = () => {
        const { model, updateHeadImage } = this.props;
        const { imageUrl } = this.state;
        const id = model.mdata && model.mdata[0] && model.mdata[0].id;
        updateHeadImage({ id, imageUrl });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.backImg !== this.props.backImg) {
            this.setState({
                imageUrl: nextProps.backImg
            });
        }
    }

    render() {
        const { imageUrl } = this.state;
        return (
            <div>
                <Upload
                    figureWidth={108}
                    figureHeight={89}
                    uploadDone={this.uploadDone}
                    showImgUrl={imageUrl}
                    imgScale='1'
                    imgScaleText='1080*893'
                />
                <div style={{ margin: '20px 25px' }}><Button onClick={this.handleSave} type='primary'>保存</Button></div>
            </div>
        );
    }
}
