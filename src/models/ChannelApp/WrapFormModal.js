import React, { Component } from 'react';
const WrapFormModal = (WrapedComponent) => {
    return class WrapedFormModal extends Component {
        state = {
            visible: false
        }

        showModal = () => {
            this.setState({
                visible: true
            });
        }

        closeModal = () => {
            this.setState({
                visible: false
            });
        }

        setForm = (form) => {
            this.formModal = form;
        }

        handleSubmit = (fn) => {
            const form = this.formModal;
            form.validateFields(async(err, values) => {
                if (err) {
                    return;
                }
                // 拼接数据
                // 调用接口
                // 数据返回处理
                await fn(values);
                form.resetFields();
                this.closeModal();
            });
        }

        render() {
            const { visible } = this.state;
            return (
                <WrapedComponent
                    {...this.props}
                    setForm={this.setForm}
                    showModal={this.showModal}
                    closeModal={this.closeModal}
                    handleSubmit={this.handleSubmit}
                    formVisible={visible}
                />
            );
        }
    };
};

export default WrapFormModal;
