const express = require('express');
const cors = require('cors');
require('dotenv').config();


// MONGODB CONNECTION
require("./database/connection");

// Express app
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Endpoints//////////////////////////////////////////

//dashboard app 
const dashboardEndpoints = require('./routes/dashboardRoutes');
app.use('/dashboard', dashboardEndpoints);


const PORT = process.env.PORT || 4000;

// Listen for requests
app.listen(PORT, () => {
    console.log(`Welcome to SK server on port ${PORT}`);
});



