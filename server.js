const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({path: './config/config.env'});

const app = express();

// Route Files

const bootcamps = require('./routes/bootcamps.js');


// Mount Router

app.use('/api/v1/bootcamp',bootcamps);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`The server is running in ${process.env.NODE_ENV} mode on ${PORT}`);
});