import React, { Component } from 'react';
import { Button } from 'antd';

class FormDownload extends Component {
    render() {
        const { btnWords, action, values } = this.props;
        return (
            <div style={{ display: 'inline-block' }}>
                <Button onClick={() => this.refs.downloadForm.submit()} type='primary'>{btnWords}</Button>
                <form action={action} method='post' ref='downloadForm' target='_blank' style={{ display: 'none' }}>
                    {
                        Object.keys(values).map((key) => {
                            if (values[key]) {
                                return (
                                    <input type='hidden' name={key} value={values[key]} key={key} />
                                );
                            } else {
                                return '';
                            }
                        })
                    }
                </form>
            </div>
        );
    }
}
export default FormDownload;
