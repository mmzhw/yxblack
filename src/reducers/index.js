import { combineReducers } from 'redux';

import { LOGGED_IN } from '../actions';

const userInfo = (state = {
    isAuthenticated: false,
    accessToken: '',
    name: '',
}, action) => {
    switch (action.type) {
        case LOGGED_IN:
            return {
                ...state,
                isAuthenticated: true,
                accessToken: action.accessToken,
                userName: ''
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    userInfo
});

export default rootReducer;

