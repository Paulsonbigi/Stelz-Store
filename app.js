const express = require("express")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")
const authRoute = require('./routes/auth.routes');
const userRoute = require('./routes/user.routes');

// initialize express app
const app = express();
app.use(cors());

// static file access
app.use(express.static(path.join(__dirname, '/public')));

// importing middlewares, reading data  from the req.body 
app.use(express.json({ limit: '10kb'}));

// importing middlewares
app.use(cookieParser());

// available apis
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        msg: "Route not defined"
    })
})

module.exports = app;