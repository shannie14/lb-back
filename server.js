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

const salesEndpoints = require('./routes/salesRoutes');
app.use('/sales', salesEndpoints);

const dailyEndpoints = require('./routes/dailyRoutes');
app.use('/daily', dailyEndpoints);

const audienceEndpoints = require('./routes/audienceRoutes');
app.use('/audience', audienceEndpoints);

const PORT = process.env.PORT || 4000;

// Listen for requests
app.listen(PORT, () => {
    console.log(`Welcome to SK server on port ${PORT}`);
});



