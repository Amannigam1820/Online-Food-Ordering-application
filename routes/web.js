const homeContoller = require('../app/http/controllers/homeController');
const authContoller = require('../app/http/controllers/authController');
const cartContoller = require('../app/http/controllers/customers/cartController');
const orderContoller = require('../app/http/controllers/customers/orderController')
const adminOrderContoller = require('../app/http/controllers/admin/orderController')
const statusContoller = require('../app/http/controllers/admin/statusController')

//MiddleWare

const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')


function initRoutes(app) {
    app.get('/', homeContoller().index)



    app.get('/login', guest, authContoller().login);
    app.post('/login', authContoller().postLogin)

    app.get('/register', guest, authContoller().register);
    app.post('/register', authContoller().postRegister)

    app.post('/logout', authContoller().logout)

    app.get('/cart', cartContoller().index);
    app.post('/update-cart', cartContoller().update)



    //Customer Route
    app.post('/orders', auth, orderContoller().store)
    app.get('/customer/orders', auth, orderContoller().index)
    app.get('/customer/orders/:id',auth, orderContoller().show)

    //Admin routes
    app.get('/admin/orders', admin, adminOrderContoller().index)


    app.post('/admin/order/status', admin, statusContoller().update)


}

module.exports = initRoutes