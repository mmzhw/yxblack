import React, { Component } from 'react';
import { Player, BigPlayButton, LoadingSpinner, ControlBar, PlayToggle, VolumeMenuButton } from 'video-react';

class YXVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidUpdate() {
        this.refs.videoPlayer.pause();
    }

    render() {
        return (
            <Player ref='videoPlayer' autoPlay>
                <source src={this.props.src} />
                <BigPlayButton position='center' />
                <LoadingSpinner />
                <ControlBar>
                    <PlayToggle />
                    <VolumeMenuButton vertical={true} />
                </ControlBar>
            </Player>
        );
    }
}

export default YXVideo;
