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
            secondTitle: props.editBannerItem.secondTitle,
            title: props.editBannerItem.title,
            schemeUrl: props.editBannerItem.schemeUrl,
            imgUrl: props.editBannerItem.imageUrl, // add图片接口的入参url
            isChecked: props.isBannerEnabled, // 是否启用
            visible: false
        };
    }
    componentWillReceiveProps = (nextProps) => {
    // nextProps.editBannerItem 不会为空
    // 所以一直会更新
    // 不明白为啥这么写
        if (nextProps.editBannerItem) {
            this.setState({
                isChecked: nextProps.isBannerEnabled,
                title: nextProps.editBannerItem.title,
                secondTitle: nextProps.editBannerItem.secondTitle,
                schemeUrl: nextProps.editBannerItem.schemeUrl,
                imgUrl: nextProps.editBannerItem.imageUrl
            });
        }
    }
    // 切换 banner 启用状态 --- done
    bannerEnabled = (value) => {
        const isChecked = Number(value);
        this.setState({
            isChecked,
        });
        this.props.isBannerEnabledChange(value);
    }
    // 添加 banner --- done
    add = () => {
        this.props.addBanner();
    }
    // 对整个 banner 的启用状态修改 --- half-------done
    modifyBanner = () => {
        const { isChecked } = this.state;
        const { channelId } = this.props;
        yxFetch(REQ_URL.MODIFY_MOBILE_CHANNEL, {
            id: channelId,
            bannerOn: Number(isChecked),
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
    // =============
    // bannerItem 的方法
    // =============
    // 标题改变 --- done
    titleChange = (e) => {
        if (e.target.value.length <= 30) {
            this.setState({
                title: e.target.value
            });
        }
    }
    // 副标题改变 --- done
    secontTitleChange = (e) => {
        this.setState({
            secondTitle: e.target.value.trim()
        });
    }
    // url改变 --- done
    urlChange = (e) => {
        this.setState({
            schemeUrl: e.target.value.trim()
        });
    }
    // 上传图片
    uploadDone = (imgScale, key) => {
    // 凭证获取返回的key值
        this.setState({
            imgUrl: key
        });
    }
    // ----- done ?
    saveBannerWithImageId = (imageId) => {
        const params = {
            title: this.state.title,
            schemeUrl: this.state.schemeUrl,
            imageId,
            sort: this.props.editBannerItem.sort,
            secondTitle: this.state.secondTitle,
            channelId: this.props.channelId
        };
        // 没有 editBannerItem.id 是新增
        if (!this.props.editBannerItem.id) { // 新增
            yxFetch(REQ_URL.ADD_MOBILE_BANNER, params).then((res) => {
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
            // 有 editBannerItem.id 是保存
            yxFetch(REQ_URL.MODIFY_MOBILE_BANNER, {
                id: this.props.editBannerItem.id,
                ...params
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
    // 保存banner --- done
    saveBanner = () => {
        const {
            title,
            secondTitle,
            schemeUrl,
            imgUrl
        } = this.state;
        if (!title || !secondTitle || !schemeUrl || (!imgUrl && !this.props.editBannerItem.imageUrl)) {
            message.error('信息填写不完整，请填写完整！');
            return;
        } else {
            if (imgUrl) {
                yxFetch(REQ_URL.ADD_IMG, {
                    url: imgUrl,
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
    // 删除 banner
    deleteBanner = () => {
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

    showModal = () => {
        this.setState({
            visible: true
        });
    }
    hideModal = () => {
        this.setState({
            visible: false
        });
    }
    render() {
        const {
            layoutStatus, // 0 代表 banner ，1代表 bannerItem
            bannerCount,
            isBannerEnabled, // banner 是否启用
            addBannerEnabled, // 添加按钮是否禁用
        } = this.props;
        const {
            title, // 每个 bannerItem 的配置
            secondTitle,
            schemeUrl,
            imgUrl
        } = this.state;
        return (
            <div>
                {layoutStatus === 0 &&
          <div>
              <div className={style['banner-config']}>
                  <p className={style['banner-config-title']}>组件类型</p>
                  <p className={style['banner-config-detail']}>banner</p>
              </div>
              <div className={style['banner-config']}>
                  <p className={style['banner-config-title']}>模板类型</p>
                  <div className={style['template-type']}>
                      <Select
                          defaultValue='1'
                          style={{ width: 180 }}
                      >
                          <Option value='1'>模板一 15:7</Option>
                      </Select>
                  </div>
              </div>
              <div className={style['banner-config']}>
                  <p style={{ height: 30 }}>
                      <span
                          style={{ lineHeight: '30px' }}
                          className={style['banner-config-title']}>
                  banner数量
                      </span>
                      <span className={style['banner-config-count']}>
                          { ((bannerCount < 10) ? ('0' + bannerCount) : bannerCount) } / 10
                      </span>
                  </p>
              </div>
              <div className={style['banner-config']}>
                  {
                      isBannerEnabled && <Switch defaultChecked={true} onChange={this.bannerEnabled} />
                  }
                  {
                      !isBannerEnabled && <Switch defaultChecked={false} onChange={this.bannerEnabled} />
                  }
                  <span style={{ marginLeft: '10px' }}>启用组件</span>
              </div>
              <div className={style['banner-config']}>
                  <Button
                      type='primary'
                      icon='plus-circle'
                      onClick={this.add}
                      disabled={addBannerEnabled}
                  >
                添加
                  </Button>
                  <Button
                      type='primary'
                      style={{ marginLeft: 10 }}
                      onClick={this.modifyBanner}
                  >
                保存
                  </Button>
              </div>
          </div>
                }
                {layoutStatus === 1 &&
          <div>
              <div className={style['banner-config']}>
                  <p className={style['banner-config-title']}>标题</p>
                  <Input
                      className={style['banner-config-input']}
                      value={title}
                      placeholder='标题'
                      onChange={this.titleChange}
                  />
              </div>
              <div className={style['banner-config']}>
                  <p className={style['banner-config-title']}>副标题</p>
                  <Input
                      className={style['banner-config-input']}
                      placeholder='副标题'
                      value={secondTitle}
                      onChange={this.secontTitleChange}
                  />
              </div>
              <div className={style['banner-config']}>
                  <p className={style['banner-config-title']}>URL</p>
                  <Input
                      className={style['banner-config-input']}
                      placeholder='URL'
                      value={schemeUrl}
                      onChange={this.urlChange}
                  />
              </div>
              <div className={style['banner-config-upload']}>
                  <Upload
                      imgScale={1}
                      figureWidth={126}
                      figureHeight={54}
                      uploadDone={this.uploadDone}
                      showImgUrl={imgUrl}
                  />
                  <p>15 : 7</p>
              </div>
              <Button
                  type='primary'
                  className={style['banner-config-save']}
                  onClick={this.saveBanner}
              >
              保存
              </Button>
              <div className={style['banner-config']}>
                  <Button
                      type='primary'
                      icon='plus-circle'
                      style={{ marginLeft: 10 }}
                      onClick={this.add}
                      disabled={addBannerEnabled}
                  >
                添加
                  </Button>
                  <Button
                      type='danger'
                      icon='delete'
                      style={{ marginLeft: 30 }}
                      onClick={this.showModal}
                  >
                删除
                  </Button>
                  <Modal
                      title='删除确认'
                      visible={this.state.visible}
                      onOk={this.deleteBanner}
                      onCancel={this.hideModal}
                      okText='确认'
                      cancelText='取消'
                  >
                      <p>确认删除该banner？</p>
                  </Modal>
              </div>
          </div>
                }
            </div>
        );
    }
}

export default BannerConfig;
