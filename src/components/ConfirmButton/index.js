import React from 'react';
import { Button, Modal } from 'antd';

const ConfirmButton = (props) => {
    const { content, onClick, children, disabled, type } = props;
    const comfirm = () => {
        Modal.confirm({
            content,
            onOk: onClick,
        });
    };
    if (type === 'link') {
        return <a onClick={comfirm}>{children}</a>;
    } else {
        return <Button onClick={comfirm} type='primary' disabled={disabled}>{children}</Button>;
    }
};

export default ConfirmButton;
