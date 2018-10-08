import React, { Component } from 'react';
import { Switch, Button, Select, message, Modal, Input } from 'antd';
import yxFetch from '../../../../utils/fetch';
import Upload from '../../../../components/Upload';
import style from './style.module.css';
import { REQ_URL } from '../../../../constants/constants';
const Option = Select.Option;

class BannerConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondTitle: '',
            title: '',
            schemeUrl: '',
            imgUrl: '', // add图片接口的入参url
            isChecked: props.bannerOn,
            visible: false
        };
        this.add = this.add.bind(this);
        this.bannerEnabled = this.bannerEnabled.bind(this);
        // 标题等value的可控化
        this.titleChange = this.titleChange.bind(this);
        this.secontTitleChange = this.secontTitleChange.bind(this);
        this.urlChange = this.urlChange.bind(this);
        this.uploadDone = this.uploadDone.bind(this);

        this.saveBanner = this.saveBanner.bind(this);
        this.deleteBanner = this.deleteBanner.bind(this);
        this.modifyBanner = this.modifyBanner.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }
    bannerEnabled(value) {
        let isChecked;
        if (value) {
            isChecked = 1;
        } else {
            isChecked = 0;
        }
        this.setState({
            isChecked: isChecked
        });
        this.props.isBannerEnabledChange(value);
    }
    add() {
        this.props.addBanner();
    }
    // 标题改变
    titleChange(e) {
        if (e.target.value.length <= 30) {
            this.setState({
                title: e.target.value
            });
        }
    }
    // 副标题改变
    secontTitleChange(e) {
        this.setState({
            secondTitle: e.target.value
        });
    }
    // url改变
    urlChange(e) {
        this.setState({
            schemeUrl: e.target.value.trim()
        });
    }
    // 通过props初始化state
    getInitialState() {
        return {
            secondTitle: this.props.editBannerItem.secondTitle,
            title: this.props.editBannerItem.title,
            schemeUrl: this.props.editBannerItem.schemeUrl,
            imgUrl: this.props.editBannerItem.imageId
        };
    }
    // 重新渲染函数
    componentWillReceiveProps(nextProps) {
        if (nextProps.editBannerItem) {
            this.setState({
                // isChecked: nextProps.bannerOn,
                title: nextProps.editBannerItem.title,
                secondTitle: nextProps.editBannerItem.secondTitle,
                schemeUrl: nextProps.editBannerItem.schemeUrl
            });
        }
    }
    uploadDone(imgScale, key) {
    // 凭证获取返回的key值
        this.setState({
            imgUrl: key
        });
    }
    saveBannerWithImageId(imageId) {
        if (!this.props.editBannerItem.id) { // 新增
            yxFetch(REQ_URL.ADD_MOBILE_BANNER, {
                title: this.state.title,
                schemeUrl: this.state.schemeUrl,
                imageId: imageId,
                sort: this.props.editBannerItem.sort,
                secondTitle: this.state.secondTitle,
                channelId: this.props.channelId
            }).then((res) => {
                if (res.code === 0) {
                    this.setState({
                        imgUrl: ''
                    });
                    message.info('新增成功！');
                    this.props.refreshBanner('save');
                } else {
                    message.error(res.errmsg || '添加失败！');
                }
            }).catch(() => {
                message.error('系统错误！');
            });
        } else { // 保存
            yxFetch(REQ_URL.MODIFY_MOBILE_BANNER, {
                id: this.props.editBannerItem.id,
                title: this.state.title,
                schemeUrl: this.state.schemeUrl,
                channelId: this.props.channelId,
                imageId: imageId,
                sort: this.props.editBannerItem.sort,
                secondTitle: this.state.secondTitle,
            }).then((res) => {
                if (res.code === 0) {
                    this.setState({
                        imgUrl: ''
                    });
                    message.info('保存成功！');
                    this.props.refreshBanner('save');
                } else {
                    message.error(res.errmsg || '保存失败！');
                }
            }).catch(() => {
                message.error('系统错误！');
            });
        }
    }
    saveBanner() {
        if (!this.state.title || !this.state.secondTitle || !this.state.schemeUrl || (!this.state.imgUrl && !this.props.editBannerItem.imageUrl)) {
            message.error('信息填写不完整，请填写完整！');
        } else {
            if (this.state.imgUrl) {
                yxFetch('back/image/add', {
                    url: this.state.imgUrl,
                    scale: 1
                }).then((res) => {
                    if (res.code === 0) {
                        this.saveBannerWithImageId(res.data.id);
                    } else {
                        message.error(res.errmsg || '图片添加失败！');
                    }
                }).catch(() => {
                    message.error('系统错误！');
                });
            } else {
                this.saveBannerWithImageId(this.props.editBannerItem.imageId);
            }
        }
    }
    deleteBanner() {
        this.hideModal();
        if (this.props.editBannerItem.id) {
            yxFetch(REQ_URL.REMOVE_MOBILE_BANNER, {
                bannerId: this.props.editBannerItem.id,
            }).then((res) => {
                if (res.code === 0) {
                    message.info('banner删除成功！');
                    this.props.refreshBanner('delete');
                } else {
                    message.error(res.errmsg || 'banner删除失败！');
                }
            }).catch(() => {
                message.error('系统错误！');
            });
        } else {
            message.error('该banner还未保存!!');
        }
    }
    modifyBanner() {
        yxFetch(REQ_URL.MODIFY_MOBILE_CHANNEL, {
            id: this.props.channelId,
            bannerOn: Number(this.props.isBannerEnabled)
        }).then((res) => {
            if (res.code === 0) {
                message.info('保存成功');
                this.props.refreshBanner('bannerOn');
            } else {
                message.error(res.errmsg || 'banner保存失败！');
            }
        }).catch(() => {
            message.error('系统错误！');
        });
    }
    showModal() {
        this.setState({
            visible: true
        });
    }
    hideModal() {
        this.setState({
            visible: false
        });
    }
    render() {
        return (
            <div>
                {this.props.layoutStatus === 1 &&
          <div>
              <div className={style[['banner-config']]}>
                  <p className={style['banner-config-title']}>标题</p>
                  <Input placeholder='标题' className={style['banner-config-input']} value={this.state.title} onChange={this.titleChange} />
              </div>
              <div className={style[['banner-config']]}>
                  <p className={style['banner-config-title']}>副标题</p>
                  <Input placeholder='副标题' className={style['banner-config-input']} value={this.state.secondTitle} onChange={this.secontTitleChange} />
              </div>
              <div className={style[['banner-config']]}>
                  <p className={style['banner-config-title']}>URL</p>
                  <Input placeholder='URL' className={style['banner-config-input']} value={this.state.schemeUrl} onChange={this.urlChange} />
              </div>
              <div className={style['banner-config-upload']}>
                  <Upload
                      imgScale = { 1 }
                      figureWidth={ 126 }
                      figureHeight={ 54 }
                      uploadDone={this.uploadDone}
                      showImgUrl={this.props.editBannerItem.imageUrl}
                  />
                  <p>15 : 7</p>
              </div>
              <Button type='primary' className={style['banner-config-save']} onClick={this.saveBanner}>保存</Button>
              <div className={style[['banner-config']]}>
                  <Button type='primary' icon='plus-circle' style={{ marginLeft: 10 }} onClick={this.add} disabled={this.props.addBannerEnabled}>添加</Button>
                  <Button type='danger' icon='delete' style={{ marginLeft: 30 }} onClick={this.showModal}>删除</Button>
                  <Modal title='删除确认' visible={this.state.visible} onOk={this.deleteBanner} onCancel={this.hideModal} okText='确认' cancelText='取消'>
                      <p>确认删除该banner？</p>
                  </Modal>
              </div>
          </div>
                }
                {this.props.layoutStatus === 0 &&
          <div>
              <div className={style[['banner-config']]}>
                  <p className={style['banner-config-title']}>组件类型</p>
                  <p className={style['banner-config-detail']}>banner</p>
              </div>
              <div className={style[['banner-config']]}>
                  <p className={style['banner-config-title']}>模板类型</p>
                  <div className={style['template-type']}>
                      <Select defaultValue='1' style={{ width: 180 }} onChange={this.onChange}>
                          <Option value='1'>模板一   15:7</Option>
                      </Select>
                  </div>
              </div>
              <div className={style[['banner-config']]}>
                  <p style={{ height: 30 }}><span style={{ lineHeight: '30px' }} className={style['banner-config-title']}>banner数量</span><span className={style['banner-config-count']}>{ ((this.props.bannerCount < 10) ? ('0' + this.props.bannerCount) : this.props.bannerCount) } / 10</span></p>
              </div>
              <div className={style[['banner-config']]}>
                  {this.props.isBannerEnabled &&
                <Switch defaultChecked={ true } onChange={this.bannerEnabled} />
                  }
                  {!this.props.isBannerEnabled &&
                <Switch defaultChecked={ false } onChange={this.bannerEnabled} />
                  }
                  <span style={{ marginLeft: '10px' }}>启用组件</span>
              </div>
              <div className={style[['banner-config']]}>
                  <Button type='primary' icon='plus-circle' onClick={this.add} disabled={this.props.addBannerEnabled}>添加</Button>
                  <Button type='primary' style={{ marginLeft: 10 }} onClick={this.modifyBanner}>保存</Button>
              </div>
          </div>
                }
            </div>
        );
    }
}

export default BannerConfig;
