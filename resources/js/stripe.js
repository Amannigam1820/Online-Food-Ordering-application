import { placeOrder } from './apiService';
import { loadStripe } from '@stripe/stripe-js'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51Jt3EeSFIB6g0JZ9gK0DOBnuHyCmbeuSsqxwFiAWpMBn21KGK9zm6UynCHcrrNMhiLXytD0fxOGfCMaemgiHCAS8003hL5dFTs')

    let card = null;

    function mountWidget() {
        const elements = stripe.elements()
        let style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue",Helvetica,sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
        card = elements.create('card', { style, hidePostalCode: true })
        card.mount('#card-Element')
    }


    const paymentType = document.querySelector('#paymentType')
    if (!paymentType) {
        return;

    }
    paymentType.addEventListener('change', (e) => {

        console.log(e.target.value)
        if (e.target.value === 'card') {
            // Display Widget
            mountWidget();
        } else {
            card.destroy()
        }


    })


    //Ajax Call
    const paymentForm = document.querySelector('#payment-form')
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let formData = new FormData(paymentForm)
            let formObj = {}
            for (let [key, value] of formData.entries()) {
                formObj[key] = value

            }
            if (!card) {
                //Ajax
                placeOrder(formObj);
                return;
            }
            //verify card
            stripe.createToken(card).then((result) => {
          
                formObj.stripeToken = result.token.id
                placeOrder(formObj)

            }).catch((err) => {
                console.log(err)
            })
           
        })
    }

}