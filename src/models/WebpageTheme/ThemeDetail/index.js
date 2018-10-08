import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs } from 'antd';
import BasicInfoConfig from './BasicInfoConfig';
import ImgConfig from './ImgConfig';
const TabPane = Tabs.TabPane;

class ThemeDetail extends Component {
    state={ activeKey: 1 } // 加这个是为了切换tab时，实时重新加载组件
    _tabChange = (key) => {
        Number(key) !== 3 && this.setState({ activeKey: Number(key) });
        Number(key) === 3 && this.props.history.push(`/app/webpagetheme/${this.props.match.params.id}/cards`);
    }
    render() {
        return (
            <div>
                <Tabs onChange={this._tabChange} type='card'>
                    <TabPane tab='基础信息' key={1}>
                        {
                            this.state.activeKey === 1 && <BasicInfoConfig
                                id = {this.props.match.params.id}
                            />
                        }
                    </TabPane>
                    <TabPane tab='图片配置' key={2}>
                        {
                            this.state.activeKey === 2 && <ImgConfig
                                id = {this.props.match.params.id}
                            />
                        }
                    </TabPane>
                    <TabPane tab='卡片配置' key={3} />
                </Tabs>
            </div>
        );
    }
}

export default withRouter(ThemeDetail);
