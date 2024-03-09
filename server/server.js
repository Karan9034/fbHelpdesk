const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
require("dotenv").config();
const passport = require('./services/passport')


const app = express()
const PORT = process.env.PORT || 8000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        throw err;
    });

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api', require('./routes/api'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})