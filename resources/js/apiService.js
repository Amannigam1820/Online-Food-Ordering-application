import axios from "axios"

export function placeOrder(formObj){
    axios.post('/orders',formObj).then((res)=>{
        
        window.location.href = '/customer/orders'
    }).catch((err)=>{
        console.log(err)
    })
}