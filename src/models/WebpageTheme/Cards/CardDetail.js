import React, { Component } from 'react';
import Advice from './CardType/Advice';
import Demand from './CardType/Demand';
import Live from './CardType/Demand';

const cardTypeMap = {
    1: Live,
    2: Demand,
    3: Advice
};

class CardDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            cardDetail: this.props.cardDetail
        };
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.cardDetail) {
            this.setState({
                cardDetail: nextprops.cardDetail
            });
        }
    }
    render() {
        const ThemeCard = cardTypeMap[this.state.cardDetail.cardType];
        return (
            <div>
                <ThemeCard detail={this.state.cardDetail} />
            </div>
        );
    }
}

export default CardDetail;
