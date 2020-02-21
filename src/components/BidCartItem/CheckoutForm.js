import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import {deleteItemTable,deleteUserBidsTable} from '../../../graphql/mutations';
import API, { graphqlOperation } from '@aws-amplify/api';
import CardSection from './CardSection';

export default function CheckoutForm(props) {
    console.log(props.clientInfo+"prps");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(props.clientInfo, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Test',
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        await API.graphql(graphqlOperation(deleteItemTable, {input:{itemID: this.props.prodID}})).then((evt) => {
        });
        await API.graphql(graphqlOperation(deleteUserBidsTable, {input:{ProductID: this.props.prodID}})).then((evt) => {
        });
        if(!alert('Alert For your User!')){window.location.reload();}
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
  );
}