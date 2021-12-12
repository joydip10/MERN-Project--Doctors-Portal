import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Jxv1lDfbc3HDpGtfcSKRnJuGmQz4HOyxEytLNnkj1mvv3CB6ygW0WpnNsT9Boq2JxXXRpMDoQmpqOv29mhJE0dI00X25DVUvF');

const Payment = () => {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState({});
    useEffect(() => {
        fetch(`https://polar-wildwood-10966.herokuapp.com/appointments/${appointmentId}`)
            .then(res => res.json())
            .then(data => {
                setAppointment(data);
            })
    }, [appointmentId])
    return (
        <div>
            <h3>Payment for the appointment of: {appointment.patientName} for {appointment.serviceName}</h3>
            <h3>Pay: ${appointment.price}</h3>
            {
                (appointment.price) &&
                <Elements stripe={stripePromise}>
                    <CheckoutForm appointment={appointment} />
                </Elements>
            }
        </div>
    );
};

export default Payment;




/*
1. install stripe and stripe-react
2. set publishable key
3. Elements
4. Checkout Form
-----
5. Create payment method- is the card ok
6. server: create payment Intent api
7. Load client secret
8. ConfirmCard payment
9. handle user error
*/