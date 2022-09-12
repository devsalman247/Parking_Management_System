const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    router = require('./routes'),
    PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/parkingdb", () => {
    console.log('Connected to database successfully');
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}.`);
});