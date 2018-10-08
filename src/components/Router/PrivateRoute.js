/**
 * Created by yiming on 2017/6/23.
 */
import storage from '../../utils/storage';
import {
    Route,
    Redirect,
} from 'react-router-dom';

import React from 'react';
const PrivateRoute = ({ component: Component, ...rest }) => {
    const accessToken = storage.get('user') && storage.get('user').accessToken;
    return (
        <Route {...rest} render={props => (
            accessToken ? (
                <Component {...props}/>
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }}/>
            )
        )}/>
    );
};

export default PrivateRoute;
