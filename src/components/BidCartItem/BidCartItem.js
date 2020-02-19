import React, {useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import StripePayment from '../StripePayment/StripePayment';
import axios from "axios";
import styled from 'styled-components';

const BidCartItem = (
    {
        title,
        id,
        img,
    }
) => {
    const users = useSelector(state => state.username.username);

    const [bidInfo, setBidInfo] = useState ({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get
            (`https://vhwckrva1j.execute-api.us-east-1.amazonaws.com/default/FetchBidsForCheckout?Username=${users}&ProductID=${id}`,);
            setBidInfo(result.data);
        };
        fetchData();
    }, [id]);

    return (
        <CheckoutItemContainer>
            <ImageContainer>
                <img src={img} alt="item" />
            </ImageContainer>
            <TextContainer>
                <Link to={`/products/${id}`}>{title}</Link>
            </TextContainer>
            <StatusContainer>
                {bidInfo.Status}
            </StatusContainer>
            <TextContainer>${bidInfo.BidAmt}</TextContainer>
                {bidInfo.Status === "Won" ? (
                    <ButtonContainer>
                        <StripePayment price={bidInfo.BidAmt} />
                    </ButtonContainer>
                ):(<ButtonContainer>
                    <StripePayment disabled price={bidInfo.BidAmt} />
                </ButtonContainer>)}

        </CheckoutItemContainer>
    );
};

export default connect()(BidCartItem);

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