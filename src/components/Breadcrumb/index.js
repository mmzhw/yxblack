import { Breadcrumb } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import React from 'react'
import style from './style.module.css';
// import createBreadcrunb from './Breadcrumbs'

// const staticRoutesMap = {
//   '/': 'Home',
//   'A': 'Android版本更新',
//   'I': 'IOS版本更新',
//   'crawler': '爬取待审核',
//   '/crawlerDetail/afdsf': '视频详情/fasfe',
// }
// const App = createBreadcrunb({
//   staticRoutesMap,
//   Breadcrumb,
//   BreadcrumbItem: Breadcrumb.Item
// })

// const resolvePath = (path, resolveRoutes) => {
//   let route = routes.find(route => {
//     return route.path === path
//   })
//   let parentPath = route.parentPath
//   resolveRoutes.unshift(route)
//   if (parentPath) {
//     return resolvePath(parentPath, resolveRoutes)
//   }
//   return resolveRoutes
// }

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: []
        };
        this.goBack = this.goBack.bind(this);
    }
    componentWillMount() {
        let path = this.props.match.path;
        this._createBreadcrumbItems(path, this.props.location.state);
    }
    componentWillReceiveProps(nextProps) {
        let path = nextProps.match.path;
        this._createBreadcrumbItems(path, nextProps.location.state);
    }

    _resolvePath(path, resolveRoutes) {
        let route = this.props.routes.find(route => {
            return route.path === path;
        });
        let parentPath = route.parentPath;
        resolveRoutes.unshift(route);
        if (parentPath) {
            return this._resolvePath(parentPath, resolveRoutes);
        }
        return resolveRoutes;
    }

    _createBreadcrumbItems(path, state) {
        let resolveRoutes = [];
        resolveRoutes = this._resolvePath(path, resolveRoutes);
        let breadcrumbItems = resolveRoutes.map((resolveRoute, index, routes) => {
            if (index === resolveRoutes.length - 1) {
                return this._createBreadcrumbItem(resolveRoute, index, routes, state);
            }
            return this._createBreadcrumbItem(resolveRoute, index, routes);
        });
        this.setState({
            breadcrumbItems
        });
    }

    _replacePath(path, url) {
    // const startPosition = path.indexOf(':')
    // const str = url.slice(startPosition + 1)
    // const endPosition = str.indexOf('/') + startPosition;
        let pathArr = path.split('/');
        let urlArr = url.split('/');
        let newPath = pathArr.map((pathStr, index) => {
            return urlArr[index];
        }).join('/');
        return newPath;
    }

    _createBreadcrumbItem(route, index, routes, state) {
        let breadcrumbName = route.breadcrumbName;
        if (!breadcrumbName) {
            breadcrumbName = '';
            let params = this.props.match.params;
            for (let i in params) {
                if (params[i]) {
                    breadcrumbName = params[i];
                }
            }
        }
        if ((/:/).test(route.path)) {
            let path = this._replacePath(route.path, this.props.match.url);
            return (
                <Breadcrumb.Item key={route.path} className={'breadcrumb-placeholder'}><Link to={path}>{state ? (state.name ? state.name : breadcrumbName) : breadcrumbName}</Link></Breadcrumb.Item>
            );
        }
        return (
            <Breadcrumb.Item key={route.path}><Link to={route.path}>{state ? (state.name ? state.name : breadcrumbName) : breadcrumbName}</Link></Breadcrumb.Item>
        );
    }

    goBack() {
        this.props.match.history.go(-1);
    }

    render() {
        return (
            <Breadcrumb className={style.bread}>
                {this.state.breadcrumbItems[0]}
                {this.state.breadcrumbItems[1]}
                {this.state.breadcrumbItems[2]}
            </Breadcrumb>
        );
    }
}

export default App;
