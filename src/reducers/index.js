import {combineReducers} from 'redux';
import shop from './shop.reducer';
import username from "./updateUser.reducer";
import {brandFilterReducer} from "./brand.filter.reducer";
import {orderByPriceReducer} from "./orderByPrice.filter.reducer";
import {paginationReducer} from "./pagination.reducer";

export default combineReducers({
    shop,
    username,
    brandFilter: brandFilterReducer,
    orderBy: orderByPriceReducer,
    pagination: paginationReducer
});
