import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import StripePayment from '../StripePayment/StripePayment';
import axios from "axios";
import styled from 'styled-components';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm"
import {Auth} from 'aws-amplify';
export default class BidCartItem2 extends React.Component {
    constructor(props){
        super(props);
        this.state ={stripe:false,stripeP:''};
        this.startStripe = this.startStripe.bind(this);
    }

    async componentDidMount() {
        
    }
    async startStripe(event){
/*       const url = `https://api.stripe.com/v1/payment_intents`
      const auth = {
        username:'sk_test_Eylua5wcXgHoTlHYk0Og1upe00ENr8WpAi',
        password:''
      };
      let data = {};
      data['payment_method_types[]']= 'card';
      data['amount']=1000;
      data['currency']='usd';
      data['transfer_data[destination]']='acct_1GEXPGKzFt6viajs'
      let test = await axios.post(url,data,{auth:{
        username:'sk_test_Eylua5wcXgHoTlHYk0Og1upe00ENr8WpAi',
        password:''
      }});
      console.log(test); */
      let url = "https://in8hc6wee5.execute-api.us-east-1.amazonaws.com/stripe/stripe-payment";
      let amount = "500";
      let test = this.props.yourBid.toString();
      console.log(test);
      let accountID = "acct_1GEXPGKzFt6viajs";
      let postThis = url+"?amount="+amount+"&accountID="+accountID;
      console.log(postThis);
      const stripePromise = loadStripe("pk_test_NedNuvs9YOl1WOhanD0xfJtX00q2eAowF8");
      let logThis = await axios.get(postThis);
      console.log(logThis);
      this.setState({stripe:true});
      this.setState({stripeP:stripePromise})
    }
    render() {
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

                {(this.state.stripe) ? (<div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, backgroundColor: "rgba(0,0,0,0.25)"}}>
                  <div style={{backgroundColor: "white", border: "2px solid black", height: "50%", width: "50%", margin: "0 auto", marginTop: 150, padding: "10px 20px 10px 20px"}}>
                    <Elements stripe={this.state.stripeP}>
                      <CheckoutForm />
                    </Elements>
                  </div>
                </div>) : <br />}

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