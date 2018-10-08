import React, { Component } from 'react';
import style from './style.module.css';

class Header extends Component {
    render() {
        return (
            <div className={ style['bookshelf-header'] }>
                <div className={ style['header-name'] }>
                    {this.props.headerName}
                    {this.props.headerImg &&
            <img className={ style['header-img']} src={this.props.headerImg} alt=''/>
                    }
                </div>
                {this.getSubName(this.props.headerSubName)}
            </div>
        );
    }

    getSubName(headerSubName) {
        if (headerSubName && headerSubName.trim() !== '') {
            return (
                <div className={ style['header-sub-name'] }>
                    <span>（</span>
                    <span className={ style['sub-title'] }>{headerSubName}</span>
                    <span>）</span>
                </div>
            );
        }
    }
}

export default Header;
