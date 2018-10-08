import React, { Component } from 'react';

import ChannelConfigTpl1 from './ChannelConfigTpl1';
import ChannelConfigTpl2 from './ChannelConfigTpl2';

class ChannelConfig extends Component {
    render() {
        const { subjectData, channelLayout, loading } = this.props;
        let layout = channelLayout;
        const toProps = {
            loading,
            id: subjectData.id,
            cards: subjectData.cards,
            isEnable: subjectData.isEnable,
            sectionsLayout: channelLayout || subjectData.sectionsLayout,
            title: subjectData.cards[0] && subjectData.cards[0].title,
            timeLine: subjectData.timeLine,
            more: subjectData.cards.length > 0 ? subjectData.cards[0].more : false,
            moreUrl: subjectData.cards.length > 0 ? subjectData.cards[0].moreUrl : ''
        };
        // debugger
        return (
            <div>
                {
                    layout === 1
                        ? <ChannelConfigTpl1
                            ref={form => { this.layOut1form = form; }}
                            onSubmit={this.props.onSubmit}
                            onLayoutChange={this.props.onLayoutChange}
                            {...toProps}
                        />
                        : <ChannelConfigTpl2
                            ref={form => { this.layOut2form = form; }}
                            onSubmit={this.props.onSubmit}
                            onNumChange={this.props.onNumChange}
                            onLayoutChange={this.props.onLayoutChange}
                            {...toProps}
                        />
                }
            </div>
        );
    }
}

export default ChannelConfig;
