import axios from 'axios'
import { initadmin } from './admin'
import moment from 'moment'
import { initStripe } from './stripe'


let addToCart = document.querySelectorAll('.add-to-cart')

let cartCounter = document.querySelector('#cartCounter')

function updateCart(food) {
    axios.post('update-cart', food).then(res => {

        cartCounter.innerText = res.data.totalqty
    })
}
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {


        let food = JSON.parse(btn.dataset.food)
        updateCart(food)

    })
})

//Remove alert message after X second
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}



// change order 
let statuss = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')



function updateStatus(order) {
    statuss.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuss.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }

        }
    })

}

updateStatus(order);

initStripe()

// socket client side

let socket = io()


if (order) {
    socket.emit('join', `order_${order._id}`)

}

let adminArea = window.location.pathname
if (adminArea.includes('admin')) {
    initadmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)

})


