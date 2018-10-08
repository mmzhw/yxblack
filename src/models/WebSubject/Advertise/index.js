import React, { Component } from 'react';
import PlayBackConfig from '../PlayBack/PlayBackConfig';
import AdvertiseModal from './AdvertiseModal';
import { handleImgUrl } from '../../../utils/util';
import style from './index.module.css';

export default class Advertise extends Component {
    state = {
        modalOption: {
            visible: false,
            onOk: () => this.handleSubmit(),
            onCancel: () => this.closeModal()
        },
        imgOneP: '',
        imgOneA: '',
        imgTwoLp: '',
        imgTwoLa: '',
        imgTwoRp: '',
        imgTwoRa: '',
        imageUrl: '', // 修改需要放入的app图片
        imageUrlPc: '', // 修改需要放入的pc图片
        imgType: 0, // 修改的图片类型,0是1*1,1是左边,2是右边
        layoutId: 1,
    }

    handleSubmit = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                const { model } = this.props;
                const num = this.state.imgType;
                let imgArray = model.mdata.filter((type) => { return type.adType === num; });
                values = {
                    id: imgArray.length > 0 && imgArray[0].id,
                    ...values,
                    imageUrl: this.state.imageUrl,
                    imageUrlPc: this.state.imageUrlPc,
                    adType: num
                };
                if (imgArray.length > 0) {
                    values = {
                        title: values.title,
                        contentUrl: values.contentUrl,
                        imageUrl: values.imageUrl,
                        imageUrlPc: values.imageUrlPc,
                        id: values.id,
                        adType: values.adType
                    };
                    this.props.updateAdvertise(values);
                } else {
                    values = {
                        cardId: model.id,
                        title: values.title,
                        contentUrl: values.contentUrl,
                        imageUrl: values.imageUrl,
                        imageUrlPc: values.imageUrlPc,
                        adType: values.adType
                    };
                    this.props.addAdvertise(values);
                }
            }
        });
        this.form.resetFields();
        this.closeModal();
    }

    handleLayoutChange = (layoutId) => {
        this.setState({
            layoutId: Number(layoutId),
        });
    }

    showModal = (value) => {
        if (value === 0) {
            this.setState({
                imageUrlPc: this.state.imgOneP,
                imageUrl: this.state.imgOneA,
            });
        } else if (value === 1) {
            this.setState({
                imageUrlPc: this.state.imgTwoLp,
                imageUrl: this.state.imgTwoLa
            });
        } else if (value === 2) {
            this.setState({
                imageUrlPc: this.state.imgTwoRp,
                imageUrl: this.state.imgTwoRa
            });
        }
        this.setState({
            imgType: value,
            modalOption: {
                ...this.state.modalOption,
                visible: true,
            }
        });
    }

    closeModal = () => {
        this.form.resetFields();
        this.setState({
            modalOption: {
                ...this.state.modalOption,
                visible: false,
            }
        });
    }

    updateImageUrl = (url) => {
        this.setState({
            imageUrl: url
        });
    }

    updateImageUrlPc = (url) => {
        this.setState({
            imageUrlPc: url
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.model !== this.props.model) {
            const imgOne = nextProps.model && nextProps.model.mdata && nextProps.model.mdata.filter((type) => { return type.adType === 0; })[0];
            const imgTwoL = nextProps.model && nextProps.model.mdata && nextProps.model.mdata.filter((type) => { return type.adType === 1; })[0];
            const imgTwoR = nextProps.model && nextProps.model.mdata && nextProps.model.mdata.filter((type) => { return type.adType === 2; })[0];
            this.setState({
                imgOneP: (imgOne && imgOne.imageUrlPc !== null) ? imgOne.imageUrlPc : '',
                imgOneA: (imgOne && imgOne.imageUrl !== null) ? imgOne.imageUrl : '',
                imgTwoLp: (imgTwoL && imgTwoL.imageUrlPc !== null) ? imgTwoL.imageUrlPc : '',
                imgTwoLa: (imgTwoL && imgTwoL.imageUrl !== null) ? imgTwoL.imageUrl : '',
                imgTwoRp: (imgTwoR && imgTwoR.imageUrlPc !== null ? imgTwoR.imageUrlPc : ''),
                imgTwoRa: (imgTwoR && imgTwoR.imageUrl !== null ? imgTwoR.imageUrl : ''),
                layoutId: nextProps.model.layoutId
            });
        }
    }

    componentDidMount() {
        const imgOne = this.props.model && this.props.model.mdata && this.props.model.mdata.filter((type) => { return type.adType === 0; })[0];
        const imgTwoL = this.props.model && this.props.model.mdata && this.props.model.mdata.filter((type) => { return type.adType === 1; })[0];
        const imgTwoR = this.props.model && this.props.model.mdata && this.props.model.mdata.filter((type) => { return type.adType === 2; })[0];
        this.setState({
            imgOneP: (imgOne && imgOne.imageUrlPc !== null) ? imgOne.imageUrlPc : '',
            imgOneA: (imgOne && imgOne.imageUrl !== null) ? imgOne.imageUrl : '',
            imgTwoLp: (imgTwoL && imgTwoL.imageUrlPc !== null) ? imgTwoL.imageUrlPc : '',
            imgTwoLa: (imgTwoL && imgTwoL.imageUrl !== null) ? imgTwoL.imageUrl : '',
            imgTwoRp: (imgTwoR && imgTwoR.imageUrlPc !== null ? imgTwoR.imageUrlPc : ''),
            imgTwoRa: (imgTwoR && imgTwoR.imageUrl !== null ? imgTwoR.imageUrl : ''),
            layoutId: this.props.model.layoutId
        });
    }
    createAdvert = () => {
        const { layoutId, imgOneP, imgTwoLp, imgTwoRp } = this.state;
        switch (layoutId) {
            case 1:
                return (
                    imgOneP ? (
                        <img alt='' width='590' height='60' src={handleImgUrl(imgOneP)} style={{ cursor: 'pointer' }} onClick={() => this.showModal(0)}/>
                    ) : <div className={style['advert-img']} onClick={() => this.showModal(0)}>请点击进行配置</div>
                );
            case 2:
                return (
                    <div>
                        <div className={style['advert-img-w']}>
                            {
                                imgTwoLp ? (
                                    <img alt='' width='295' height='60' src={handleImgUrl(imgTwoLp)} style={{ cursor: 'pointer' }} onClick={() => this.showModal(1)}/>
                                ) : <div className={style['advert-img-l']} onClick={() => this.showModal(1)}>请点击进行配置左边</div>
                            }
                        </div>
                        <div className={style['advert-img-w']}>
                            {
                                imgTwoRp ? (
                                    <img alt='' width='295' height='60' src={handleImgUrl(imgTwoRp)} style={{ cursor: 'pointer', display: 'inline-block' }} onClick={() => this.showModal(2)}/>
                                ) : <div className={style['advert-img-r']} onClick={() => this.showModal(2)}>请点击进行配置右边</div>
                            }
                        </div>
                    </div>
                );
            default:
                return false;
        }
    }
    render() {
        const { model, updateModel } = this.props;
        const { modalOption, imageUrl, imageUrlPc, imgType } = this.state;
        const configData = model && model.mdata && model.mdata.filter((type) => { return type.adType === this.state.imgType; })[0];
        const listType = [{ label: '广告位1*1', value: 1 }, { label: '广告位1*2', value: 2 }];
        const imgTypeSize = imgType === 0 ? ['1180 * 120', '1080 * 230'] : ['590 * 120', '540 * 230'];
        return (
            <div>
                <div className={style['advert']}>
                    <h3>广告位</h3>
                    <div>
                        <h4 className={style['advert-title']}>广告图配置</h4>
                        {
                            this.createAdvert()
                        }
                    </div>
                </div>
                <div style={{ marginTop: '20px', border: '1px solid #DDD', padding: '10px', overflow: 'hidden' }}>
                    <PlayBackConfig
                        componentType='广告'
                        listType={listType}
                        handleLayoutChange={this.handleLayoutChange}
                        configData={model}
                        updateModel={updateModel}>
                    </PlayBackConfig>
                </div>
                <AdvertiseModal
                    ref={form => { this.form = form; }}
                    configData={configData}
                    modalOption={modalOption}
                    imageUrlPc={imageUrlPc}
                    imageUrl={imageUrl}
                    imgTypeSize={imgTypeSize}
                    updateImageUrlPc={this.updateImageUrlPc}
                    updateImageUrl={this.updateImageUrl}
                />
            </div>
        );
    }
}
