const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      router = require('./routes'),
      PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/parkingdb", () => {
    app.listen(PORT, () => {
        console.log(`Listening at port ${PORT}.`);
    });
    console.log('Connected to database successfully');
});

require('./models/User');
require('./models/Floor');
require('./models/Vehicle');

app.use(express.json());
app.use(router);

