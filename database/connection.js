require('dotenv').config();
const mongoose = require("mongoose");

const DB = process.env.MONGO_URI;
console.log('db', DB);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("SK db connected");
    })
    .catch((err) => console.log(err));
