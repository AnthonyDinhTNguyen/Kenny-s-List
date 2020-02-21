import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import StripePayment from '../StripePayment/StripePayment';
import axios from "axios";
import styled from 'styled-components';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm"
export default class BidCartItem2 extends React.Component {
    constructor(props){
        super(props);
        this.state ={stripe:false,stripeP:''};
        this.startStripe = this.startStripe.bind(this);
    }

    async componentDidMount() {
        
    }
    startStripe(event){
      const stripePromise = loadStripe("pk_test_NedNuvs9YOl1WOhanD0xfJtX00q2eAowF8");
      this.setState({stripe:true});
      this.setState({stripeP:stripePromise})
    }
    render() {
      if(this.state.stripe){
        return (
          <Elements stripe={this.state.stripeP}>
            <CheckoutForm />
          </Elements>
        );
      }
        return (
            <CheckoutItemContainer>
                <ImageContainer>
                    <img src={this.props.img} />
                </ImageContainer>
                <TextContainer>
                    <Link to={`/products/{this.props.id}`}>{this.props.title}</Link>
                </TextContainer>
                <StatusContainer>
                    Bidding
                </StatusContainer>
                <TextContainer>${this.props.yourBid}</TextContainer>
                <TextContainer>$420</TextContainer>
                <ButtonContainer>
                    <button onClick = {this.startStripe}>Pay</button>
                </ButtonContainer>
            </CheckoutItemContainer>
        );
    }
};

const CheckoutItemContainer = styled.div`
  width: 100%;
  display: flex;
  min-height: 100px;
  border-bottom: 1px solid darkgrey;
  padding: 15px 0;
  font-size: 20px;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 20%;
  padding-right: 40px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const TextContainer = styled.span`
  width: 23%;
`;

const StatusContainer = styled(TextContainer)`
  display: flex;
  padding-left: 20px;
  color: red;
  span {
    margin: 0 20px;
  }
  div {
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  padding-left: 12px;
  cursor: pointer;
  padding-bottom: 50px;
`;