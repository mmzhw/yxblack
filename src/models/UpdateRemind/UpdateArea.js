/**
 * Created by yiming on 2017/5/24.
 */
import React, { Component } from 'react';
import style from './style.module.css';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class UpdateArea extends Component {
    _renderDescrips() {
        let items = [];
        let { updateInfo, handleDescripChange } = this.props;
        for (let i = 0; i < 4; i++) {
            items.push(
                <FormItem key={i} label={i === 0 ? '版本更新信息' : ''} validateStatus={updateInfo.info[i]['validateStatus']} help={updateInfo.info[i].help}>
                    <Input
                        value={updateInfo.info[i].value}
                        type='textarea'
                        autosize = {true}
                        onChange={(e) => handleDescripChange(e, i, { max: 50 }, { help: '最大长度不可超过50个字符' })}
                        placeholder={'请在此输入版本更新信息'}
                    />
                </FormItem>
            );
        }
        return items;
    }
    render() {
        const { updateInfo, handleContentChange, title, styleObj, handleSubmit } = this.props;
        return (
            <div className={style['area']} style={styleObj}>
                <h2 className={style['title']}>{ title }</h2>
                <Form onSubmit={handleSubmit}>
                    <FormItem label='标题' validateStatus={updateInfo.titleContent.validateStatus} help={updateInfo.titleContent.help}>
                        <Input
                            value={updateInfo.titleContent.value}
                            onChange={(e) => handleContentChange(e, 'titleContent', { max: 20 }, { help: '最大长度不可超过20个字符' })}
                            placeholder={'请在此输入标题'}
                        />
                    </FormItem>
                    <FormItem label='版本号' validateStatus={updateInfo.versionNum.validateStatus} help={updateInfo.versionNum.help}>
                        <Input
                            value={updateInfo.versionNum.value}
                            onChange={(e) => handleContentChange(e, 'versionNum', { max: 10 }, { help: '最大长度不可超过10个字符' })}
                            placeholder={'请在此输入版本号'}
                        />
                    </FormItem>
                    {
                        updateInfo.qqUrl ? (
                            <FormItem label='QQ应用宝'>
                                <Input value={updateInfo.qqUrl.value} onChange={(e) => handleContentChange(e, 'qqUrl')} placeholder={'请在此输入qq应用宝下载地址'}/>
                            </FormItem>
                        ) : ''
                    }
                    <FormItem label='下载地址'>
                        <Input value={updateInfo.download.value} onChange={(e) => handleContentChange(e, 'download')} placeholder={'请在此输入下载地址'}/>
                    </FormItem>
                    { this._renderDescrips() }
                    <FormItem>
                        <Button type='primary' onClick={handleSubmit} size='large'>发布</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default UpdateArea;
