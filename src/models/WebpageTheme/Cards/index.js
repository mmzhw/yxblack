import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { message, Tabs, Button, Spin, Modal, Form, Input, Select } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import fetcher from '../../../utils/fetch';
import { REQ_URL } from '../../../constants/constants';
import CardDetail from './CardDetail';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

let DragText = (props) => {
    const {
        connectDragSource,
        connectDropTarget,
        ...restProps
    } = props;
    return connectDragSource(
        connectDropTarget(
            <span style={{ display: 'inline-block', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }}>{restProps.name}</span>
        )
    );
};

DragText = DropTarget('row', {
    drop(props, monitor) {
        const sourceObj = monitor.getItem().object;
        props.sort(sourceObj, props.object);
    },
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', {
        beginDrag(props) {
            return {
                object: props.object,
            };
        },
    }, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(DragText)
);

const initModel = { // 配置初始化模板类型
    1: 1,
    2: 3,
    3: 1
};

class ThemeCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allChannelData: [],
            spinning: false
        };
    }
    _getAllData = async () => {
        const { id } = this.props.match.params;
        this.setState({ spinning: true });
        const res = await fetcher(REQ_URL.SPECIAL_CHANNEL_LISTS, { id });
        if (res.code === 0) {
            res.data && res.data.models && this.setState({
                allChannelData: res.data.models,
                spinning: false
            });
        } else {
            message.error(res.errmsg);
        }
    }
    _sort = (sourceObj, targetObj) => {
        let allChannelData = [...this.state.allChannelData];
        allChannelData.forEach((obj, i) => {
            if (obj.id === sourceObj.id) {
                allChannelData[i] = { ...targetObj };
            }
            if (obj.id === targetObj.id) {
                allChannelData[i] = { ...sourceObj };
            }
        });
        this.setState({
            allChannelData
        });
    }
    _saveSort = async () => {
        const sortData = this.state.allChannelData.map((obj) => {
            return obj.id;
        });
        const res = await fetcher(REQ_URL.SPECIAL_CARD_SORT, { sortData, channelId: this.props.match.params.id });
        if (res.code === 0) {
            message.success('更新成功');
            this._getAllData();
        } else {
            message.error(res.errmsg);
        }
    }
    _tabsEdit = (id, action) => {
        if (action === 'remove') {
            Modal.confirm({
                content: '确认删除？',
                onOk: async () => {
                    const res = await fetcher(REQ_URL.SPECIAL_CARD_DELETE, { id });
                    if (res.code === 0) {
                        message.success('删除成功');
                        this._getAllData();
                    } else {
                        message.error(res.ermsg);
                    }
                }
            });
        } else if (action === 'add') {
            this.setState({ __visible: !this.state.__visible });
        }
    }
    _addCard = () => {
        this.props.form.validateFields(async (err, values) => {
            if (err) return message.error('配置不完整，无法保存');
            const res = await fetcher(REQ_URL.SPECIAL_CARD_ADD, {
                ...values,
                channelId: this.props.match.params.id,
                layoutId: initModel[Number(values.cardType)]
            });
            if (res.code === 0) {
                message.success('新建成功');
                this.setState({ __visible: !this.state.__visible });
                this._getAllData();
            } else {
                message.error(res.errmsg);
            }
        });
    }
    componentDidMount() {
        this._getAllData();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Spin size='large' spinning={this.state.spinning}>
                    <Tabs
                        tabPosition='left'
                        type='editable-card'
                        tabBarExtraContent={
                            <Button type='primary' style={{ width: '100%' }} onClick={this._saveSort}>保存排序</Button>
                        }
                        onEdit={this._tabsEdit}
                    >
                        {
                            this.state.allChannelData.map((obj) => {
                                return (
                                    <TabPane tab={<DragText name={obj.cardName} object={obj} sort={this._sort} />} key={obj.id}>
                                        <CardDetail cardDetail={obj} />
                                    </TabPane>
                                );
                            })
                        }
                    </Tabs>
                </Spin>
                <Modal
                    visible={!!this.state.__visible}
                    onCancel={() => this.setState({ __visible: !this.state.__visible })}
                    destroyOnClose={true}
                    onOk={this._addCard}
                >
                    <Form>
                        <FormItem
                            label='模块名称'
                        >
                            {getFieldDecorator('cardName', {
                                rules: [{ required: true, message: '必填项' }, { max: 20, message: '最长不得超过20个字' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label='卡片类型'
                        >
                            {getFieldDecorator('cardType', {
                                rules: [{ required: true, message: '必填项' }],
                            })(
                                <Select>
                                    <Option key='1'>直播</Option>
                                    <Option key='2'>点播</Option>
                                    <Option key='3'>广告</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(withRouter(DragDropContext(HTML5Backend)(ThemeCards)));
