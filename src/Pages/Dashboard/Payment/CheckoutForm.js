import { CircularProgress } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import useAuth from './../../../hooks/useAuth';

const CheckoutForm = ({ appointment }) => {
    const { price,_id} = appointment;
    const stripe = useStripe();
    const elements = useElements();
    const [error,setError]=useState('');
    const [clientSecret,setClientSecret]=useState('');
    const [success,setSuccess]=useState('');
    const [processing,setProcessing]=useState(false);
    
    const {user}=useAuth();
    useEffect(() => {
        fetch('https://polar-wildwood-10966.herokuapp.com/create-payment-intent', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ price })
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, [price]);

    console.log('Client Secret',clientSecret);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        setProcessing(true);
        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });
        if(error){
            setError(error.message);
            setProcessing(false);
            setSuccess('');
        }
        else{
            setError('');
            console.log(paymentMethod);
        }

        //paymentIntent
        const {paymentIntent, error:intenterror} = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: card,
                billing_details: {
                  name: appointment.patientName,
                  email:user.email                 
                },
              },
            },
          );

          if(intenterror){
              setError(intenterror.message);
              setSuccess('');
          }
          else{
              setError('');
              setSuccess('Your payment has been processed successfully!');
              console.log(paymentIntent);
              setProcessing(false);
              //save to database
              const payment = {
                amount: paymentIntent.amount,
                created: paymentIntent.created,
                last4: paymentMethod.card.last4,
                transaction: paymentIntent.client_secret.slice('_secret')[0]
            }
            const url = `https://polar-wildwood-10966.herokuapp.com/appointments/${_id}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(payment)
            })
                .then(res => res.json())
                .then(data => console.log(data));
        }

          
    }
    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            { (processing===true)?<CircularProgress/>:<button type="submit" disabled={!stripe || success}>
                Pay ${price}
            </button>
            }
            {
                <h6 style={{color:'red'}}>{error}</h6>
            }
            {
                <h6 style={{color:'green'}}>{success}</h6>
            }
        </form>
    );
};

export default CheckoutForm;