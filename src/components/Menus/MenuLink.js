import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class MenuLink extends Component {
    jumpTo = (to) => {
        this.props.history.push(to);
    }
    render() {
        const { to, children } = this.props;
        return (
            <a onClick={() => this.jumpTo(to)}>{children}</a>
        );
    }
}

export default withRouter(MenuLink);
