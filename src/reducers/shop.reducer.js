import {
    ADD_PRODUCT_TO_CART,
    REMOVE_PRODUCT_FROM_CART
} from '../actions';
import {product} from "../data/products";

const initialState = {
    products: product,
    cart: []
};


const shopReducer = (state = initialState, action ) => {
    let updatedCart;
    let updatedItemIndex;

    switch (action.type) {
        case ADD_PRODUCT_TO_CART:
            updatedCart = [...state.cart];
            updatedItemIndex = updatedCart.findIndex(item => item.id === action.payload.id);

            if(updatedItemIndex < 0) {
                updatedCart.push({...action.payload, quantity: 1});
            } else {
                const updatedItem = {
                    ...updatedCart[updatedItemIndex]
                };

                updatedItem.quantity++;
                updatedCart[updatedItemIndex] = updatedItem;
            }

            return {...state, cart: updatedCart};
        case REMOVE_PRODUCT_FROM_CART:
            updatedCart = [...state.cart];
            updatedItemIndex = updatedCart.findIndex(
                item => item.id === action.payload
            );

            updatedCart.splice(updatedItemIndex, 1);

            return {...state, cart: updatedCart};
        default:
            return state;

    }
};

export default shopReducer;
