import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import BidCartItem from '../../BidCartItem/BidCartItem';

const CheckoutPage = (props) => {
    return (
        <CheckoutPageContainer>
            <CheckoutHeaderContainer>
                <HeaderBlockContainer>
                    <span>Product</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Description</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Status</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Price</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Checkout</span>
                </HeaderBlockContainer>
            </CheckoutHeaderContainer>
            {props.bidCartItemCount ? props.bidCartItems.map(cart => (
                <BidCartItem {...cart} img={cart.images[0]} key={cart.id}/>
                )) : <h1 className="display-4 mt-5 text-center">There is no bid in your BidCart</h1> }
        </CheckoutPageContainer>
);
};
const mapStateToProps = state => {

    console.log(state, 'state has changed');

    return {
        bidCartItems: state.shop.cart,
        bidCartItemCount: state.shop.cart.reduce((count, curItem) => {
            return count + curItem.quantity ;
        }, 0),
    }
};

export default connect(mapStateToProps, null)(CheckoutPage);

export const CheckoutPageContainer = styled.div`
  width: 55%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto 0;
  padding-top: 40px;
  button {
    margin-left: auto;
    margin-top: 50px;
  }
`;

export const CheckoutHeaderContainer = styled.div`
  width: 95%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid darkgrey;
`;

export const HeaderBlockContainer = styled.div`
  text-transform: capitalize;
  width: 23%;
  &:last-child {
    width: 12%;
  }
`;

