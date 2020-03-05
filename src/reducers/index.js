import {combineReducers} from 'redux';
import shop from './shop.reducer';
import username from "./updateUser.reducer";
import items from "./addItems.reducer";
import {categoryFilterReducer} from "./category.filter.reducer";
import {orderByPriceReducer} from "./orderByPrice.filter.reducer";
import {paginationReducer} from "./pagination.reducer";

export default combineReducers({
    shop,
    username,
    items,
    categoryFilter: categoryFilterReducer,
    orderBy: orderByPriceReducer,
    pagination: paginationReducer
});
