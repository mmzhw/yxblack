import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import reducers from './reducers';
import menuReducer from './reducers/menu';
import storage from './utils/storage';
import registerServiceWorker from './PublicTools/registerServiceWorker';
import Layout from './models/layout';
import Login from './models/Login';
import { ROUTERS } from './constants/routers';

import './index.css';

const history = createHistory();
let middleware = [routerMiddleware(history), ReduxThunk];
if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware, createLogger()];
}
const store = createStore(
    combineReducers({
        ...reducers,
        menuReducer: menuReducer,
        router: routerReducer
    }),
    applyMiddleware(...middleware)
);
const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        exact={route.exact}
        render={(match) => {
            const accessToken = storage.get('user') && storage.get('user').accessToken;
            // let isAuthenticated = props.isAuthenticated
            // debugger
            if (!accessToken) {
                return (
                    <Redirect to={{
                        pathname: '/',
                        state: { from: match.location }
                    }}/>
                );
            } else {
                return (
                    <Layout routes={ ROUTERS } match={match} content={route.component} selectedMenu={route.activeMenu && route.activeMenu(match)} />
                );
            }
        }}
    />
);

// start 状态树应用到全局 通过Provider
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path='/' component={Login} />
                <Route exact path='/login' component={Login} />
                {ROUTERS.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
            </Switch>
        </Router>
    </Provider>
    , document.getElementById('root')
);

registerServiceWorker();
