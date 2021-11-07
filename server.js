require('dotenv').config();
const express = require('express')
const app = express();
const ejs = require('ejs');
const path = require('path')
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
const passport = require('passport')
const Emitter  = require('events')
const PORT = process.env.PORT || 3000

//Database connection
const connection = async () => {
    
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URL, { useUnifiedTopology: true, useNewurlParser: true });
        console.log('database connected...');
    } catch (err) {
        console.log('connection field', err);
    }

}
connection();



//Session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

// session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }//24 hours

}))
//Passport cofig
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//Assests
app.use(express.static('public'))

app.use(express.urlencoded({extended:false}))

app.use(express.json());

//Global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


const server  =  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

// Socket connection

const io = require('socket.io')(server)

io.on('connection',(socket)=>{
        // join
    
        socket.on('join',(orderId)=>{
            socket.join(orderId)
        })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)

})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})