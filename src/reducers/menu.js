import { combineReducers } from 'redux';
import { SET_MENU, SET_MENU_TYPE } from '../actions';

// 初始化数据列表
const initialState = {
    menuKey: '',
};

const selectedMenu = (state = initialState, action) => {
    switch (action.type) {
        case SET_MENU:
            return {
                ...state,
                menuKey: action.payload.menuKey,
            };
        case SET_MENU_TYPE:
            return {
                ...state,
                menuType: action.payload.menuType
            };
        default:
            return state;
    }
};

const menuReducer = combineReducers({
    selectedMenu,
});

export default menuReducer;

